import { useState } from "react";
import { FileUploadZone } from "@/components/FileUploadZone";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Minimize2, Loader2 } from "lucide-react";
import { apiClient, downloadBlob } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
}

type CompressionLevel = "low" | "medium" | "high";

const compressionOptions: { level: CompressionLevel; label: string; description: string }[] = [
  { level: "low", label: "Low", description: "Best quality, larger file" },
  { level: "medium", label: "Medium", description: "Good balance" },
  { level: "high", label: "High", description: "Smallest file, lower quality" },
];

export function CompressTool() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>("medium");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCompress = async () => {
    if (files.length === 0) {
      toast.error("Please upload a PDF file");
      return;
    }

    setIsProcessing(true);
    try {
      const blob = await apiClient.compressPDF(files[0].file, compressionLevel);
      
      const originalSize = files[0].file.size;
      const compressedSize = blob.size;
      const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(1);

      downloadBlob(blob, "compressed.pdf");
      
      toast.success(`PDF compressed! Size reduced by ${reduction}%`);
      setFiles([]);
    } catch (error) {
      console.error("Compress error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to compress PDF. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Compress PDF</h2>
        <p className="text-muted-foreground">
          Reduce the file size of your PDF document
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
          <Label className="text-foreground mb-3 block">Compression Level</Label>
          <div className="grid grid-cols-3 gap-3">
            {compressionOptions.map((option) => (
              <button
                key={option.level}
                onClick={() => setCompressionLevel(option.level)}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all text-center",
                  compressionLevel === option.level
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50 bg-card"
                )}
              >
                <span className="font-semibold text-foreground">{option.label}</span>
                <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <Button
          onClick={handleCompress}
          disabled={files.length === 0 || isProcessing}
          size="lg"
          className="gradient-primary text-primary-foreground px-8"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Compressing...
            </>
          ) : (
            <>
              <Minimize2 className="w-5 h-5 mr-2" />
              Compress PDF
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
