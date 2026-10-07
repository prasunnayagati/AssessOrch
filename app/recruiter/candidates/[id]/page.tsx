"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Download,
  Star,
  Code,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Play,
} from "lucide-react";

const mockCandidate = {
  id: "1",
  name: "Alex Johnson",
  email: "alex.johnson@email.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  avatar: null,
  status: "completed",
  appliedDate: "2024-01-10",
  assessments: [
    {
      id: "1",
      title: "Full Stack Developer Assessment",
      score: 85,
      maxScore: 100,
      status: "completed",
      completedAt: "2024-01-12T14:30:00",
      duration: 95,
      totalTime: 120,
      questions: [
        {
          id: "q1",
          title: "Array Manipulation",
          type: "coding",
          score: 90,
          maxScore: 100,
          timeSpent: 25,
          language: "javascript",
        },
        {
          id: "q2",
          title: "Database Query Optimization",
          type: "coding",
          score: 80,
          maxScore: 100,
          timeSpent: 35,
          language: "sql",
        },
        {
          id: "q3",
          title: "React Component Design",
          type: "coding",
          score: 85,
          maxScore: 100,
          timeSpent: 35,
          language: "typescript",
        },
      ],
    },
    {
      id: "2",
      title: "System Design Basics",
      score: 78,
      maxScore: 100,
      status: "completed",
      completedAt: "2024-01-14T10:00:00",
      duration: 45,
      totalTime: 60,
      questions: [
        {
          id: "q1",
          title: "API Design",
          type: "mcq",
          score: 80,
          maxScore: 100,
          timeSpent: 20,
        },
        {
          id: "q2",
          title: "Scalability Concepts",
          type: "mcq",
          score: 75,
          maxScore: 100,
          timeSpent: 25,
        },
      ],
    },
  ],
  skills: [
    { name: "JavaScript", level: 85 },
    { name: "TypeScript", level: 80 },
    { name: "React", level: 85 },
    { name: "Node.js", level: 75 },
    { name: "SQL", level: 70 },
    { name: "System Design", level: 65 },
  ],
  proctoring: {
    tabSwitches: 2,
    suspiciousActivity: false,
    webcamEnabled: true,
    fullscreenViolations: 1,
  },
  notes: [
    {
      id: "1",
      author: "Sarah Miller",
      content: "Strong problem-solving skills. Good communication in code comments.",
      createdAt: "2024-01-13T09:00:00",
    },
    {
      id: "2",
      author: "John Smith",
      content: "Recommend for technical interview round.",
      createdAt: "2024-01-15T14:30:00",
    },
  ],
};

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [newNote, setNewNote] = useState("");
  const [candidate, setCandidate] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const response = await fetch(`/api/submissions/${params.id}`);
        const data = await response.json();
        if (data.success) {
          setCandidate(data.submission);
        }
      } catch (error) {
        console.error("Error fetching candidate:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCandidate();
  }, [params.id]);

  if (isLoading) return <DashboardLayout><div className="p-8 text-center">Loading candidate data...</div></DashboardLayout>;
  if (!candidate) return <DashboardLayout><div className="p-8 text-center text-destructive">Candidate not found</div></DashboardLayout>;

  const overallScore = candidate.score || 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80)
      return <Badge className="bg-green-100 text-green-700">Excellent</Badge>;
    if (score >= 60)
      return <Badge className="bg-amber-100 text-amber-700">Good</Badge>;
    return <Badge className="bg-red-100 text-red-700">Needs Improvement</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{candidate.name}</h1>
            <p className="text-muted-foreground">Candidate Profile</p>
          </div>
          <div className="flex gap-2">
            <Button>Schedule Interview</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">
                    {candidate.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </span>
                </div>
              </div>

              <div className="text-center">
                <h3 className="font-semibold text-lg">{candidate.name}</h3>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>
                    {overallScore}%
                  </span>
                  {getScoreBadge(overallScore)}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{candidate.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{candidate.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{candidate.location}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Applied {new Date(candidate.appliedDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Proctoring Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tab Switches</span>
                    <span className={(candidate.proctoringData?.tabViolations || 0) > 3 ? "text-destructive font-bold" : "text-foreground font-medium"}>
                      {candidate.proctoringData?.tabViolations || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Copy-Paste Attempts</span>
                    <span className={(candidate.proctoringData?.copyPasteViolations || 0) > 0 ? "text-destructive font-bold" : "text-foreground font-medium"}>
                      {candidate.proctoringData?.copyPasteViolations || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Suspicious Activity</span>
                    {(candidate.proctoringData?.tabViolations || 0) > 3 || (candidate.proctoringData?.copyPasteViolations || 0) > 0 ? (
                      <Badge variant="destructive">Warning</Badge>
                    ) : (
                      <Badge className="bg-secondary/10 text-secondary border-none">Cleared</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="assessments">
              <TabsList>
                <TabsTrigger value="assessments">Assessments</TabsTrigger>
                <TabsTrigger value="skills">Skills Analysis</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="assessments" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{candidate.assessmentTitle}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Completed on {candidate.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getScoreColor(candidate.score)}`}>
                          {candidate.score}%
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg border p-4 bg-muted/30">
                      <p className="text-sm text-muted-foreground italic text-center">
                        Performance signals within normal range. Code review recording available.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="skills" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Skills Assessment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(candidate.skills || []).map((skill: any) => (
                        <div key={skill.name} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{skill.name}</span>
                            <span className={getScoreColor(skill.level)}>{skill.level}%</span>
                          </div>
                          <Progress value={skill.level} className="h-2" />
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-6 border-t">
                      <h4 className="font-medium mb-4">Strengths & Areas for Improvement</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-green-600 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Strengths
                          </p>
                          <ul className="text-sm space-y-1 text-muted-foreground">
                            {(candidate.skills || [])
                              .filter((s: any) => s.level >= 80)
                              .map((s: any) => (
                                <li key={s.name}>- {s.name}</li>
                              ))}
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-amber-600 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Areas to Develop
                          </p>
                          <ul className="text-sm space-y-1 text-muted-foreground">
                            {(candidate.skills || [])
                              .filter((s: any) => s.level < 70)
                              .map((s: any) => (
                                <li key={s.name}>- {s.name}</li>
                              ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notes" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recruiter Notes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      {(candidate.notes || []).map((note: any) => (
                        <div key={note.id} className="p-4 bg-muted/50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{note.author}</span>
                            <span className="text-sm text-muted-foreground">
                              {new Date(note.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{note.content}</p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t">
                      <textarea
                        className="w-full p-3 border rounded-lg bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                        rows={3}
                        placeholder="Add a note about this candidate..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                      />
                      <div className="flex justify-end mt-2">
                        <Button disabled={!newNote.trim()}>Add Note</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
