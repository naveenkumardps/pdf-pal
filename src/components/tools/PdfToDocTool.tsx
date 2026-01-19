import { useState } from "react";
import { FileUploadZone } from "@/components/FileUploadZone";
import { Button } from "@/components/ui/button";
import { FileOutput, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
}

export function PdfToDocTool() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConvert = async () => {
    if (files.length === 0) {
      toast.error("Please upload a PDF file");
      return;
    }

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file", files[0].file);

      const { data, error } = await supabase.functions.invoke("pdf-to-doc", {
        body: formData,
      });

      if (error) throw error;

      const blob = new Blob([Uint8Array.from(atob(data.doc), c => c.charCodeAt(0))], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = files[0].file.name.replace(/\.pdf$/i, ".docx");
      a.click();
      URL.revokeObjectURL(url);

      toast.success("PDF converted to DOC successfully!");
      setFiles([]);
    } catch (error) {
      console.error("Convert error:", error);
      toast.error("Failed to convert PDF. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">PDF to DOC</h2>
        <p className="text-muted-foreground">
          Convert PDF documents to editable Word format
        </p>
      </div>

      <FileUploadZone
        accept=".pdf,application/pdf"
        multiple={false}
        maxSize={50}
        files={files}
        onFilesChange={setFiles}
        title="Drop PDF file here"
        description="or click to select file"
      />

      <div className="flex justify-center">
        <Button
          onClick={handleConvert}
          disabled={files.length === 0 || isProcessing}
          size="lg"
          className="gradient-primary text-primary-foreground px-8"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Converting...
            </>
          ) : (
            <>
              <FileOutput className="w-5 h-5 mr-2" />
              Convert to DOC
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
