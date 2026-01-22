import { useState } from "react";
import { FileUploadZone } from "@/components/FileUploadZone";
import { Button } from "@/components/ui/button";
import { FileOutput, Loader2, Info } from "lucide-react";
import { toast } from "sonner";

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
}

export function PdfToDocTool() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing] = useState(false);

  const handleConvert = async () => {
    if (files.length === 0) {
      toast.error("Please upload a PDF file");
      return;
    }

    // This feature requires complex OCR/conversion libraries
    toast.info("PDF to DOC conversion is coming soon! Requires advanced PDF parsing and OCR.");
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">PDF to DOC</h2>
        <p className="text-muted-foreground">
          Convert PDF documents to editable Word format
        </p>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mb-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-foreground">
            <p className="font-semibold mb-1">Coming Soon</p>
            <p className="text-muted-foreground">
              PDF to DOC conversion requires advanced OCR and document parsing libraries. 
              This feature will be available in a future update. For now, you can use:
            </p>
            <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
              <li>Adobe Acrobat's "Export PDF" feature</li>
              <li>Microsoft Word's "Open PDF" feature</li>
              <li>Online converters like Smallpdf or Adobe online tools</li>
            </ul>
          </div>
        </div>
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

      <div className="flex justify-center">
        <Button
          onClick={handleConvert}
          disabled={files.length === 0 || isProcessing}
          size="lg"
          className="gradient-primary text-primary-foreground px-8"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Converting...
            </>
          ) : (
            <>
              <FileOutput className="w-5 h-5 mr-2" />
              Convert to DOC (Coming Soon)
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
