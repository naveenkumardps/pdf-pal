import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { Upload, X, FileText, Image as ImageIcon, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PDFPagePreview } from "./PDFPagePreview";

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
}

interface FileUploadZoneProps {
  accept: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  title: string;
  description: string;
  showPDFPreview?: boolean;
}

export function FileUploadZone({
  accept,
  multiple = true,
  maxSize = 50,
  files,
  onFilesChange,
  title,
  description,
  showPDFPreview = true,
}: FileUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);

      const droppedFiles = Array.from(e.dataTransfer.files);
      const validFiles = droppedFiles.filter((file) => {
        const sizeMB = file.size / (1024 * 1024);
        return sizeMB <= maxSize;
      });

      const newFiles: UploadedFile[] = validFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined,
      }));

      if (multiple) {
        onFilesChange([...files, ...newFiles]);
      } else {
        onFilesChange(newFiles.slice(0, 1));
      }
    },
    [files, maxSize, multiple, onFilesChange]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []);
      const validFiles = selectedFiles.filter((file) => {
        const sizeMB = file.size / (1024 * 1024);
        return sizeMB <= maxSize;
      });

      const newFiles: UploadedFile[] = validFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined,
      }));

      if (multiple) {
        onFilesChange([...files, ...newFiles]);
      } else {
        onFilesChange(newFiles.slice(0, 1));
      }

      // Reset input
      e.target.value = "";
    },
    [files, maxSize, multiple, onFilesChange]
  );

  const removeFile = useCallback(
    (id: string) => {
      const fileToRemove = files.find((f) => f.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      onFilesChange(files.filter((f) => f.id !== id));
    },
    [files, onFilesChange]
  );

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return ImageIcon;
    if (file.type === "application/pdf") return FileText;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all duration-300",
          isDragOver
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-border hover:border-primary/50 bg-card"
        )}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
            <Upload className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-1">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Max file size: {maxSize} MB
            </p>
          </div>
          <Button variant="outline" className="mt-2">
            Select Files
          </Button>
        </div>
      </div>

      {files.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {files.map((uploadedFile) => {
              const Icon = getFileIcon(uploadedFile.file);
              return (
                <div
                  key={uploadedFile.id}
                  className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border group"
                >
                  {uploadedFile.preview ? (
                    <img
                      src={uploadedFile.preview}
                      alt=""
                      className="w-12 h-12 rounded object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate text-foreground">
                      {uploadedFile.file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(uploadedFile.file.size)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFile(uploadedFile.id)}
                    className="p-1.5 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* PDF Page Previews */}
          {showPDFPreview &&
            files.map((uploadedFile) => {
              if (uploadedFile.file.type === "application/pdf") {
                return (
                  <div
                    key={`preview-${uploadedFile.id}`}
                    className="bg-card rounded-xl p-4 border border-border"
                  >
                    <p className="text-sm font-medium text-foreground mb-3">
                      {uploadedFile.file.name}
                    </p>
                    <PDFPagePreview file={uploadedFile.file} />
                  </div>
                );
              }
              return null;
            })}
        </>
      )}
    </div>
  );
}
