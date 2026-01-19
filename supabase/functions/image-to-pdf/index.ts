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
    const files: File[] = [];
    
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("file_") && value instanceof File) {
        files.push(value);
      }
    }

    if (files.length === 0) {
      return new Response(
        JSON.stringify({ error: "At least 1 image required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Converting ${files.length} images to PDF`);

    const pdfDoc = await PDFDocument.create();

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      let image;
      if (file.type === "image/png") {
        image = await pdfDoc.embedPng(uint8Array);
      } else if (file.type === "image/jpeg" || file.type === "image/jpg") {
        image = await pdfDoc.embedJpg(uint8Array);
      } else {
        // Try as JPEG for other formats
        try {
          image = await pdfDoc.embedJpg(uint8Array);
        } catch {
          image = await pdfDoc.embedPng(uint8Array);
        }
      }

      const page = pdfDoc.addPage([image.width, image.height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      });
    }

    const pdfBytes = await pdfDoc.save();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(pdfBytes)));

    console.log("Image to PDF conversion complete");

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
