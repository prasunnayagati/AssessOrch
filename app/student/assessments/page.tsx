"use client"

import React, { useState, Suspense, useEffect } from "react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Clock,
  Search,
  Filter,
  Building2,
  Code,
  Calendar,
  ArrowRight,
} from "lucide-react"
import { useSearchParams } from "next/navigation"
import Loading from "./loading"

// Data will be fetched from the API


function AssessmentsContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [assessments, setAssessments] = useState<any[]>([])
  const [submissions, setSubmissions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [now, setNow] = useState<number>(0)

  useEffect(() => {
    setNow(Date.now())
    const fetchData = async () => {
      try {
        const [assessRes, subRes] = await Promise.all([
          fetch("/api/assessments", { cache: 'no-store' }),
          fetch("/api/submissions", { cache: 'no-store' })
        ])
        const assessData = await assessRes.json()
        const subData = await subRes.json()

        if (assessData.success) {
          setAssessments(assessData.assessments || [])
        }
        if (subData.success) {
          setSubmissions(subData.submissions || [])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load assessments",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredAssessments = assessments.filter((assessment) => {
    const matchesSearch =
      assessment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (assessment.company && assessment.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      assessment.skills.some((skill: string) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      )
    const matchesDifficulty =
      difficultyFilter === "all" || assessment.difficulty === difficultyFilter
    return matchesSearch && matchesDifficulty
  })


  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-secondary/10 text-secondary"
      case "intermediate":
        return "bg-accent/10 text-accent"
      case "advanced":
        return "bg-destructive/10 text-destructive"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">Available Assessments</h1>
        <p className="text-muted-foreground">Browse and take coding assessments from top companies</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title, company, or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="available">
        <TabsList>
          <TabsTrigger value="available">Available ({assessments.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({submissions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="mt-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <h3 className="text-lg font-medium">Fetching available assessments...</h3>
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                {filteredAssessments.map((assessment) => (
                  <Card key={assessment.id} className="flex flex-col border-border hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">{assessment.title}</CardTitle>
                            {now > 0 && new Date(assessment.created).getTime() > now - 86400000 && (
                              <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] h-4 px-1">New</Badge>
                            )}
                          </div>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <Building2 className="h-3 w-3" />
                            {assessment.company || "Tech Recruitment"}
                          </CardDescription>
                        </div>
                        <Badge className={getDifficultyColor(assessment.difficulty)}>
                          {assessment.difficulty}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col">
                      <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{assessment.description}</p>

                      <div className="mb-4 flex flex-wrap gap-1.5">
                        {assessment.skills.map((skill: string) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            <Code className="mr-1 h-3 w-3" />
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {assessment.duration} min
                          </span>
                          <span>{assessment.questions} questions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            Due {assessment.deadline || "N/A"}
                          </span>
                        </div>
                      </div>

                      <Button className="mt-4" asChild>
                        <Link href={`/student/assessment/${assessment.id}/start`}>
                          Start Assessment
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredAssessments.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg border-dashed">
                  <Search className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No assessments found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              )}
            </>
          )}
        </TabsContent>


        <TabsContent value="completed" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {isLoading ? (
              <div className="col-span-2 flex flex-col items-center justify-center py-20 text-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <h3 className="text-lg font-medium">Fetching completed assessments...</h3>
              </div>
            ) : submissions.length > 0 ? (
              submissions.map((submission) => (
                <Card key={submission.id} className="flex flex-col border-border hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{submission.assessmentTitle || "Assessment"}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <Building2 className="h-3 w-3" />
                          {submission.company || "Recruiter"}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{submission.score}%</div>
                        <Badge className={submission.score >= 70 ? "bg-secondary/10 text-secondary" : "bg-destructive/10 text-destructive"}>
                          {submission.score >= 70 ? "Passed" : "Failed"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col">
                    <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                      You have successfully completed this assessment.
                    </p>

                    <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {submission.timeSpent || "N/A"}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Completed {submission.date}
                      </span>
                    </div>

                    <Button variant="outline" className="mt-4 bg-transparent" asChild>
                      <Link href={`/student/results/${submission.id}`}>
                        View Detailed Results
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-2 flex flex-col items-center justify-center py-12 text-center border rounded-lg border-dashed">
                <p className="text-muted-foreground">No completed assessments yet</p>
                <Button variant="link" onClick={() => (document.querySelector('[value="available"]') as HTMLElement)?.click()}>
                  Browse available assessments
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function StudentAssessmentsPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<Loading />}>
        <AssessmentsContent />
      </Suspense>
    </DashboardLayout>
  )
}
