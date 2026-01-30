import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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

// Floating particle for gravity effect
interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

const pathToTool = (path: string): ToolType => {
  if (path.includes('split-pdf')) return 'split';
  if (path.includes('compress-pdf')) return 'compress';
  if (path.includes('pdf-to-image')) return 'pdf-to-image';
  if (path.includes('image-to-pdf')) return 'image-to-pdf';
  if (path.includes('doc-to-pdf')) return 'doc-to-pdf';
  if (path.includes('pdf-to-doc')) return 'pdf-to-doc';
  if (path.includes('edit-pdf')) return 'edit';
  return 'merge';
};

const toolToPath = (tool: ToolType): string => {
  switch (tool) {
    case 'split': return '/split-pdf';
    case 'compress': return '/compress-pdf';
    case 'pdf-to-image': return '/pdf-to-image';
    case 'image-to-pdf': return '/image-to-pdf';
    case 'doc-to-pdf': return '/doc-to-pdf';
    case 'pdf-to-doc': return '/pdf-to-doc';
    case 'edit': return '/edit-pdf';
    case 'merge':
    default: return '/merge-pdf';
  }
};

export default function Index() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTool, setActiveTool] = useState<ToolType>(pathToTool(location.pathname));
  const [particles, setParticles] = useState<Particle[]>([]);
  const [gravityEnabled, setGravityEnabled] = useState(false);
  const animationRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);

  const ActiveToolComponent = toolComponents[activeTool];

  // Initialize floating particles
  useEffect(() => {
    const colors = [
      'hsl(var(--primary) / 0.3)',
      'hsl(var(--secondary) / 0.3)',
      'hsl(var(--accent) / 0.3)',
    ];

    const initialParticles: Particle[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
      y: Math.random() * 400,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 60 + 20,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    setParticles(initialParticles);
  }, []);

  // Update active tool when path changes
  useEffect(() => {
    setActiveTool(pathToTool(location.pathname));
  }, [location.pathname]);

  const handleToolChange = (tool: ToolType) => {
    navigate(toolToPath(tool));
  };

  // Animate particles
  useEffect(() => {
    const animate = () => {
      setParticles(prev => prev.map(p => {
        let { x, y, vx, vy } = p;
        const gravity = gravityEnabled ? 0.3 : 0;
        const friction = 0.99;
        const bounce = 0.7;

        vy += gravity;
        vx *= friction;
        vy *= friction;

        x += vx;
        y += vy;

        // Bounce off walls
        const maxX = typeof window !== 'undefined' ? window.innerWidth - p.size : 1000;
        const maxY = gravityEnabled ? 400 - p.size : 400;

        if (x < 0) { x = 0; vx = -vx * bounce; }
        if (x > maxX) { x = maxX; vx = -vx * bounce; }
        if (y < 0) { y = 0; vy = -vy * bounce; }
        if (y > maxY) { y = maxY; vy = -vy * bounce; }

        // Add slight random movement when not in gravity mode
        if (!gravityEnabled) {
          vx += (Math.random() - 0.5) * 0.1;
          vy += (Math.random() - 0.5) * 0.1;
        }

        return { ...p, x, y, vx, vy };
      }));

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [gravityEnabled]);

  // Toggle gravity on header click
  const handleHeaderClick = () => {
    setGravityEnabled(prev => !prev);
    // Give particles a push when enabling gravity
    if (!gravityEnabled) {
      setParticles(prev => prev.map(p => ({
        ...p,
        vy: Math.random() * -10 - 5,
        vx: (Math.random() - 0.5) * 10,
      })));
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <header
        ref={containerRef}
        className="gradient-hero text-primary-foreground py-12 md:py-20 relative overflow-hidden cursor-pointer select-none"
        onClick={handleHeaderClick}
      >
        {/* Floating particles */}
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}

        <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10">
          <ThemeToggle />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4 animate-fade-in">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary-foreground/20 flex items-center justify-center hover-scale">
              <FileText className="w-7 h-7 md:w-8 md:h-8" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold hover-scale">
              DocFusion
            </h1>
          </div>
          <p className="text-base md:text-xl opacity-90 max-w-2xl mx-auto animate-fade-in px-2">
            Your all-in-one PDF toolkit. Merge, split, compress, convert, and edit PDFs - all in one place.
          </p>
          <p className="text-xs md:text-sm opacity-60 mt-4 animate-fade-in">
            {gravityEnabled ? "🎉 Gravity mode! Click again to float" : "✨ Click here for a surprise!"}
          </p>
        </div>
      </header>

      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container mx-auto overflow-x-auto">
          <PDFToolbar activeTool={activeTool} onToolChange={handleToolChange} />
        </div>
      </div>

      <main className="container mx-auto px-4 py-6 md:py-12">
        <div className="max-w-3xl mx-auto animate-fade-in">
          <ActiveToolComponent />
        </div>
      </main>

      <section className="py-6 md:py-8 border-t border-border bg-muted/30">
        <div className="container mx-auto px-4">
          <FeatureBadges />
        </div>
      </section>

      <HowItWorks />

      <SEOContent />

      <FAQ />

      <footer className="py-6 md:py-8 text-center text-muted-foreground border-t border-border bg-muted/20">
        <div className="container mx-auto px-4">
          <p className="text-sm mb-2">
            © 2024 DocFusion. All rights reserved. All processing happens securely in your browser.
          </p>
          <p className="text-xs px-2">
            Free online PDF tools: Merge PDF | Split PDF | Compress PDF | PDF to Image | Image to PDF
          </p>
          <div className="mt-4 flex justify-center gap-4 text-xs">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
