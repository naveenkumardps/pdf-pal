
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Privacy() {
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
                    <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Privacy Policy</h1>
                    <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold tracking-tight">1. Introduction</h2>
                        <p className="leading-7">
                            Welcome to DocFusion. We respect your privacy and represent that your files are processed securely.
                            This Privacy Policy explains how we handle your data when you use our PDF tools.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold tracking-tight">2. Local Processing</h2>
                        <p className="leading-7">
                            DocFusion is designed with privacy as a priority. <strong>All file processing happens entirely within your web browser.</strong>
                            Your files are <strong>never</strong> uploaded to our servers. We do not store, view, or share your documents.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold tracking-tight">3. Data Collection</h2>
                        <p className="leading-7">
                            Since we do not host a backend server for file processing, we do not collect any personal data related to the files you process.
                            However, we may use basic analytics tools to understand how our website is used (e.g., page views, popular tools) to improve the user experience.
                            These analytics are anonymized and do not contain personal information.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold tracking-tight">4. Cookies</h2>
                        <p className="leading-7">
                            We may use local storage or cookies solely to store your preferences, such as your chosen theme (dark/light mode).
                            These are stored locally on your device and are not used for tracking purposes across other sites.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold tracking-tight">5. Third-Party Services</h2>
                        <p className="leading-7">
                            Our website may contain links to external sites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site.
                            We strongly advise you to review the Privacy Policy and Terms and Conditions of every site you visit.
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
