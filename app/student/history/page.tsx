"use client"

import React, { useState } from "react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useEffect } from "react"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Search,
  Filter,
  Calendar,
  Clock,
  Trophy,
  Target,
  TrendingUp,
  Eye,
  Download,
  BarChart3,
} from "lucide-react"

const assessmentHistory = [
  {
    id: "1",
    title: "Frontend Developer Assessment",
    company: "TechCorp",
    date: "Jan 20, 2026",
    duration: "87 min",
    score: 85,
    maxScore: 100,
    status: "passed",
    type: "assessment",
    questions: 15,
    timeSpent: "87 min",
  },
  {
    id: "2",
    title: "Full Stack Challenge",
    company: "StartupXYZ",
    date: "Jan 18, 2026",
    duration: "120 min",
    score: 78,
    maxScore: 100,
    status: "passed",
    type: "assessment",
    questions: 20,
    timeSpent: "115 min",
  },
  {
    id: "3",
    title: "Backend Developer Test",
    company: "Enterprise Inc",
    date: "Jan 15, 2026",
    duration: "90 min",
    score: 92,
    maxScore: 100,
    status: "passed",
    type: "assessment",
    questions: 12,
    timeSpent: "78 min",
  },
  {
    id: "4",
    title: "Algorithm & Data Structures",
    company: "BigTech Corp",
    date: "Jan 12, 2026",
    duration: "60 min",
    score: 68,
    maxScore: 100,
    status: "needs-improvement",
    type: "assessment",
    questions: 10,
    timeSpent: "62 min",
  },
]

const practiceHistory = [
  {
    id: "1",
    title: "Two Sum",
    difficulty: "easy",
    category: "arrays",
    attempts: 3,
    bestTime: "12 min",
    status: "solved",
    lastAttempt: "Jan 22, 2026",
    language: "JavaScript",
  },
  {
    id: "2",
    title: "Valid Parentheses",
    difficulty: "easy",
    category: "strings",
    attempts: 2,
    bestTime: "8 min",
    status: "solved",
    lastAttempt: "Jan 21, 2026",
    language: "Python",
  },
  {
    id: "3",
    title: "Maximum Subarray",
    difficulty: "medium",
    category: "arrays",
    attempts: 5,
    bestTime: "25 min",
    status: "solved",
    lastAttempt: "Jan 20, 2026",
    language: "JavaScript",
  },
  {
    id: "4",
    title: "Binary Tree Inorder Traversal",
    difficulty: "medium",
    category: "trees",
    attempts: 4,
    bestTime: null,
    status: "attempted",
    lastAttempt: "Jan 19, 2026",
    language: "JavaScript",
  },
  {
    id: "5",
    title: "Climbing Stairs",
    difficulty: "easy",
    category: "dynamic-programming",
    attempts: 1,
    bestTime: "5 min",
    status: "solved",
    lastAttempt: "Jan 18, 2026",
    language: "Python",
  },
]

function HistoryContent() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
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
        console.error("Error fetching submissions:", error)
        toast({
          title: "Error",
          description: "Failed to load history",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchSubmissions()
  }, [user?.id])

  const getStatusBadge = (status: string, type: string, score?: number) => {
    if (type === "assessment") {
      const isPassed = score !== undefined ? score >= 70 : status === "passed"
      if (isPassed) {
        return <Badge className="bg-secondary/10 text-secondary">Passed</Badge>
      } else {
        return <Badge className="bg-accent/10 text-accent">Needs Work</Badge>
      }
    } else {
      switch (status) {
        case "solved":
          return <Badge className="bg-secondary/10 text-secondary">Solved</Badge>
        case "attempted":
          return <Badge className="bg-muted text-muted-foreground">Attempted</Badge>
        default:
          return <Badge variant="outline">{status}</Badge>
      }
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-secondary/10 text-secondary"
      case "medium":
        return "bg-accent/10 text-accent"
      case "hard":
        return "bg-destructive/10 text-destructive"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const filteredAssessments = submissions.filter((item) => {
    const title = item.assessmentTitle || "Assessment"
    const company = item.company || "Recruiter"
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || typeFilter === "assessments"
    return matchesSearch && matchesType
  })

  const filteredPractice = practiceHistory.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || typeFilter === "practice"
    return matchesSearch && matchesType
  })

  const totalAssessments = submissions.length
  const passedAssessments = submissions.filter(s => (s.score || 0) >= 70).length
  const solvedProblems = practiceHistory.filter(p => p.status === "solved").length
  const averageScore = totalAssessments > 0
    ? Math.round(submissions.reduce((acc, s) => acc + (s.score || 0), 0) / totalAssessments)
    : 0
  const activeDays = new Set(submissions.map(s => {
    if (s.submittedAt?.toDate) return s.submittedAt.toDate().toDateString()
    return new Date(s.submittedAt?.seconds * 1000).toDateString()
  })).size || 1

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">History</h1>
          <p className="text-muted-foreground">
            Track your progress and review past attempts
          </p>
        </div>
        <div className="flex gap-2">
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{passedAssessments}/{totalAssessments}</p>
                <p className="text-sm text-muted-foreground">Assessments Passed</p>
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
                <p className="text-2xl font-bold">{solvedProblems}</p>
                <p className="text-sm text-muted-foreground">Problems Solved</p>
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
                <p className="text-2xl font-bold">{averageScore}%</p>
                <p className="text-sm text-muted-foreground">Average Score</p>
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
                <p className="text-2xl font-bold">{activeDays}</p>
                <p className="text-sm text-muted-foreground">Active Days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search history..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="assessments">Assessments</SelectItem>
                <SelectItem value="practice">Practice</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* History Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All History</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="practice">Practice</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Recent Assessments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Recent Assessments
              </CardTitle>
              <CardDescription>Your assessment performance history</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Assessment</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                        <p className="text-sm text-muted-foreground mt-2">Loading assessments...</p>
                      </TableCell>
                    </TableRow>
                  ) : filteredAssessments.length > 0 ? (
                    filteredAssessments.slice(0, 3).map((assessment) => (
                      <TableRow key={assessment.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{assessment.assessmentTitle || "Assessment"}</p>
                            <p className="text-sm text-muted-foreground">
                              {assessment.score}% score • {assessment.date}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{assessment.company || "Recruiter"}</TableCell>
                        <TableCell>{assessment.date}</TableCell>
                        <TableCell>
                          <span className="font-medium">{assessment.score}%</span>
                        </TableCell>
                        <TableCell>{getStatusBadge("", "assessment", assessment.score)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/student/results/${assessment.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No assessment history found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Recent Practice */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-secondary" />
                Recent Practice
              </CardTitle>
              <CardDescription>Your practice problem attempts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Problem</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Attempts</TableHead>
                    <TableHead>Best Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Attempt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPractice.slice(0, 3).map((problem) => (
                    <TableRow key={problem.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{problem.title}</p>
                          <p className="text-sm text-muted-foreground">{problem.category}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getDifficultyColor(problem.difficulty)}>
                          {problem.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell>{problem.attempts}</TableCell>
                      <TableCell>{problem.bestTime || "-"}</TableCell>
                      <TableCell>{getStatusBadge(problem.status, "practice")}</TableCell>
                      <TableCell>{problem.lastAttempt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessments" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Assessment</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Time Spent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                        <p className="text-sm text-muted-foreground mt-2">Loading assessments...</p>
                      </TableCell>
                    </TableRow>
                  ) : filteredAssessments.length > 0 ? (
                    filteredAssessments.map((assessment) => (
                      <TableRow key={assessment.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{assessment.assessmentTitle || "Assessment"}</p>
                            <p className="text-sm text-muted-foreground font-mono text-[10px]">
                              ID: {assessment.assessmentId}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{assessment.company || "Recruiter"}</TableCell>
                        <TableCell>{assessment.date}</TableCell>
                        <TableCell>
                          <span className="font-medium">{assessment.score}%</span>
                        </TableCell>
                        <TableCell>{assessment.timeSpent || "-"}</TableCell>
                        <TableCell>{getStatusBadge("", "assessment", assessment.score)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/student/results/${assessment.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No assessment history found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="practice" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Problem</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Attempts</TableHead>
                    <TableHead>Best Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Attempt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPractice.map((problem) => (
                    <TableRow key={problem.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{problem.title}</p>
                          <p className="text-sm text-muted-foreground">{problem.language}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getDifficultyColor(problem.difficulty)}>
                          {problem.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize">{problem.category.replace("-", " ")}</TableCell>
                      <TableCell>{problem.attempts}</TableCell>
                      <TableCell>{problem.bestTime || "-"}</TableCell>
                      <TableCell>{getStatusBadge(problem.status, "practice")}</TableCell>
                      <TableCell>{problem.lastAttempt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function HistoryPage() {
  return (
    <DashboardLayout>
      <HistoryContent />
    </DashboardLayout>
  )
}