
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Terms() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex h-14 items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <Link to="/" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Link>
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            <main className="container mx-auto max-w-3xl px-4 py-8 md:py-12">
                <div className="space-y-6">
                    <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Terms of Service</h1>
                    <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold tracking-tight">1. Acceptance of Terms</h2>
                        <p className="leading-7">
                            By accessing and using DocFusion, you accept and agree to be bound by the terms and provision of this agreement.
                            If you do not agree to abide by these terms, please do not use this service.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold tracking-tight">2. Use of Service</h2>
                        <p className="leading-7">
                            DocFusion provides free online PDF tools. You agree to use these tools only for lawful purposes.
                            You are responsible for the content of the files you process using our service.
                            Do not use this service to process illegal, harmful, or malicious content.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold tracking-tight">3. Disclaimer</h2>
                        <p className="leading-7">
                            The tools and services are provided "as is" without any warranties, expressed or implied.
                            While we strive to provide reliable and accurate PDF processing tools, we do not guarantee that the service will be error-free or uninterrupted.
                            DocFusion is not liable for any data loss or corruption that may occur during the processing of your files.
                            Please always keep a backup of your original documents.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold tracking-tight">4. Intellectual Property</h2>
                        <p className="leading-7">
                            You retain all rights and ownership of your files. We do not claim any ownership over the documents you process.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold tracking-tight">5. Changes to Terms</h2>
                        <p className="leading-7">
                            We reserve the right to modify these terms solely at our discretion. Your continued use of the site after any such changes constitutes your acceptance of the new Terms of Service.
                        </p>
                    </section>
                </div>
            </main>

            <footer className="border-t py-6 md:py-8">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} DocFusion. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
