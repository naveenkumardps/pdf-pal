import { useState } from "react";
import { FileUploadZone } from "@/components/FileUploadZone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Split, Loader2 } from "lucide-react";
import { apiClient, downloadBlob } from "@/lib/api";
import { toast } from "sonner";

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
}

export function SplitTool() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [pageRange, setPageRange] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSplit = async () => {
    if (files.length === 0) {
      toast.error("Please upload a PDF file");
      return;
    }

    setIsProcessing(true);
    try {
      const blob = await apiClient.splitPDF(files[0].file, pageRange || undefined);
      
      // Download the split result (could be a single PDF or a zip of multiple PDFs)
      const filename = blob.type === "application/zip" ? "split_pages.zip" : "split.pdf";
      downloadBlob(blob, filename);

      toast.success("PDF split successfully!");
      setFiles([]);
      setPageRange("");
    } catch (error) {
      console.error("Split error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to split PDF. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Split PDF</h2>
        <p className="text-muted-foreground">
          Extract specific pages or split into individual files
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

      {files.length > 0 && (
        <div className="bg-card rounded-xl p-4 border border-border">
          <Label htmlFor="pageRange" className="text-foreground">
            Page Range (optional)
          </Label>
          <Input
            id="pageRange"
            value={pageRange}
            onChange={(e) => setPageRange(e.target.value)}
            placeholder="e.g., 1-3, 5, 7-10 (leave empty for all pages)"
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Specify page ranges separated by commas. Leave empty to split into individual pages.
          </p>
        </div>
      )}

      <div className="flex justify-center">
        <Button
          onClick={handleSplit}
          disabled={files.length === 0 || isProcessing}
          size="lg"
          className="gradient-primary text-primary-foreground px-8"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Splitting...
            </>
          ) : (
            <>
              <Split className="w-5 h-5 mr-2" />
              Split PDF
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
