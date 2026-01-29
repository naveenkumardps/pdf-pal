import { useState } from "react";
import { PDFToolbar, ToolType } from "@/components/PDFToolbar";
import { FeatureBadges } from "@/components/FeatureBadges";
import { HowItWorks } from "@/components/HowItWorks";
import { SEOContent } from "@/components/SEOContent";
import { FAQ } from "@/components/FAQ";
import { MergeTool } from "@/components/tools/MergeTool";
import { SplitTool } from "@/components/tools/SplitTool";
import { CompressTool } from "@/components/tools/CompressTool";
import { PdfToImageTool } from "@/components/tools/PdfToImageTool";
import { ImageToPdfTool } from "@/components/tools/ImageToPdfTool";
import { DocToPdfTool } from "@/components/tools/DocToPdfTool";
import { PdfToDocTool } from "@/components/tools/PdfToDocTool";
import { EditTool } from "@/components/tools/EditTool";
import { ThemeToggle } from "@/components/ThemeToggle";
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
      <header className="gradient-hero text-primary-foreground py-12 md:py-20 relative">
        <div className="absolute top-4 right-4 md:top-6 md:right-6">
          <ThemeToggle />
        </div>
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <FileText className="w-7 h-7" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold">DocFusion</h1>
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

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex gap-6">
          {/* Main Content */}
          <main className="flex-1 max-w-3xl mx-auto lg:mx-0">
            <ActiveToolComponent />
          </main>

          {/* Ad Side Panel - Hidden until ads are configured */}
          {/* <aside className="hidden lg:block w-[300px] shrink-0">
            <div className="sticky top-20 space-y-4">
              <div className="bg-muted/50 border border-border rounded-lg p-4 min-h-[250px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <p className="text-sm font-medium">Advertisement</p>
                  <p className="text-xs mt-1">300 x 250</p>
                  <div id="ad-slot-1" className="mt-2"></div>
                </div>
              </div>
              <div className="bg-muted/50 border border-border rounded-lg p-4 min-h-[600px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <p className="text-sm font-medium">Advertisement</p>
                  <p className="text-xs mt-1">300 x 600</p>
                  <div id="ad-slot-2" className="mt-2"></div>
                </div>
              </div>
            </div>
          </aside> */}
        </div>
      </div>

      <section className="py-8 border-t border-border bg-muted/30">
        <div className="container mx-auto px-4">
          <FeatureBadges />
        </div>
      </section>

      <HowItWorks />
      
      <SEOContent />
      
      <FAQ />

      <footer className="py-8 text-center text-muted-foreground border-t border-border bg-muted/20">
        <div className="container mx-auto px-4">
          <p className="text-sm mb-2">
            © 2024 DocFusion. All rights reserved. All processing happens securely in your browser.
          </p>
          <p className="text-xs">
            Free online PDF tools: Merge PDF | Split PDF | Compress PDF | PDF to Image | Image to PDF
          </p>
        </div>
      </footer>
    </div>
  );
}
