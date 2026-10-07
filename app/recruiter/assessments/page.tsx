"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  PlusCircle,
  MoreHorizontal,
  Eye,
  Edit,
  Copy,
  Trash2,
  Users,
  Clock,
  Calendar,
  Link as LinkIcon,
  BarChart3,
} from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Loading from "./loading"
import { toast } from "@/hooks/use-toast"

interface Assessment {
  id: string
  title: string
  description?: string
  status: string
  candidates: number
  completed: number
  avgScore: number
  created: string
  deadline: string | null
  questions: number
  duration: number
  passingScore?: number
  difficulty?: string
  skills?: string[]
}

function AssessmentsContent() {
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchAssessments()
  }, [])

  const fetchAssessments = async () => {
    try {
      const response = await fetch("/api/assessments", { cache: 'no-store' })
      const data = await response.json()
      if (data.success) {
        setAssessments(data.assessments)
      } else {
        toast({
          title: "Error loading assessments",
          description: "Failed to load assessments from server",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching assessments:", error)
      toast({
        title: "Error",
        description: "Failed to load assessments",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredAssessments = assessments.filter((assessment) => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || assessment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-secondary/10 text-secondary">Active</Badge>
      case "draft":
        return <Badge className="bg-muted text-muted-foreground">Draft</Badge>
      case "closed":
        return <Badge className="bg-chart-5/10 text-chart-5">Closed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading assessments...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Assessments</h1>
          <p className="text-muted-foreground">Manage your coding assessments</p>
        </div>
        <Button asChild>
          <Link href="/recruiter/assessments/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Assessment
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total</span>
            </div>
            <p className="mt-1 text-2xl font-bold">{assessments.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-secondary" />
              <span className="text-sm text-muted-foreground">Active</span>
            </div>
            <p className="mt-1 text-2xl font-bold">
              {assessments.filter((a) => a.status === "active").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Candidates</span>
            </div>
            <p className="mt-1 text-2xl font-bold">
              {assessments.reduce((acc, a) => acc + a.candidates, 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Avg. Score</span>
            </div>
            <p className="mt-1 text-2xl font-bold">
              {Math.round(
                assessments
                  .filter((a) => a.avgScore > 0)
                  .reduce((acc, a) => acc + a.avgScore, 0) /
                assessments.filter((a) => a.avgScore > 0).length
              )}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search assessments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assessment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Avg. Score</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssessments.map((assessment) => (
                <TableRow key={assessment.id}>
                  <TableCell>
                    <div>
                      <Link
                        href={`/recruiter/assessments/${assessment.id}`}
                        className="font-medium text-foreground hover:underline"
                      >
                        {assessment.title}
                      </Link>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {assessment.duration} min
                        </span>
                        <span>{assessment.questions} questions</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(assessment.status)}</TableCell>
                  <TableCell>
                    <div className="w-32">
                      <div className="mb-1 flex justify-between text-xs">
                        <span>{assessment.completed}/{assessment.candidates}</span>
                        <span>
                          {assessment.candidates > 0
                            ? Math.round((assessment.completed / assessment.candidates) * 100)
                            : 0}%
                        </span>
                      </div>
                      <Progress
                        value={
                          assessment.candidates > 0
                            ? (assessment.completed / assessment.candidates) * 100
                            : 0
                        }
                        className="h-1.5"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    {assessment.avgScore > 0 ? (
                      <span className="font-medium">{assessment.avgScore}%</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {assessment.deadline ? (
                      <span className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {assessment.deadline}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/recruiter/assessments/${assessment.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/recruiter/assessments/${assessment.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <LinkIcon className="mr-2 h-4 w-4" />
                          Copy Link
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default function RecruiterAssessmentsPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<Loading />}>
        <AssessmentsContent />
      </Suspense>
    </DashboardLayout>
  )
}
