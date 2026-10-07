"use client"

import React from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    ArrowLeft,
    BarChart3,
    CheckCircle2,
    XCircle,
    Clock,
    Target,
    FileText
} from "lucide-react"
import Link from "next/link"

export default function DetailedResultPage() {
    const params = useParams()
    const router = useRouter()
    const [assessment, setAssessment] = React.useState<any>(null)
    const [loading, setLoading] = React.useState(true)

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
            } finally {
                setLoading(false)
            }
        }
        fetchAssessment()
    }, [params.id])

    if (loading) return <DashboardLayout>Loading results...</DashboardLayout>

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Results: {assessment?.title || "Assessment"}</h1>
                        <p className="text-muted-foreground">Detailed performance analysis</p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Overall Score</CardDescription>
                            <CardTitle className="text-3xl text-primary">80%</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Progress value={80} className="h-2" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Questions Answered</CardDescription>
                            <CardTitle className="text-3xl">{assessment?.fullQuestions?.length || 0}/{assessment?.fullQuestions?.length || 0}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 text-sm text-secondary">
                                <CheckCircle2 className="h-4 w-4" />
                                <span>100% Completion rate</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Accuracy</CardDescription>
                            <CardTitle className="text-3xl">92%</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 text-sm text-amber-500">
                                <Target className="h-4 w-4" />
                                <span>High precision in coding tasks</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Question Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {assessment?.fullQuestions?.map((q: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                                    <div className="flex items-center gap-4">
                                        <div className="h-8 w-8 rounded-full bg-secondary/20 text-secondary flex items-center justify-center font-bold">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <p className="font-medium">{q.title}</p>
                                            <p className="text-xs text-muted-foreground uppercase">{q.type}</p>
                                        </div>
                                    </div>
                                    <Badge className="bg-secondary/10 text-secondary border-none">Correct</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
