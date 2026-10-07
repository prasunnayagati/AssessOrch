"use client"

import React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { AuthProvider } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle,
  Trophy,
  Clock,
  Target,
  ArrowRight,
  Download,
  Share2,
  Home,
  BarChart3,
} from "lucide-react"

function AssessmentCompleteContent() {
  const params = useParams()
  const [assessment, setAssessment] = React.useState<any>(null)

  React.useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const response = await fetch(`/api/assessments/${params.id}`)
        const data = await response.json()
        if (data.success) {
          setAssessment(data.assessment)
        }
      } catch (error) {
        console.error("Error fetching assessment:", error)
      }
    }
    fetchAssessment()
  }, [params.id])

  // Result data (Calculated for demo based on completion)
  const result = {
    score: 80,
    totalPoints: assessment?.fullQuestions?.reduce((acc: number, q: any) => acc + (q.points || 0), 0) || 100,
    questionsAnswered: assessment?.fullQuestions?.length || 0,
    totalQuestions: assessment?.fullQuestions?.length || 0,
    timeTaken: "45 minutes",
    timeAllowed: `${assessment?.duration || 90} minutes`,
    status: "passed",
    percentile: 88,
    breakdown: [
      { category: "Problem Solving", score: 85, maxScore: 100 },
      { category: "Code Quality", score: 80, maxScore: 100 },
      { category: "Efficiency", score: 75, maxScore: 100 },
      { category: "Edge Cases", score: 70, maxScore: 100 },
    ],
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto max-w-3xl px-4 py-12">
        {/* Success Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-secondary/10">
            <CheckCircle className="h-10 w-10 text-secondary" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-foreground">Assessment Complete!</h1>
          <p className="text-muted-foreground">
            Great job! Your submission has been recorded and evaluated.
          </p>
        </div>

        {/* Score Card */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center gap-6 md:flex-row md:justify-between">
              <div className="text-center md:text-left">
                <p className="text-sm text-muted-foreground">Your Score</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-primary">{result.score}</span>
                  <span className="text-2xl text-muted-foreground">/ {result.totalPoints}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <Badge
                  className={
                    result.status === "passed"
                      ? "bg-secondary text-secondary-foreground px-4 py-2 text-lg"
                      : "bg-destructive text-destructive-foreground px-4 py-2 text-lg"
                  }
                >
                  <Trophy className="mr-2 h-5 w-5" />
                  {result.status === "passed" ? "Passed" : "Not Passed"}
                </Badge>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Questions</p>
                  <p className="font-medium">
                    {result.questionsAnswered}/{result.totalQuestions} answered
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time Taken</p>
                  <p className="font-medium">
                    {result.timeTaken} of {result.timeAllowed}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Percentile</p>
                  <p className="font-medium">Top {100 - result.percentile}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score Breakdown */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Score Breakdown</CardTitle>
            <CardDescription>
              Detailed analysis of your performance across different areas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {result.breakdown.map((item) => (
                <div key={item.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.category}</span>
                    <span className="text-sm text-muted-foreground">
                      {item.score}/{item.maxScore}
                    </span>
                  </div>
                  <Progress value={(item.score / item.maxScore) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Feedback */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>AI Feedback</CardTitle>
            <CardDescription>
              Personalized insights based on your performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border border-secondary/20 bg-secondary/5 p-4">
                <h4 className="mb-2 font-medium text-secondary">Strengths</h4>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  <li>Excellent problem-solving approach with clear logical thinking</li>
                  <li>Clean and readable code with good variable naming</li>
                  <li>Efficient use of data structures</li>
                </ul>
              </div>
              <div className="rounded-lg border border-accent/20 bg-accent/5 p-4">
                <h4 className="mb-2 font-medium text-accent">Areas for Improvement</h4>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  <li>Consider edge cases more thoroughly before implementing</li>
                  <li>Add more comments to explain complex logic</li>
                  <li>Practice time complexity optimization</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button variant="outline" asChild>
            <Link href={`/student/results/${params.id}`}>
              <BarChart3 className="mr-2 h-4 w-4" />
              Detailed Results
            </Link>
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share Results
          </Button>
          <Button asChild>
            <Link href="/student/dashboard">
              <Home className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function AssessmentCompletePage() {
  return (
    <AuthProvider>
      <AssessmentCompleteContent />
    </AuthProvider>
  )
}
