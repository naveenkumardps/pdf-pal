import { cn } from "@/lib/utils";
import { 
  Combine, 
  Split, 
  Minimize2, 
  Image, 
  FileImage, 
  FileText, 
  FileOutput,
  Edit3 
} from "lucide-react";

export type ToolType = 
  | "merge" 
  | "split" 
  | "compress" 
  | "pdf-to-image" 
  | "image-to-pdf" 
  | "doc-to-pdf" 
  | "pdf-to-doc" 
  | "edit";

interface ToolItem {
  id: ToolType;
  name: string;
  icon: React.ElementType;
  color: string;
}

const tools: ToolItem[] = [
  { id: "merge", name: "Merge", icon: Combine, color: "bg-primary" },
  { id: "split", name: "Split", icon: Split, color: "bg-secondary" },
  { id: "compress", name: "Compress", icon: Minimize2, color: "bg-accent" },
  { id: "pdf-to-image", name: "PDF to Image", icon: Image, color: "bg-primary" },
  { id: "image-to-pdf", name: "Image to PDF", icon: FileImage, color: "bg-secondary" },
  { id: "doc-to-pdf", name: "DOC to PDF", icon: FileText, color: "bg-accent" },
  { id: "pdf-to-doc", name: "PDF to DOC", icon: FileOutput, color: "bg-primary" },
  { id: "edit", name: "Edit PDF", icon: Edit3, color: "bg-secondary" },
];

interface PDFToolbarProps {
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
}

export function PDFToolbar({ activeTool, onToolChange }: PDFToolbarProps) {
  return (
    <div className="w-full overflow-x-auto py-4">
      <div className="flex gap-2 min-w-max px-4 md:justify-center">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          
          return (
            <button
              key={tool.id}
              onClick={() => onToolChange(tool.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 font-medium text-sm",
                isActive
                  ? "gradient-primary text-primary-foreground shadow-lg scale-105"
                  : "bg-card hover:bg-muted text-foreground border border-border hover:border-primary/30"
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="whitespace-nowrap">{tool.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
