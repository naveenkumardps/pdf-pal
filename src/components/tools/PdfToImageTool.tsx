import { useState } from "react";
import { FileUploadZone } from "@/components/FileUploadZone";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Image, Loader2 } from "lucide-react";
import { callFastAPI } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
}

type ImageFormat = "png" | "jpg";

export function PdfToImageTool() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [format, setFormat] = useState<ImageFormat>("png");
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
      formData.append("format", format);

      const data = await callFastAPI("/pdf-to-image", formData);

      // Download the images
      if (data.images && Array.isArray(data.images)) {
        data.images.forEach((imageData: string, index: number) => {
          const blob = new Blob([Uint8Array.from(atob(imageData), c => c.charCodeAt(0))], {
            type: format === "png" ? "image/png" : "image/jpeg",
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `page_${index + 1}.${format}`;
          a.click();
          URL.revokeObjectURL(url);
        });
      }

      toast.success("PDF converted to images successfully!");
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
        <h2 className="text-2xl font-bold text-foreground mb-2">PDF to Image</h2>
        <p className="text-muted-foreground">
          Convert PDF pages to PNG or JPG images
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
          <Label className="text-foreground mb-3 block">Output Format</Label>
          <div className="grid grid-cols-2 gap-3">
            {(["png", "jpg"] as ImageFormat[]).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormat(fmt)}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all text-center",
                  format === fmt
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50 bg-card"
                )}
              >
                <span className="font-semibold text-foreground uppercase">{fmt}</span>
                <p className="text-xs text-muted-foreground mt-1">
                  {fmt === "png" ? "Lossless quality" : "Smaller file size"}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

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
              <Image className="w-5 h-5 mr-2" />
              Convert to {format.toUpperCase()}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
