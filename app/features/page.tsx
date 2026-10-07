"use client"

import React from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CheckCircle2 } from "lucide-react"

export default function FeaturesPage() {
    const features = [
        { title: "AI Question Generation", description: "Generate custom tailored coding problems using advanced LLMs." },
        { title: "Real-time Proctoring", description: "Monitor candidate behavior with webcam and tab-switch detection." },
        { title: "Automated Grading", description: "Get instant results with our efficient code execution engine." },
        { title: "Advanced Analytics", description: "Visualize team performance and hiring trends at a glance." },
        { title: "Custom Branding", description: "Make the assessment experience feel like your own brand." },
        { title: "Plagiarism Detection", description: "Ensure integrity with built-in code similarity checks." }
    ]

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-20">
                <h1 className="text-4xl font-bold text-center mb-12">Platform Features</h1>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((f) => (
                        <div key={f.title} className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors">
                            <CheckCircle2 className="h-8 w-8 text-primary mb-4" />
                            <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                            <p className="text-muted-foreground">{f.description}</p>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    )
}
