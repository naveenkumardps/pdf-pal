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
    const level = formData.get("level") as string || "medium";

    if (!file) {
      return new Response(
        JSON.stringify({ error: "PDF file required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Compressing PDF with level: ${level}`);

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    
    // pdf-lib compresses by default when saving
    const pdfBytes = await pdf.save({
      useObjectStreams: true,
    });

    const base64 = btoa(String.fromCharCode(...new Uint8Array(pdfBytes)));

    console.log(`Compression complete. Original: ${file.size}, New: ${pdfBytes.length}`);

    return new Response(
      JSON.stringify({ pdf: base64, originalSize: file.size, newSize: pdfBytes.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Compress error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
