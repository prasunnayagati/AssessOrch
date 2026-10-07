"use client"

import React from "react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Trophy,
  TrendingUp,
  Target,
  Calendar,
  Clock,
  Eye,
  Download,
} from "lucide-react"

import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

function ResultsContent() {
  const { user } = useAuth()
  const [submissions, setSubmissions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!user?.id) return
      try {
        const response = await fetch(`/api/submissions?studentId=${user.id}`, { cache: 'no-store' })
        const data = await response.json()
        if (data.success) {
          setSubmissions(data.submissions || [])
        }
      } catch (error) {
        console.error("Error fetching results:", error)
        toast({
          title: "Error",
          description: "Failed to load results",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchSubmissions()
  }, [user?.id])

  const averageScore = submissions.length > 0
    ? Math.round(submissions.reduce((acc, r) => acc + (r.score || 0), 0) / submissions.length)
    : 0
  const passedCount = submissions.filter((r) => (r.score || 0) >= 70).length

  const skillBreakdown = [
    { skill: "JavaScript", score: 85 },
    { skill: "React", score: 78 },
    { skill: "Problem Solving", score: 82 },
    { skill: "Algorithms", score: 75 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">My Results</h1>
        <p className="text-muted-foreground">View your assessment scores and performance analytics</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{isLoading ? "..." : `${averageScore}%`}</p>
                <p className="text-sm text-muted-foreground">Avg. Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                <Target className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{isLoading ? "..." : `${passedCount}/${submissions.length}`}</p>
                <p className="text-sm text-muted-foreground">Tests Passed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">Top 25%</p>
                <p className="text-sm text-muted-foreground">Percentile</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-5/10">
                <Calendar className="h-6 w-6 text-chart-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{isLoading ? "..." : submissions.length}</p>
                <p className="text-sm text-muted-foreground">Total Tests</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Results Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Assessment History</CardTitle>
            <CardDescription>All your completed assessments and scores</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading results...</p>
              </div>
            ) : submissions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Assessment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{submission.assessmentTitle || "Assessment"}</p>
                          <p className="text-sm text-muted-foreground">{submission.company || "Recruiter"}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{submission.date}</TableCell>
                      <TableCell>
                        <span className="font-medium">{submission.score}%</span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            submission.score >= 70
                              ? "bg-secondary/10 text-secondary"
                              : "bg-accent/10 text-accent"
                          }
                        >
                          {submission.score >= 70 ? "Passed" : "Needs Work"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/student/results/${submission.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-12 text-center border rounded-lg border-dashed">
                <p className="text-muted-foreground">No assessment results found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Skill Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Skill Breakdown</CardTitle>
            <CardDescription>Your performance across different areas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {skillBreakdown.map((item) => (
                <div key={item.skill} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.skill}</span>
                    <span className="text-sm text-muted-foreground">{item.score}%</span>
                  </div>
                  <Progress value={item.score} className="h-2" />
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-lg bg-muted p-4">
              <h4 className="mb-2 font-medium">Recommendations</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>Focus on System Design concepts</li>
                <li>Practice time management</li>
                <li>Review algorithm patterns</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function StudentResultsPage() {
  return (
    <DashboardLayout>
      <ResultsContent />
    </DashboardLayout>
  )
}
