
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function About() {
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
                    <h1 className="text-3xl font-bold tracking-tight md:text-4xl">About DocFusion</h1>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold tracking-tight">Our Mission</h2>
                        <p className="leading-7">
                            DocFusion was built with a simple mission: to provide powerful, accessible, and secure PDF tools for everyone.
                            We believe that managing documents shouldn't require expensive software or compromising your privacy.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold tracking-tight">Privacy First</h2>
                        <p className="leading-7">
                            What sets DocFusion apart is our commitment to privacy. Unlike other online tools that upload your documents to a remote server,
                            <strong>DocFusion processes all your files directly in your browser</strong>. This means your sensitive documents never leave your device.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold tracking-tight">Open Source</h2>
                        <p className="leading-7">
                            We leverage modern web technologies to bring desktop-class performance to the web.
                            Our tools are built on top of robust libraries and are constantly updated to support new features and improvements.
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
