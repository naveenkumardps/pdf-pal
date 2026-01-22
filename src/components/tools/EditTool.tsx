import { useState } from "react";
import { FileUploadZone } from "@/components/FileUploadZone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit3, Loader2, ArrowUpDown, Trash2 } from "lucide-react";
import { apiClient, downloadBlob } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
}

type EditMode = "rearrange" | "delete";

const editModes: { mode: EditMode; label: string; icon: React.ElementType; description: string }[] = [
  { mode: "rearrange", label: "Rearrange", icon: ArrowUpDown, description: "Reorder pages" },
  { mode: "delete", label: "Delete Pages", icon: Trash2, description: "Remove pages" },
];

export function EditTool() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [editMode, setEditMode] = useState<EditMode>("rearrange");
  const [pageInput, setPageInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleEdit = async () => {
    if (files.length === 0) {
      toast.error("Please upload a PDF file");
      return;
    }

    if (!pageInput.trim()) {
      toast.error("Please enter page numbers");
      return;
    }

    setIsProcessing(true);
    try {
      let blob: Blob;
      
      if (editMode === "delete") {
        blob = await apiClient.deletePages(files[0].file, pageInput);
        downloadBlob(blob, "pages_deleted.pdf");
        toast.success("Pages deleted successfully!");
      } else {
        blob = await apiClient.reorderPages(files[0].file, pageInput);
        downloadBlob(blob, "reordered.pdf");
        toast.success("Pages reordered successfully!");
      }
      
      setFiles([]);
      setPageInput("");
    } catch (error) {
      console.error("Edit error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to edit PDF. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Edit PDF Pages</h2>
        <p className="text-muted-foreground">
          Rearrange or delete pages from your PDF
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
        <>
          <div className="bg-card rounded-xl p-4 border border-border">
            <Label className="text-foreground mb-3 block">Select Edit Mode</Label>
            <div className="grid grid-cols-2 gap-3">
              {editModes.map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.mode}
                    onClick={() => {
                      setEditMode(mode.mode);
                      setPageInput("");
                    }}
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

          <div className="bg-card rounded-xl p-4 border border-border">
            <Label htmlFor="pageInput" className="text-foreground">
              {editMode === "delete" ? "Pages to Delete" : "New Page Order"}
            </Label>
            <Input
              id="pageInput"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              placeholder={
                editMode === "delete"
                  ? "e.g., 1,3,5 (pages to remove)"
                  : "e.g., 3,1,2,4 (new order)"
              }
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {editMode === "delete"
                ? "Enter page numbers separated by commas to delete those pages"
                : "Enter page numbers in the order you want them to appear"}
            </p>
          </div>
        </>
      )}

      <div className="flex justify-center">
        <Button
          onClick={handleEdit}
          disabled={files.length === 0 || isProcessing || !pageInput.trim()}
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
              {editMode === "delete" ? "Delete Pages" : "Reorder Pages"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
