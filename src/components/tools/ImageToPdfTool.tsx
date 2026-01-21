import { useState } from "react";
import { FileUploadZone } from "@/components/FileUploadZone";
import { Button } from "@/components/ui/button";
import { FileImage, Loader2, GripVertical } from "lucide-react";
import { callFastAPI } from "@/lib/api";
import { toast } from "sonner";

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
}

export function ImageToPdfTool() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const moveFile = (index: number, direction: "up" | "down") => {
    const newFiles = [...files];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= files.length) return;
    [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
    setFiles(newFiles);
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setIsProcessing(true);
    try {
      const formData = new FormData();
      files.forEach((f, i) => {
        formData.append(`file_${i}`, f.file);
      });

      const data = await callFastAPI("/image-to-pdf", formData);

      const blob = new Blob([Uint8Array.from(atob(data.pdf), c => c.charCodeAt(0))], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "images.pdf";
      a.click();
      URL.revokeObjectURL(url);

      toast.success("Images converted to PDF successfully!");
      setFiles([]);
    } catch (error) {
      console.error("Convert error:", error);
      toast.error("Failed to convert images. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Image to PDF</h2>
        <p className="text-muted-foreground">
          Combine multiple images into a single PDF document
        </p>
      </div>

      <FileUploadZone
        accept="image/*"
        multiple
        maxSize={50}
        files={files}
        onFilesChange={setFiles}
        title="Drop images here"
        description="or click to select images"
      />

      {files.length > 1 && (
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-sm text-muted-foreground mb-3">Reorder images:</p>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
              >
                <GripVertical className="w-4 h-4 text-muted-foreground" />
                {file.preview && (
                  <img src={file.preview} alt="" className="w-10 h-10 rounded object-cover" />
                )}
                <span className="flex-1 text-sm font-medium truncate text-foreground">
                  {index + 1}. {file.file.name}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => moveFile(index, "up")}
                    disabled={index === 0}
                  >
                    ↑
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => moveFile(index, "down")}
                    disabled={index === files.length - 1}
                  >
                    ↓
                  </Button>
                </div>
              </div>
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
              <FileImage className="w-5 h-5 mr-2" />
              Convert to PDF
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
