import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { PDFDocument, StandardFonts, rgb } from "https://cdn.skypack.dev/pdf-lib@1.17.1";

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

    if (!file) {
      return new Response(
        JSON.stringify({ error: "DOC/DOCX file required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Converting ${file.name} to PDF`);

    // Extract text from DOCX (simplified - just reads raw text content)
    const arrayBuffer = await file.arrayBuffer();
    const text = await extractTextFromDocx(arrayBuffer);

    // Create PDF with extracted text
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    const fontSize = 12;
    const lineHeight = fontSize * 1.5;
    const margin = 50;
    const pageWidth = 612;
    const pageHeight = 792;
    const maxWidth = pageWidth - margin * 2;
    
    const lines = wrapText(text, font, fontSize, maxWidth);
    let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
    let y = pageHeight - margin;

    for (const line of lines) {
      if (y < margin) {
        currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
      }
      
      currentPage.drawText(line, {
        x: margin,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      
      y -= lineHeight;
    }

    const pdfBytes = await pdfDoc.save();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(pdfBytes)));

    console.log("DOC to PDF conversion complete");

    return new Response(
      JSON.stringify({ pdf: base64 }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Convert error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function extractTextFromDocx(arrayBuffer: ArrayBuffer): Promise<string> {
  // Simple text extraction - looks for text content in DOCX
  const decoder = new TextDecoder("utf-8");
  const content = decoder.decode(arrayBuffer);
  
  // Extract text between XML tags (simplified)
  const textMatches = content.match(/<w:t[^>]*>([^<]*)<\/w:t>/g) || [];
  const text = textMatches
    .map(match => match.replace(/<[^>]+>/g, ""))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  
  return text || "Unable to extract text from document. Please ensure it's a valid DOCX file.";
}

function wrapText(text: string, font: any, fontSize: number, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const width = font.widthOfTextAtSize(testLine, fontSize);
    
    if (width <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  
  if (currentLine) lines.push(currentLine);
  return lines;
}
