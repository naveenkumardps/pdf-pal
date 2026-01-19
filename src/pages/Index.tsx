import { useState } from "react";
import { PDFToolbar, ToolType } from "@/components/PDFToolbar";
import { FeatureBadges } from "@/components/FeatureBadges";
import { MergeTool } from "@/components/tools/MergeTool";
import { SplitTool } from "@/components/tools/SplitTool";
import { CompressTool } from "@/components/tools/CompressTool";
import { PdfToImageTool } from "@/components/tools/PdfToImageTool";
import { ImageToPdfTool } from "@/components/tools/ImageToPdfTool";
import { DocToPdfTool } from "@/components/tools/DocToPdfTool";
import { PdfToDocTool } from "@/components/tools/PdfToDocTool";
import { EditTool } from "@/components/tools/EditTool";
import { FileText } from "lucide-react";

const toolComponents: Record<ToolType, React.ComponentType> = {
  merge: MergeTool,
  split: SplitTool,
  compress: CompressTool,
  "pdf-to-image": PdfToImageTool,
  "image-to-pdf": ImageToPdfTool,
  "doc-to-pdf": DocToPdfTool,
  "pdf-to-doc": PdfToDocTool,
  edit: EditTool,
};

export default function Index() {
  const [activeTool, setActiveTool] = useState<ToolType>("merge");
  const ActiveToolComponent = toolComponents[activeTool];

  return (
    <div className="min-h-screen bg-background">
      <header className="gradient-hero text-primary-foreground py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <FileText className="w-7 h-7" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold">PDF Master</h1>
          </div>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Your all-in-one PDF toolkit. Merge, split, compress, convert, and edit PDFs - all in one place.
          </p>
        </div>
      </header>

      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container mx-auto">
          <PDFToolbar activeTool={activeTool} onToolChange={setActiveTool} />
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <ActiveToolComponent />
        </div>
      </main>

      <section className="py-8 border-t border-border bg-muted/30">
        <div className="container mx-auto px-4">
          <FeatureBadges />
        </div>
      </section>

      <footer className="py-6 text-center text-muted-foreground text-sm border-t border-border">
        <p>© 2024 PDF Master. All processing happens securely on our servers.</p>
      </footer>
    </div>
  );
}
