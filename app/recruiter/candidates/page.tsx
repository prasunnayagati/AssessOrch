"use client"

import React, { useState, Suspense } from "react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  MoreHorizontal,
  Eye,
  Mail,
  Download,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Filter,
} from "lucide-react"
import { useSearchParams } from "next/navigation"
import Loading from "./loading"

const candidates = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    assessment: "Frontend Developer Assessment",
    score: 92,
    status: "passed",
    completedAt: "Jan 24, 2026",
    duration: "78 min",
    starred: true,
  },
  {
    id: "2",
    name: "Maria Garcia",
    email: "maria.garcia@email.com",
    assessment: "Full Stack Challenge",
    score: 85,
    status: "passed",
    completedAt: "Jan 24, 2026",
    duration: "112 min",
    starred: false,
  },
  {
    id: "3",
    name: "John Smith",
    email: "john.smith@email.com",
    assessment: "Backend Developer Test",
    score: null,
    status: "in-progress",
    completedAt: null,
    duration: null,
    starred: false,
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah.wilson@email.com",
    assessment: "Algorithm Challenge",
    score: 78,
    status: "passed",
    completedAt: "Jan 23, 2026",
    duration: "55 min",
    starred: true,
  },
  {
    id: "5",
    name: "David Brown",
    email: "david.brown@email.com",
    assessment: "Frontend Developer Assessment",
    score: 45,
    status: "failed",
    completedAt: "Jan 22, 2026",
    duration: "90 min",
    starred: false,
  },
  {
    id: "6",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    assessment: "System Design Interview",
    score: 88,
    status: "passed",
    completedAt: "Jan 21, 2026",
    duration: "42 min",
    starred: true,
  },
  {
    id: "7",
    name: "Michael Lee",
    email: "michael.lee@email.com",
    assessment: "Full Stack Challenge",
    score: null,
    status: "invited",
    completedAt: null,
    duration: null,
    starred: false,
  },
  {
    id: "8",
    name: "Jennifer Taylor",
    email: "jennifer.taylor@email.com",
    assessment: "Python Backend Assessment",
    score: 72,
    status: "passed",
    completedAt: "Jan 20, 2026",
    duration: "85 min",
    starred: false,
  },
]

function CandidatesContent() {
  const [candidates, setCandidates] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [starredOnly, setStarredOnly] = useState(false)
  const searchParams = useSearchParams()

  React.useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch("/api/submissions", { cache: 'no-store' })
        const data = await response.json()
        if (data.success) {
          // Map submission data to candidate shape
          const mapped = data.submissions.map((s: any) => ({
            id: s.id,
            name: s.studentName,
            email: s.studentEmail,
            assessment: s.assessmentTitle,
            score: s.score,
            status: s.status || "passed",
            completedAt: s.date,
            duration: "45 min", // Placeholder for now
            starred: false
          }))
          setCandidates(mapped)
        }
      } catch (error) {
        console.error("Error fetching candidates:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSubmissions()
  }, [])

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.assessment.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || candidate.status === statusFilter
    const matchesStarred = !starredOnly || candidate.starred
    return matchesSearch && matchesStatus && matchesStarred
  })

  const getStatusBadge = (status: string, score: number | null) => {
    switch (status) {
      case "passed":
        return (
          <Badge className="bg-secondary/10 text-secondary">
            <CheckCircle className="mr-1 h-3 w-3" />
            Passed ({score}%)
          </Badge>
        )
      case "failed":
        return (
          <Badge className="bg-destructive/10 text-destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Failed ({score}%)
          </Badge>
        )
      case "in-progress":
        return (
          <Badge className="bg-accent/10 text-accent">
            <Clock className="mr-1 h-3 w-3" />
            In Progress
          </Badge>
        )
      case "invited":
        return (
          <Badge className="bg-chart-5/10 text-chart-5">
            <Mail className="mr-1 h-3 w-3" />
            Invited
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Candidates</h1>
          <p className="text-muted-foreground">
            View and manage all assessment candidates
          </p>
        </div>

      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total</span>
            </div>
            <p className="mt-1 text-2xl font-bold">{candidates.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-secondary" />
              <span className="text-sm text-muted-foreground">Passed</span>
            </div>
            <p className="mt-1 text-2xl font-bold">
              {candidates.filter((c) => c.status === "passed").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-accent" />
              <span className="text-sm text-muted-foreground">In Progress</span>
            </div>
            <p className="mt-1 text-2xl font-bold">
              {candidates.filter((c) => c.status === "in-progress").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-accent" />
              <span className="text-sm text-muted-foreground">Starred</span>
            </div>
            <p className="mt-1 text-2xl font-bold">
              {candidates.filter((c) => c.starred).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or assessment..."
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
            <SelectItem value="passed">Passed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="invited">Invited</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant={starredOnly ? "default" : "outline"}
          onClick={() => setStarredOnly(!starredOnly)}
        >
          <Star className={`mr-2 h-4 w-4 ${starredOnly ? "fill-current" : ""}`} />
          Starred
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Candidate</TableHead>
                <TableHead>Assessment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={candidate.starred ? "text-accent" : "text-muted-foreground"}
                    >
                      <Star
                        className={`h-4 w-4 ${candidate.starred ? "fill-accent" : ""}`}
                      />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {candidate.name?.split(" ").map((n: string) => n[0]).join("") || "C"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{candidate.name}</p>
                        <p className="text-sm text-muted-foreground">{candidate.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {candidate.assessment}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(candidate.status, candidate.score)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {candidate.duration || "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {candidate.completedAt || "-"}
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
                          <Link href={`/recruiter/candidates/${candidate.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Star className="mr-2 h-4 w-4" />
                          {candidate.starred ? "Remove Star" : "Add Star"}
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

export default function CandidatesPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<Loading />}>
        <CandidatesContent />
      </Suspense>
    </DashboardLayout>
  )
}
