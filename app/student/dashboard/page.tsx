"use client"

import React from "react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "@/lib/auth-context"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

import {
  FileText,
  Clock,
  CheckCircle,
  Trophy,
  ArrowRight,
  Calendar,
  TrendingUp,
} from "lucide-react"

// Data will be fetched from the API


const recentResults = [
  {
    id: "1",
    title: "Python Backend Assessment",
    company: "DataTech",
    score: 85,
    date: "Jan 20, 2026",
    status: "passed",
  },
  {
    id: "2",
    title: "React Developer Test",
    company: "WebStudio",
    score: 92,
    date: "Jan 15, 2026",
    status: "passed",
  },
  {
    id: "3",
    title: "System Design Challenge",
    company: "CloudBase",
    score: 68,
    date: "Jan 10, 2026",
    status: "needs-improvement",
  },
]

const skillProgress = [
  { skill: "JavaScript", progress: 85 },
  { skill: "Python", progress: 78 },
  { skill: "Data Structures", progress: 72 },
  { skill: "System Design", progress: 65 },
]

function StudentDashboardContent() {
  const { user } = useAuth()
  const [assessments, setAssessments] = useState<any[]>([])
  const [submissions, setSubmissions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [now, setNow] = useState<number>(0)

  useEffect(() => {
    setNow(Date.now())
    const fetchData = async () => {
      if (!user?.id) return

      try {
        const [assessmentsRes, submissionsRes] = await Promise.all([
          fetch("/api/assessments", { cache: 'no-store' }),
          fetch(`/api/submissions?studentId=${user.id}`, { cache: 'no-store' })
        ])

        const assessmentsData = await assessmentsRes.json()
        const submissionsData = await submissionsRes.json()

        if (assessmentsData.success) {
          setAssessments(assessmentsData.assessments || [])
        }
        if (submissionsData.success) {
          setSubmissions(submissionsData.submissions || [])
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user?.id])

  const averageScore = submissions.length > 0
    ? Math.round(submissions.reduce((acc, s) => acc + (s.score || 0), 0) / submissions.length)
    : 0

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            Welcome back, {user?.name?.split(" ")[0] || "Student"}!
          </h1>
          <p className="text-muted-foreground">
            {"Here's what's happening with your assessments"}
          </p>
        </div>
        <Button asChild>
          <Link href="/student/assessments">
            Browse Assessments
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{isLoading ? "..." : assessments.length}</p>
                <p className="text-sm text-muted-foreground">Pending Tests</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                <CheckCircle className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{isLoading ? "..." : submissions.length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <Trophy className="h-6 w-6 text-accent" />
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
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-5/10">
                <TrendingUp className="h-6 w-6 text-chart-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">+5%</p>
                <p className="text-sm text-muted-foreground">Improvement</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Assessments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Upcoming Assessments
            </CardTitle>
            <CardDescription>Tests awaiting your completion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                  <p className="text-muted-foreground">Loading assessments...</p>
                </div>
              ) : assessments.length > 0 ? (
                assessments.slice(0, 3).map((assessment) => (
                  <div
                    key={assessment.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:border-primary/50"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{assessment.title}</p>
                        {assessment.created && now > 0 && new Date(assessment.created).getTime() > now - 86400000 && (
                          <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] h-4 px-1">New</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{assessment.company || "Tech Recruitment"}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {assessment.duration} min
                        </span>
                        <span>{assessment.questions} questions</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant="outline" className="text-xs">
                        {assessment.deadline ? `Due ${assessment.deadline}` : "No deadline"}
                      </Badge>
                      <Button size="sm" asChild>
                        <Link href={`/student/assessment/${assessment.id}/start`}>
                          Start
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center border rounded-lg border-dashed">
                  <p className="text-muted-foreground">No pending assessments</p>
                </div>
              )}
            </div>
            <Button variant="ghost" className="mt-4 w-full" asChild>
              <Link href="/student/assessments">View All Assessments</Link>
            </Button>
          </CardContent>

        </Card>

        {/* Recent Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-accent" />
              Recent Results
            </CardTitle>
            <CardDescription>Your latest assessment scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-accent mb-2" />
                  <p className="text-muted-foreground">Loading results...</p>
                </div>
              ) : submissions.length > 0 ? (
                submissions.slice(0, 3).map((result) => (
                  <div
                    key={result.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{result.assessmentTitle || "Assessment"}</p>
                      <p className="text-sm text-muted-foreground">{result.company || "Recruiter"}</p>
                      <p className="text-xs text-muted-foreground">{result.date}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-2xl font-bold text-foreground">{result.score}%</div>
                      <Badge
                        variant={result.score >= 70 ? "default" : "secondary"}
                        className={
                          result.score >= 70
                            ? "bg-secondary text-secondary-foreground"
                            : "bg-accent text-accent-foreground"
                        }
                      >
                        {result.score >= 70 ? "Passed" : "Needs Work"}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center border rounded-lg border-dashed">
                  <p className="text-muted-foreground">No results yet</p>
                </div>
              )}
            </div>
            <Button variant="ghost" className="mt-4 w-full" asChild>
              <Link href="/student/results">View All Results</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Skill Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Skill Progress
          </CardTitle>
          <CardDescription>Track your improvement across different areas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {skillProgress.map((item) => (
              <div key={item.skill} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.skill}</span>
                  <span className="text-sm text-muted-foreground">{item.progress}%</span>
                </div>
                <Progress value={item.progress} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function StudentDashboardPage() {
  return (
    <DashboardLayout>
      <StudentDashboardContent />
    </DashboardLayout>
  )
}
