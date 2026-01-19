import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { PDFDocument } from "https://cdn.skypack.dev/pdf-lib@1.17.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const pageRange = formData.get("pageRange") as string || "all";

    if (!file) {
      return new Response(
        JSON.stringify({ error: "PDF file required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Splitting PDF with range: ${pageRange}`);

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const totalPages = pdf.getPageCount();

    let pageIndices: number[] = [];
    
    if (pageRange === "all") {
      pageIndices = Array.from({ length: totalPages }, (_, i) => i);
    } else {
      const ranges = pageRange.split(",").map(r => r.trim());
      for (const range of ranges) {
        if (range.includes("-")) {
          const [start, end] = range.split("-").map(n => parseInt(n.trim()) - 1);
          for (let i = start; i <= Math.min(end, totalPages - 1); i++) {
            if (!pageIndices.includes(i)) pageIndices.push(i);
          }
        } else {
          const page = parseInt(range) - 1;
          if (page >= 0 && page < totalPages && !pageIndices.includes(page)) {
            pageIndices.push(page);
          }
        }
      }
    }

    const pdfs: string[] = [];
    for (const pageIndex of pageIndices) {
      const newPdf = await PDFDocument.create();
      const [page] = await newPdf.copyPages(pdf, [pageIndex]);
      newPdf.addPage(page);
      const pdfBytes = await newPdf.save();
      pdfs.push(btoa(String.fromCharCode(...new Uint8Array(pdfBytes))));
    }

    console.log(`Split into ${pdfs.length} PDFs`);

    return new Response(
      JSON.stringify({ pdfs }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Split error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
