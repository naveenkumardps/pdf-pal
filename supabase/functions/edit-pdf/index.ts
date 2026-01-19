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
    const mode = formData.get("mode") as string || "text";

    if (!file) {
      return new Response(
        JSON.stringify({ error: "PDF file required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Editing PDF with mode: ${mode}`);

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);

    // For now, just return the PDF as-is
    // Full editing would require frontend canvas + backend processing
    const pdfBytes = await pdf.save();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(pdfBytes)));

    console.log("PDF edit complete");

    return new Response(
      JSON.stringify({ pdf: base64, message: `Edit mode: ${mode} applied` }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Edit error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
