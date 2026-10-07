import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Brain, 
  Shield, 
  BarChart3, 
  Code, 
  Clock, 
  Users,
  Zap,
  Lock,
} from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Evaluation",
    description: "Intelligent code analysis that evaluates syntax, logic, efficiency, and best practices automatically.",
  },
  {
    icon: Shield,
    title: "Advanced Proctoring",
    description: "Webcam monitoring, tab switching detection, and copy-paste tracking ensure assessment integrity.",
  },
  {
    icon: BarChart3,
    title: "Comprehensive Analytics",
    description: "Detailed performance metrics, skill gap analysis, and comparative insights for better hiring decisions.",
  },
  {
    icon: Code,
    title: "Multi-Language Support",
    description: "Support for 40+ programming languages including Python, JavaScript, Java, C++, and more.",
  },
  {
    icon: Clock,
    title: "Real-Time Monitoring",
    description: "Live progress tracking and instant notifications keep you informed throughout the assessment.",
  },
  {
    icon: Users,
    title: "Collaborative Tools",
    description: "Team-based assessment management with role-based access control and shared candidate pools.",
  },
  {
    icon: Zap,
    title: "Quick Setup",
    description: "Create and deploy assessments in minutes with our intuitive question builder and templates.",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description: "SOC 2 compliant with end-to-end encryption, GDPR support, and secure data handling.",
  },
]

export function FeaturesSection() {
  return (
    <section className="border-t border-border bg-muted/30 py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Everything You Need for Technical Hiring
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features designed to help you identify top engineering talent efficiently and fairly.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="border-border bg-card transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
