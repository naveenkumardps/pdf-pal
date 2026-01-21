import { useState } from "react";
import { FileUploadZone } from "@/components/FileUploadZone";
import { Button } from "@/components/ui/button";
import { Edit3, Loader2, Type, Pencil, ArrowUpDown, Trash2 } from "lucide-react";
import { callFastAPI } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
}

type EditMode = "text" | "draw" | "rearrange" | "delete";

const editModes: { mode: EditMode; label: string; icon: React.ElementType; description: string }[] = [
  { mode: "text", label: "Add Text", icon: Type, description: "Add text annotations" },
  { mode: "draw", label: "Draw", icon: Pencil, description: "Draw and highlight" },
  { mode: "rearrange", label: "Rearrange", icon: ArrowUpDown, description: "Reorder pages" },
  { mode: "delete", label: "Delete Pages", icon: Trash2, description: "Remove pages" },
];

export function EditTool() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [editMode, setEditMode] = useState<EditMode>("text");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleEdit = async () => {
    if (files.length === 0) {
      toast.error("Please upload a PDF file");
      return;
    }

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file", files[0].file);
      formData.append("mode", editMode);

      const data = await callFastAPI("/edit-pdf", formData);

      const blob = new Blob([Uint8Array.from(atob(data.pdf), c => c.charCodeAt(0))], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "edited.pdf";
      a.click();
      URL.revokeObjectURL(url);

      toast.success("PDF edited successfully!");
      setFiles([]);
    } catch (error) {
      console.error("Edit error:", error);
      toast.error("Failed to edit PDF. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Edit PDF</h2>
        <p className="text-muted-foreground">
          Add text, draw, rearrange or delete pages
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
          <p className="text-sm text-muted-foreground mb-3">Select edit mode:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {editModes.map((mode) => {
              const Icon = mode.icon;
              return (
                <button
                  key={mode.mode}
                  onClick={() => setEditMode(mode.mode)}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all text-center",
                    editMode === mode.mode
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 bg-card"
                  )}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <span className="font-semibold text-foreground text-sm">{mode.label}</span>
                  <p className="text-xs text-muted-foreground mt-1">{mode.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <Button
          onClick={handleEdit}
          disabled={files.length === 0 || isProcessing}
          size="lg"
          className="gradient-primary text-primary-foreground px-8"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Edit3 className="w-5 h-5 mr-2" />
              Edit PDF
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
