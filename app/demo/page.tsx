"use client"

import React from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, CheckCircle2, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function DemoPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-20">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h1 className="text-4xl font-bold mb-4">Platform Walkthrough</h1>
                    <p className="text-xl text-muted-foreground italic">
                        "Experience how CodeAssess revolutionizes technical hiring with AI-driven insights."
                    </p>
                </div>

                <div className="grid gap-12 lg:grid-cols-2 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold">See CodeAssess in Action</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Our interactive demo showcases the complete end-to-end recruitment lifecycle.
                            From generating AI-tailored questions to analyzing candidate performance with
                            deep-learning metrics.
                        </p>

                        <ul className="space-y-4">
                            {[
                                "AI-Powered Question Generation",
                                "Advanced Code Execution Environment",
                                "Real-time Proctoring & Plagiarism Detection",
                                "Automated Grading & Performance Analytics"
                            ].map((item) => (
                                <li key={item} className="flex items-center gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="pt-4 flex gap-4">
                            <Button size="lg" asChild>
                                <Link href="/register">Get Started Free</Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild>
                                <Link href="/student/dashboard">Try as Student</Link>
                            </Button>
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <Card className="relative border-none shadow-2xl">
                            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                                    <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 scale-100 group-hover:scale-110 transition-transform cursor-pointer">
                                        <Play className="h-8 w-8 text-white fill-white ml-1" />
                                    </div>
                                </div>
                                <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop" alt="Dashboard Preview" className="w-full h-full object-cover" />
                            </div>
                            <CardHeader>
                                <CardTitle>Recruiter Dashboard Preview</CardTitle>
                                <CardDescription>Watch how easy it is to manage 100+ candidates at once.</CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
