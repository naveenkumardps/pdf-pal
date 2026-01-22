import { Upload, Settings, Download } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: Upload,
      title: "1. Upload Your PDF",
      description: "Drag and drop your PDF files or click to select them from your device. Supports multiple files for batch processing.",
    },
    {
      icon: Settings,
      title: "2. Choose Your Tool",
      description: "Select from merge, split, compress, or convert tools. Customize settings like quality, page ranges, and output format.",
    },
    {
      icon: Download,
      title: "3. Download Result",
      description: "Get your processed PDF instantly. All processing happens securely in your browser - no uploads to servers.",
    },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
          How to Use PDF Pal
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Process your PDF files in three simple steps. Fast, secure, and completely free.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mb-4 mx-auto">
                  <Icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-3 text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-center">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

