"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Copy,
  Settings,
  Users,
  Clock,
  BarChart3,
  MoreVertical,
  Mail,
  Eye,
  Trash2,
  Link as LinkIcon,
  Share2,
  Edit,
  Play,
  Pause,
} from "lucide-react";

const mockAssessment = {
  id: "1",
  title: "Full Stack Developer Assessment",
  description: "Comprehensive assessment for full stack developer candidates covering React, Node.js, and database skills.",
  status: "active",
  createdAt: "2024-01-05",
  expiresAt: "2024-02-05",
  timeLimit: 120,
  passingScore: 70,
  totalQuestions: 5,
  difficulty: "intermediate",
  languages: ["javascript", "typescript", "sql"],
  inviteLink: "https://codeassess.io/take/abc123xyz",
  stats: {
    totalInvited: 45,
    started: 38,
    completed: 32,
    avgScore: 72,
    avgTime: 95,
  },
  candidates: [
    {
      id: "1",
      name: "Alex Johnson",
      email: "alex.johnson@email.com",
      status: "completed",
      score: 85,
      completedAt: "2024-01-12T14:30:00",
      duration: 95,
    },
    {
      id: "2",
      name: "Sarah Williams",
      email: "sarah.w@email.com",
      status: "completed",
      score: 92,
      completedAt: "2024-01-13T10:15:00",
      duration: 88,
    },
    {
      id: "3",
      name: "Mike Chen",
      email: "mike.chen@email.com",
      status: "in_progress",
      score: null,
      completedAt: null,
      duration: null,
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily.d@email.com",
      status: "invited",
      score: null,
      completedAt: null,
      duration: null,
    },
    {
      id: "5",
      name: "James Wilson",
      email: "j.wilson@email.com",
      status: "completed",
      score: 68,
      completedAt: "2024-01-14T16:45:00",
      duration: 115,
    },
  ],
  questions: [
    {
      id: "q1",
      title: "Array Manipulation",
      type: "coding",
      difficulty: "easy",
      points: 20,
      avgScore: 78,
    },
    {
      id: "q2",
      title: "Database Query Optimization",
      type: "coding",
      difficulty: "medium",
      points: 25,
      avgScore: 65,
    },
    {
      id: "q3",
      title: "React Component Design",
      type: "coding",
      difficulty: "medium",
      points: 25,
      avgScore: 72,
    },
    {
      id: "q4",
      title: "API Design Principles",
      type: "mcq",
      difficulty: "easy",
      points: 15,
      avgScore: 85,
    },
    {
      id: "q5",
      title: "System Architecture",
      type: "mcq",
      difficulty: "hard",
      points: 15,
      avgScore: 58,
    },
  ],
};

export default function AssessmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  const assessment = mockAssessment;

  const copyLink = () => {
    navigator.clipboard.writeText(assessment.inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-700">Completed</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-700">In Progress</Badge>;
      case "invited":
        return <Badge className="bg-amber-100 text-amber-700">Invited</Badge>;
      case "expired":
        return <Badge variant="secondary">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return <Badge className="bg-green-100 text-green-700">Easy</Badge>;
      case "medium":
        return <Badge className="bg-amber-100 text-amber-700">Medium</Badge>;
      case "hard":
        return <Badge className="bg-red-100 text-red-700">Hard</Badge>;
      default:
        return <Badge variant="outline">{difficulty}</Badge>;
    }
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return "text-muted-foreground";
    if (score >= 80) return "text-green-600";
    if (score >= assessment.passingScore) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <DashboardLayout role="recruiter">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">{assessment.title}</h1>
              <Badge className={assessment.status === "active" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}>
                {assessment.status === "active" ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="text-muted-foreground">{assessment.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            {assessment.status === "active" ? (
              <Button variant="outline">
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            ) : (
              <Button variant="outline">
                <Play className="h-4 w-4 mr-2" />
                Activate
              </Button>
            )}
            <Button>
              <Share2 className="h-4 w-4 mr-2" />
              Invite
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{assessment.stats.completed}/{assessment.stats.totalInvited}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{assessment.stats.avgScore}%</p>
                  <p className="text-sm text-muted-foreground">Avg Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{assessment.stats.avgTime} min</p>
                  <p className="text-sm text-muted-foreground">Avg Time</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-100 rounded-lg">
                  <Settings className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{assessment.passingScore}%</p>
                  <p className="text-sm text-muted-foreground">Pass Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Share Assessment Link</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 p-3 bg-muted rounded-lg">
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
                <code className="text-sm flex-1 truncate">{assessment.inviteLink}</code>
              </div>
              <Button variant="outline" onClick={copyLink}>
                <Copy className="h-4 w-4 mr-2" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <div className="flex gap-2 mt-4">
              <Input
                placeholder="Enter email to invite candidate..."
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1"
              />
              <Button disabled={!inviteEmail.includes("@")}>
                <Mail className="h-4 w-4 mr-2" />
                Send Invite
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="candidates">
          <TabsList>
            <TabsTrigger value="candidates">Candidates ({assessment.candidates.length})</TabsTrigger>
            <TabsTrigger value="questions">Questions ({assessment.questions.length})</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="candidates" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidate</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assessment.candidates.map((candidate) => (
                      <TableRow key={candidate.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{candidate.name}</p>
                            <p className="text-sm text-muted-foreground">{candidate.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(candidate.status)}</TableCell>
                        <TableCell>
                          {candidate.score !== null ? (
                            <span className={`font-semibold ${getScoreColor(candidate.score)}`}>
                              {candidate.score}%
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {candidate.duration !== null ? (
                            <span>{candidate.duration} min</span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {candidate.completedAt ? (
                            new Date(candidate.completedAt).toLocaleDateString()
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => router.push(`/recruiter/candidates/${candidate.id}`)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="h-4 w-4 mr-2" />
                                Send Reminder
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove
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
          </TabsContent>

          <TabsContent value="questions" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Question</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Avg Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assessment.questions.map((question, index) => (
                      <TableRow key={question.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <span className="text-muted-foreground font-mono text-sm">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="font-medium">{question.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{question.type.toUpperCase()}</Badge>
                        </TableCell>
                        <TableCell>{getDifficultyBadge(question.difficulty)}</TableCell>
                        <TableCell>{question.points}</TableCell>
                        <TableCell>
                          <span className={getScoreColor(question.avgScore)}>
                            {question.avgScore}%
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Assessment Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium">Time Limit</label>
                    <p className="text-muted-foreground">{assessment.timeLimit} minutes</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Passing Score</label>
                    <p className="text-muted-foreground">{assessment.passingScore}%</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Expires On</label>
                    <p className="text-muted-foreground">
                      {new Date(assessment.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Languages</label>
                    <div className="flex gap-2 mt-1">
                      {assessment.languages.map((lang) => (
                        <Badge key={lang} variant="outline">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-4">Proctoring Settings</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span>Webcam Required</span>
                      <Badge className="bg-green-100 text-green-700">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span>Tab Switch Detection</span>
                      <Badge className="bg-green-100 text-green-700">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span>Full Screen Mode</span>
                      <Badge className="bg-green-100 text-green-700">Required</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span>Copy/Paste Prevention</span>
                      <Badge className="bg-green-100 text-green-700">Enabled</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
