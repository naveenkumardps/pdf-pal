import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
  const faqs = [
    {
      question: "Is DocFusion really free to use?",
      answer: "Yes! DocFusion is completely free to use with no hidden costs, subscriptions, or premium features. All tools are available to everyone at no charge.",
    },
    {
      question: "Do I need to create an account?",
      answer: "No account is required. You can start using all our PDF tools immediately without any registration or sign-up process.",
    },
    {
      question: "Are my files safe and secure?",
      answer: "Absolutely. All PDF processing happens directly in your browser using client-side technology. Your files never leave your device and are not uploaded to any server. Once you close your browser, all temporary files are automatically deleted.",
    },
    {
      question: "What file size limits do you have?",
      answer: "Most tools support files up to 50MB. For larger files, we recommend splitting them first or using our compression tool to reduce the size.",
    },
    {
      question: "Can I use DocFusion on my phone or tablet?",
      answer: "Yes! DocFusion works on all devices including smartphones, tablets, and desktop computers. The interface is fully responsive and optimized for mobile use.",
    },
    {
      question: "How do I merge multiple PDF files?",
      answer: "Simply select the Merge tool, upload your PDF files (you can drag and drop), arrange them in the desired order, and click 'Merge PDFs'. Your combined PDF will download automatically.",
    },
    {
      question: "Can I split a PDF into individual pages?",
      answer: "Yes! Use the Split tool and leave the page range empty to split every page into a separate PDF file. You'll receive a ZIP file containing all the individual pages.",
    },
    {
      question: "Will compressing a PDF reduce its quality?",
      answer: "Our compression tool offers three quality levels. 'High' compression reduces file size significantly with some quality loss, while 'Low' compression maintains better quality with less size reduction. You can choose based on your needs.",
    },
    {
      question: "What image formats can I convert to PDF?",
      answer: "We support all common image formats including JPG, JPEG, PNG, GIF, and WebP. You can upload multiple images and combine them into a single PDF document.",
    },
    {
      question: "Do you support batch processing?",
      answer: "Yes! Most tools support processing multiple files at once. You can merge multiple PDFs, convert multiple images to PDF, or process several files simultaneously.",
    },
    {
      question: "Is there a limit on how many files I can process?",
      answer: "There's no daily limit on the number of files you can process. Use our tools as much as you need, completely free.",
    },
    {
      question: "Can I use DocFusion for commercial purposes?",
      answer: "Yes, you can use DocFusion for both personal and commercial purposes at no cost.",
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-4 text-foreground">
          Frequently Asked Questions
        </h2>
        <p className="text-center text-muted-foreground mb-8 md:mb-12 text-sm md:text-base">
          Find answers to common questions about DocFusion
        </p>

        <Accordion type="single" collapsible className="w-full space-y-3 md:space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card border border-border rounded-lg px-4 md:px-6"
            >
              <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline text-sm md:text-base py-3 md:py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed text-sm md:text-base pb-3 md:pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
