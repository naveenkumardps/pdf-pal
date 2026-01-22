import { useState } from "react";
import { FileUploadZone } from "@/components/FileUploadZone";
import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import { apiClient, downloadBlob } from "@/lib/api";
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
      const blob = await apiClient.docToPDF(files[0].file);
      
      downloadBlob(blob, files[0].file.name.replace(/\.(doc|docx)$/i, ".pdf"));

      toast.success("Document converted to PDF successfully!");
      setFiles([]);
    } catch (error) {
      console.error("Convert error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to convert document. Please try again.");
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
