import { useEffect, useState, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Set worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PagePreview {
  pageNumber: number;
  imageUrl: string;
}

interface PDFPagePreviewProps {
  file: File;
  className?: string;
  maxPages?: number;
  onPageSelect?: (pageNumber: number) => void;
  selectedPages?: number[];
}

export function PDFPagePreview({
  file,
  className,
  maxPages = 50,
  onPageSelect,
  selectedPages = [],
}: PDFPagePreviewProps) {
  const [pages, setPages] = useState<PagePreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;

    const loadPDF = async () => {
      setLoading(true);
      setError(null);
      setPages([]);

      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        
        if (cancelled) return;
        
        setTotalPages(pdf.numPages);
        const pagesToRender = Math.min(pdf.numPages, maxPages);
        const newPages: PagePreview[] = [];

        for (let i = 1; i <= pagesToRender; i++) {
          if (cancelled) return;
          
          const page = await pdf.getPage(i);
          const scale = 0.5;
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d")!;
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({
            canvasContext: context,
            viewport: viewport,
          }).promise;

          newPages.push({
            pageNumber: i,
            imageUrl: canvas.toDataURL("image/jpeg", 0.8),
          });

          // Update incrementally for better UX
          if (!cancelled) {
            setPages([...newPages]);
          }
        }
      } catch (err) {
        console.error("Error loading PDF:", err);
        if (!cancelled) {
          setError("Failed to load PDF preview");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadPDF();

    return () => {
      cancelled = true;
    };
  }, [file, maxPages]);

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          Page Preview {totalPages > 0 && `(${pages.length}/${totalPages} pages)`}
        </h3>
        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading pages...
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {pages.map((page) => {
          const isSelected = selectedPages.includes(page.pageNumber);
          return (
            <button
              key={page.pageNumber}
              onClick={() => onPageSelect?.(page.pageNumber)}
              className={cn(
                "group relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all",
                onPageSelect ? "cursor-pointer hover:border-primary" : "cursor-default",
                isSelected
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-border"
              )}
            >
              <img
                src={page.imageUrl}
                alt={`Page ${page.pageNumber}`}
                className="w-full h-full object-cover"
              />
              <div
                className={cn(
                  "absolute bottom-0 left-0 right-0 py-1 text-xs font-medium text-center",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-background/80 text-foreground"
                )}
              >
                {page.pageNumber}
              </div>
              {isSelected && (
                <div className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-xs text-primary-foreground">✓</span>
                </div>
              )}
            </button>
          );
        })}

        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="aspect-[3/4] rounded-lg bg-muted animate-pulse"
            />
          ))}
      </div>

      {totalPages > maxPages && !loading && (
        <p className="text-sm text-muted-foreground text-center">
          Showing first {maxPages} of {totalPages} pages
        </p>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
