"use client"

import React from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function AboutPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-20 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8">About CodeAssess</h1>
                <div className="prose prose-lg dark:prose-invert">
                    <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                        We are on a mission to make technical hiring more objective, efficient, and fair.
                    </p>
                    <p className="mb-4">
                        Founded in 2024, CodeAssess was built by developers for developers. We recognized that the
                        traditional interview process was broken—often relying on outdated riddles or high-pressure
                        environments that didn't reflect real-world work.
                    </p>
                    <p className="mb-4">
                        Our platform leverages cutting-edge AI to help recruiters design assessments that truly
                        test relevant skills, while providing candidates with a modern, high-performance coding
                        environment where they can shine.
                    </p>
                    <h2 className="text-2xl font-bold mt-12 mb-4">Our Core Values</h2>
                    <ul className="grid gap-6 sm:grid-cols-2 list-none p-0">
                        <li className="p-6 bg-muted rounded-xl">
                            <span className="block font-bold text-lg mb-2">Integrity</span>
                            <span className="text-sm text-muted-foreground">Advanced proctoring that respects candidate privacy.</span>
                        </li>
                        <li className="p-6 bg-muted rounded-xl">
                            <span className="block font-bold text-lg mb-2">Innovation</span>
                            <span className="text-sm text-muted-foreground">AI-driven insights that evolve with your hiring needs.</span>
                        </li>
                    </ul>
                </div>
            </main>
            <Footer />
        </div>
    )
}
