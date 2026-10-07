import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "VP of Engineering",
    company: "TechCorp",
    content: "CodeAssess has transformed our hiring process. We've reduced time-to-hire by 60% while improving the quality of our engineering hires.",
    rating: 5,
  },
  {
    name: "Michael Rodriguez",
    role: "HR Director",
    company: "StartupXYZ",
    content: "The AI-powered evaluation gives us insights we never had before. It's like having a senior engineer review every submission.",
    rating: 5,
  },
  {
    name: "Emily Johnson",
    role: "Technical Recruiter",
    company: "Enterprise Inc",
    content: "The proctoring features give us confidence in our remote assessments. It's professional and candidates appreciate the streamlined experience.",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Trusted by Leading Companies
          </h2>
          <p className="text-lg text-muted-foreground">
            See what hiring managers and recruiters say about CodeAssess.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="border-border bg-card">
              <CardContent className="pt-6">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-warning text-warning" />
                  ))}
                </div>
                <p className="mb-6 text-muted-foreground">
                  {`"${testimonial.content}"`}
                </p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {testimonial.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
