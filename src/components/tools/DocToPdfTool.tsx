import { useState } from "react";
import { FileUploadZone } from "@/components/FileUploadZone";
import { Button } from "@/components/ui/button";
import { FileText, Loader2, Info } from "lucide-react";
import { toast } from "sonner";

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
}

export function DocToPdfTool() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing] = useState(false);

  const handleConvert = async () => {
    if (files.length === 0) {
      toast.error("Please upload a DOC/DOCX file");
      return;
    }

    // This feature requires LibreOffice or similar on the backend
    toast.info("DOC to PDF conversion is coming soon! Requires LibreOffice backend integration.");
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">DOC to PDF</h2>
        <p className="text-muted-foreground">
          Convert Word documents to PDF format
        </p>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mb-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-foreground">
            <p className="font-semibold mb-1">Coming Soon</p>
            <p className="text-muted-foreground">
              DOC/DOCX to PDF conversion requires LibreOffice or similar tools on the backend. 
              This feature will be available in a future update. For now, you can use:
            </p>
            <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
              <li>Microsoft Word's built-in "Save as PDF" feature</li>
              <li>Google Docs "Download as PDF" option</li>
              <li>Online converters like CloudConvert</li>
            </ul>
          </div>
        </div>
      </div>

      <FileUploadZone
        accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        multiple={false}
        maxSize={50}
        files={files}
        onFilesChange={setFiles}
        title="Drop DOC/DOCX file here"
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
              <FileText className="w-5 h-5 mr-2" />
              Convert to PDF (Coming Soon)
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
