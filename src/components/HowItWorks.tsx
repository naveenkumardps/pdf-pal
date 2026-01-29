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
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-4 text-foreground">
          How to Use DocFusion
        </h2>
        <p className="text-center text-muted-foreground mb-8 md:mb-12 max-w-2xl mx-auto text-sm md:text-base">
          Process your PDF files in three simple steps. Fast, secure, and completely free.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="bg-card rounded-xl p-5 md:p-6 border border-border shadow-sm hover:shadow-md transition-all duration-300 hover-scale"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full gradient-primary flex items-center justify-center mb-4 mx-auto">
                  <Icon className="w-7 h-7 md:w-8 md:h-8 text-primary-foreground" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-center mb-3 text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-center text-sm md:text-base">
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
