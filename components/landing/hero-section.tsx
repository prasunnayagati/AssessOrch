"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Play, Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="outline" className="mb-6 gap-1.5 px-4 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>AI-Powered Assessment Platform</span>
          </Badge>

          <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Hire the Best Developers with{" "}
            <span className="text-primary">AI-Powered</span> Coding Assessments
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            Streamline your technical hiring with intelligent code evaluation,
            real-time proctoring, and comprehensive analytics. Find top talent faster.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="gap-2">
              <Link href="/login">
                Login
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="gap-2 bg-transparent">
              <Link href="/demo">
                <Play className="h-4 w-4" />
                Watch Demo
              </Link>
            </Button>
          </div>


        </div>

        {/* Hero Image/Preview */}
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="relative rounded-xl border border-border bg-card p-2 shadow-2xl">
            <div className="overflow-hidden rounded-lg bg-muted">
              <div className="flex items-center gap-2 border-b border-border bg-card px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-destructive/60" />
                  <div className="h-3 w-3 rounded-full bg-warning/60" />
                  <div className="h-3 w-3 rounded-full bg-secondary/60" />
                </div>
                <div className="flex-1 text-center text-sm text-muted-foreground">
                  CodeAssess - Assessment Dashboard
                </div>
              </div>
              <div className="aspect-[16/9] bg-gradient-to-br from-muted via-muted to-muted/50 p-6">
                <div className="grid h-full gap-4 md:grid-cols-3">
                  {/* Sidebar Preview */}
                  <div className="hidden rounded-lg bg-card p-4 shadow-sm md:block">
                    <div className="mb-4 h-8 w-24 rounded bg-primary/10" />
                    <div className="space-y-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded bg-muted-foreground/20" />
                          <div className="h-3 flex-1 rounded bg-muted-foreground/20" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Main Content Preview */}
                  <div className="col-span-2 rounded-lg bg-card p-4 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="h-6 w-32 rounded bg-foreground/10" />
                      <div className="h-8 w-24 rounded bg-primary" />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {[
                        { label: "Active Assessments", value: "24" },
                        { label: "Candidates", value: "156" },
                        { label: "Avg. Score", value: "78%" },
                      ].map((stat) => (
                        <div key={stat.label} className="rounded-lg bg-muted p-3">
                          <div className="mb-1 text-xs text-muted-foreground">{stat.label}</div>
                          <div className="text-xl font-bold text-foreground">{stat.value}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3 rounded-lg bg-muted p-3">
                          <div className="h-8 w-8 rounded-full bg-primary/20" />
                          <div className="flex-1">
                            <div className="h-3 w-24 rounded bg-foreground/10" />
                            <div className="mt-1 h-2 w-16 rounded bg-muted-foreground/20" />
                          </div>
                          <div className="h-6 w-16 rounded bg-secondary/30" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
