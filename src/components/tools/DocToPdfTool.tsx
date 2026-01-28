import { AlertCircle } from "lucide-react";

export function DocToPdfTool() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">DOC to PDF</h2>
        <p className="text-muted-foreground">
          Convert Word documents to PDF format
        </p>
      </div>

      <div className="bg-muted/50 rounded-xl p-8 border border-border text-center">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Feature Not Available
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          DOC to PDF conversion requires server-side processing and is not available in the browser-only version. 
          Please use Microsoft Word, Google Docs, or LibreOffice to convert your documents to PDF.
        </p>
      </div>
    </div>
  );
}
