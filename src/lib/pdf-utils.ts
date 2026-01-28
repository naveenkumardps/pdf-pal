import { PDFDocument, degrees } from "pdf-lib";
import * as pdfjs from "pdfjs-dist";

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Helper function to download a blob
export function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

// Helper to convert Uint8Array to Blob
function uint8ArrayToBlob(data: Uint8Array, type: string): Blob {
  return new Blob([new Uint8Array(data)], { type });
}

// Merge multiple PDFs into one
export async function mergePDFs(files: File[]): Promise<Blob> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const mergedPdfBytes = await mergedPdf.save();
  return uint8ArrayToBlob(mergedPdfBytes, "application/pdf");
}

// Parse page range string (e.g., "1-3, 5, 7-10") into array of page numbers
function parsePageRange(rangeStr: string, totalPages: number): number[] {
  const pages: Set<number> = new Set();
  const parts = rangeStr.split(",").map((s) => s.trim());

  for (const part of parts) {
    if (part.includes("-")) {
      const [start, end] = part.split("-").map((n) => parseInt(n.trim(), 10));
      for (let i = start; i <= end && i <= totalPages; i++) {
        if (i >= 1) pages.add(i - 1); // Convert to 0-indexed
      }
    } else {
      const pageNum = parseInt(part, 10);
      if (pageNum >= 1 && pageNum <= totalPages) {
        pages.add(pageNum - 1); // Convert to 0-indexed
      }
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}

// Split PDF - extract specific pages or all pages individually
export async function splitPDF(file: File, pageRange?: string): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const totalPages = pdf.getPageCount();

  if (pageRange) {
    // Extract specific pages into a single PDF
    const pageIndices = parsePageRange(pageRange, totalPages);
    const newPdf = await PDFDocument.create();
    const copiedPages = await newPdf.copyPages(pdf, pageIndices);
    copiedPages.forEach((page) => newPdf.addPage(page));
    const pdfBytes = await newPdf.save();
    return uint8ArrayToBlob(pdfBytes, "application/pdf");
  } else {
    // Split into individual pages - return as zip
    const { default: JSZip } = await import("jszip");
    const zip = new JSZip();

    for (let i = 0; i < totalPages; i++) {
      const singlePagePdf = await PDFDocument.create();
      const [copiedPage] = await singlePagePdf.copyPages(pdf, [i]);
      singlePagePdf.addPage(copiedPage);
      const pdfBytes = await singlePagePdf.save();
      zip.file(`page_${i + 1}.pdf`, pdfBytes);
    }

    return await zip.generateAsync({ type: "blob" });
  }
}

// Compress PDF (client-side compression is limited)
export async function compressPDF(file: File, _quality: "low" | "medium" | "high" = "medium"): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  
  // pdf-lib doesn't have built-in compression, but we can try to optimize
  // by removing unused objects when saving
  const pdfBytes = await pdf.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });
  
  return uint8ArrayToBlob(pdfBytes, "application/pdf");
}

// Convert PDF pages to images
export async function pdfToImages(file: File, format: "png" | "jpg" = "png", scale: number = 2): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;

  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });
    
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d")!;

    await page.render({ canvasContext: ctx, viewport }).promise;

    const dataUrl = canvas.toDataURL(format === "jpg" ? "image/jpeg" : "image/png", 0.9);
    const base64Data = dataUrl.split(",")[1];
    zip.file(`page_${i}.${format}`, base64Data, { base64: true });
  }

  return await zip.generateAsync({ type: "blob" });
}

// Convert images to PDF
export async function imagesToPDF(files: File[]): Promise<Blob> {
  const pdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    let image;
    const type = file.type.toLowerCase();
    
    if (type === "image/png") {
      image = await pdf.embedPng(uint8Array);
    } else if (type === "image/jpeg" || type === "image/jpg") {
      image = await pdf.embedJpg(uint8Array);
    } else {
      // Convert other formats to PNG using canvas
      const img = await loadImage(file);
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      
      const dataUrl = canvas.toDataURL("image/png");
      const base64Data = dataUrl.split(",")[1];
      const pngBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
      image = await pdf.embedPng(pngBytes);
    }

    const page = pdf.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
  }

  const pdfBytes = await pdf.save();
  return uint8ArrayToBlob(pdfBytes, "application/pdf");
}

// Helper to load image
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

// Rotate PDF pages
export async function rotatePDF(file: File, angle: 90 | 180 | 270): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  
  const pages = pdf.getPages();
  for (const page of pages) {
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees((currentRotation + angle) % 360));
  }

  const pdfBytes = await pdf.save();
  return uint8ArrayToBlob(pdfBytes, "application/pdf");
}

// Delete specific pages from PDF
export async function deletePages(file: File, pagesToDelete: string): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const totalPages = pdf.getPageCount();
  
  const deleteIndices = parsePageRange(pagesToDelete, totalPages);
  
  // Remove pages in reverse order to maintain correct indices
  for (let i = deleteIndices.length - 1; i >= 0; i--) {
    pdf.removePage(deleteIndices[i]);
  }

  const pdfBytes = await pdf.save();
  return uint8ArrayToBlob(pdfBytes, "application/pdf");
}

// Reorder pages in PDF
export async function reorderPages(file: File, newOrder: string): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const srcPdf = await PDFDocument.load(arrayBuffer);
  const totalPages = srcPdf.getPageCount();
  
  const orderIndices = newOrder.split(",").map((n) => parseInt(n.trim(), 10) - 1);
  
  // Validate order
  if (orderIndices.some((i) => i < 0 || i >= totalPages)) {
    throw new Error("Invalid page order");
  }

  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(srcPdf, orderIndices);
  copiedPages.forEach((page) => newPdf.addPage(page));

  const pdfBytes = await newPdf.save();
  return uint8ArrayToBlob(pdfBytes, "application/pdf");
}
