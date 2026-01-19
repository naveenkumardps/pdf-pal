import { useState } from "react";
import { FileUploadZone } from "@/components/FileUploadZone";
import { Button } from "@/components/ui/button";
import { Combine, Loader2, GripVertical, ArrowUpDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
}

export function MergeTool() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const moveFile = (index: number, direction: "up" | "down") => {
    const newFiles = [...files];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= files.length) return;
    [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
    setFiles(newFiles);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      toast.error("Please upload at least 2 PDF files to merge");
      return;
    }

    setIsProcessing(true);
    try {
      const formData = new FormData();
      files.forEach((f, i) => {
        formData.append(`file_${i}`, f.file);
      });

      const { data, error } = await supabase.functions.invoke("merge-pdf", {
        body: formData,
      });

      if (error) throw error;

      // Download the merged PDF
      const blob = new Blob([Uint8Array.from(atob(data.pdf), c => c.charCodeAt(0))], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      a.click();
      URL.revokeObjectURL(url);

      toast.success("PDFs merged successfully!");
      setFiles([]);
    } catch (error) {
      console.error("Merge error:", error);
      toast.error("Failed to merge PDFs. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Merge PDF Files</h2>
        <p className="text-muted-foreground">
          Combine multiple PDF files into a single document
        </p>
      </div>

      <FileUploadZone
        accept=".pdf,application/pdf"
        multiple
        maxSize={50}
        files={files}
        onFilesChange={setFiles}
        title="Drop PDF files here"
        description="or click to select files"
      />

      {files.length > 1 && (
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-3 text-muted-foreground">
            <ArrowUpDown className="w-4 h-4" />
            <span className="text-sm font-medium">Reorder files (drag or use arrows)</span>
          </div>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
              >
                <GripVertical className="w-4 h-4 text-muted-foreground" />
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
          onClick={handleMerge}
          disabled={files.length < 2 || isProcessing}
          size="lg"
          className="gradient-primary text-primary-foreground px-8"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Merging...
            </>
          ) : (
            <>
              <Combine className="w-5 h-5 mr-2" />
              Merge {files.length} PDF{files.length !== 1 ? "s" : ""}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
