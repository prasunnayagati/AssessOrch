"use client"

import React from "react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth-context"
import {
  Users,
  FileText,
  TrendingUp,
  Clock,
  ArrowRight,
  PlusCircle,
  CheckCircle,
  AlertCircle,
  Eye,
} from "lucide-react"

const recentCandidates = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    assessment: "Frontend Developer Assessment",
    score: 92,
    status: "completed",
    date: "2 hours ago",
  },
  {
    id: "2",
    name: "Maria Garcia",
    email: "maria.garcia@email.com",
    assessment: "Full Stack Challenge",
    score: 85,
    status: "completed",
    date: "4 hours ago",
  },
  {
    id: "3",
    name: "John Smith",
    email: "john.smith@email.com",
    assessment: "Backend Developer Test",
    score: null,
    status: "in-progress",
    date: "Started 30 min ago",
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah.wilson@email.com",
    assessment: "Algorithm Challenge",
    score: 78,
    status: "completed",
    date: "Yesterday",
  },
]

const activeAssessments = [
  {
    id: "1",
    title: "Frontend Developer Assessment",
    candidates: 45,
    completed: 32,
    avgScore: 78,
    deadline: "Jan 30, 2026",
  },
  {
    id: "2",
    title: "Full Stack Challenge",
    candidates: 28,
    completed: 15,
    avgScore: 72,
    deadline: "Feb 05, 2026",
  },
  {
    id: "3",
    title: "Backend Developer Test",
    candidates: 35,
    completed: 20,
    avgScore: 81,
    deadline: "Feb 10, 2026",
  },
]

function RecruiterDashboardContent() {
  const { user } = useAuth()
  const [assessments, setAssessments] = React.useState<any[]>([])
  const [submissions, setSubmissions] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [assessRes, subRes] = await Promise.all([
          fetch("/api/assessments", { cache: 'no-store' }),
          fetch("/api/submissions", { cache: 'no-store' })
        ])
        const assessData = await assessRes.json()
        const subData = await subRes.json()

        if (assessData.success) setAssessments(assessData.assessments || [])
        if (subData.success) setSubmissions(subData.submissions || [])
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Aggregate Stats
  const totalCandidates = assessments.reduce((acc, a) => acc + (a.candidates || 0), 0)
  const activeTests = assessments.filter(a => a.status === "active").length
  const avgScore = assessments.length > 0
    ? Math.round(assessments.reduce((acc, a) => acc + (a.avgScore || 0), 0) / assessments.length)
    : 0

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            Welcome back, {user?.name?.split(" ")[0] || "Recruiter"}!
          </h1>
          <p className="text-muted-foreground">
            {"Here's an overview of your recruitment pipeline"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild className="hidden sm:flex bg-transparent">
            <Link href="/recruiter/assessments">View All</Link>
          </Button>
          <Button asChild>
            <Link href="/recruiter/assessments/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Assessment
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{isLoading ? "..." : totalCandidates}</p>
                <p className="text-sm text-muted-foreground">Total Candidates</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                <FileText className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{isLoading ? "..." : activeTests}</p>
                <p className="text-sm text-muted-foreground">Active Tests</p>
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
                <p className="text-2xl font-bold">{isLoading ? "..." : avgScore}%</p>
                <p className="text-sm text-muted-foreground">Avg. Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-5/10">
                <Clock className="h-6 w-6 text-chart-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{isLoading ? "..." : submissions.length}</p>
                <p className="text-sm text-muted-foreground">Total Submissions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Candidates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Recent Candidates
            </CardTitle>
            <CardDescription>Latest assessment submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="py-12 text-center text-muted-foreground">Loading submissions...</div>
              ) : submissions.length > 0 ? (
                submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {sub.studentName?.split(" ").map((n: string) => n[0]).join("") || "S"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{sub.studentName}</p>
                        <p className="text-xs text-muted-foreground">{sub.assessmentTitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={sub.status === "passed" ? "bg-secondary/10 text-secondary" : "bg-destructive/10 text-destructive"}>
                        {sub.score}%
                      </Badge>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/recruiter/candidates/${sub.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center border rounded-lg border-dashed">
                  <p className="text-muted-foreground">No submissions yet</p>
                </div>
              )}
            </div>
            <Button variant="ghost" className="mt-4 w-full" asChild>
              <Link href="/recruiter/candidates">View All Candidates</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Active Assessments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Active Assessments
            </CardTitle>
            <CardDescription>Currently running tests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="py-12 text-center text-muted-foreground">Loading assessments...</div>
              ) : assessments.length > 0 ? (
                assessments.slice(0, 3).map((assessment) => (
                  <div
                    key={assessment.id}
                    className="rounded-lg border border-border p-4"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <p className="font-medium text-foreground">{assessment.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {assessment.created}
                        </p>
                      </div>
                      <Badge variant="outline">
                        Avg: {assessment.avgScore || 0}%
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {assessment.completed || 0} / {assessment.candidates || 0} completed
                        </span>
                        <span className="font-medium text-xs">
                          {assessment.candidates > 0
                            ? Math.round(((assessment.completed || 0) / assessment.candidates) * 100)
                            : 0}%
                        </span>
                      </div>
                      <Progress
                        value={assessment.candidates > 0 ? ((assessment.completed || 0) / assessment.candidates) * 100 : 0}
                        className="h-1.5"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center border rounded-lg border-dashed">
                  <p className="text-muted-foreground">No assessments created</p>
                </div>
              )}
            </div>
            <Button variant="ghost" className="mt-4 w-full" asChild>
              <Link href="/recruiter/assessments">View All Assessments</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto flex-col gap-2 py-4 bg-transparent border-2 hover:border-primary/50" asChild>
              <Link href="/recruiter/assessments/create">
                <PlusCircle className="h-6 w-6 text-primary" />
                <span>Create New Test</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-4 bg-transparent border-2 hover:border-primary/50" asChild>
              <Link href="/recruiter/candidates">
                <Users className="h-6 w-6 text-primary" />
                <span>Browse Candidates</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-4 bg-transparent border-2 hover:border-primary/50" asChild>
              <Link href="/recruiter/questions">
                <FileText className="h-6 w-6 text-primary" />
                <span>Question Bank</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function RecruiterDashboardPage() {
  return (
    <DashboardLayout>
      <RecruiterDashboardContent />
    </DashboardLayout>
  )
}
