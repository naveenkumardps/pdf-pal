import { useState } from "react";
import { FileUploadZone } from "@/components/FileUploadZone";
import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import { callFastAPI } from "@/lib/api";
import { toast } from "sonner";

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
}

export function DocToPdfTool() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConvert = async () => {
    if (files.length === 0) {
      toast.error("Please upload a DOC/DOCX file");
      return;
    }

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file", files[0].file);

      const data = await callFastAPI("/doc-to-pdf", formData);

      const blob = new Blob([Uint8Array.from(atob(data.pdf), c => c.charCodeAt(0))], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = files[0].file.name.replace(/\.(doc|docx)$/i, ".pdf");
      a.click();
      URL.revokeObjectURL(url);

      toast.success("Document converted to PDF successfully!");
      setFiles([]);
    } catch (error) {
      console.error("Convert error:", error);
      toast.error("Failed to convert document. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">DOC to PDF</h2>
        <p className="text-muted-foreground">
          Convert Word documents to PDF format
        </p>
      </div>

      <FileUploadZone
        accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        multiple={false}
        maxSize={50}
        files={files}
        onFilesChange={setFiles}
        title="Drop DOC/DOCX file here"
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
              <FileText className="w-5 h-5 mr-2" />
              Convert to PDF
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
