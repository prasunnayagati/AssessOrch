"use client"

import React, { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "@/hooks/use-toast"
import {
  Clock,
  FileText,
  AlertTriangle,
  Monitor,
  Camera,
  Shield,
  ArrowRight,
  Building2,
  Code,
  Info,
  Loader2,
} from "lucide-react"

function AssessmentStartContent() {
  const params = useParams()
  const router = useRouter()
  const [agreedToRules, setAgreedToRules] = useState(false)
  const [webcamConsent, setWebcamConsent] = useState(false)
  const [fullscreenConsent, setFullscreenConsent] = useState(false)
  const [assessment, setAssessment] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const assessmentId = params.id as string

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const response = await fetch(`/api/assessments/${assessmentId}`, { cache: 'no-store' })
        const data = await response.json()
        if (data.success) {
          setAssessment(data.assessment)
        } else {
          toast({
            title: "Assessment not found",
            description: "Please check the link and try again.",
            variant: "destructive"
          })
        }
      } catch (error) {
        console.error("Error fetching assessment:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAssessment()
  }, [assessmentId])

  const canStart = agreedToRules && webcamConsent && fullscreenConsent

  const handleStart = async () => {
    try {
      await fetch(`/api/assessments/${assessmentId}/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start" }),
      })
    } catch (error) {
      console.error("Error tracking start:", error)
    }
    router.push(`/student/assessment/${assessmentId}/take`)
  }

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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="font-medium text-muted-foreground">Preparing your environment...</p>
        </div>
      </div>
    )
  }

  if (!assessment) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
          <h2 className="text-2xl font-bold">Assessment Unavailable</h2>
          <Button onClick={() => router.push("/student/dashboard")}>Back to Dashboard</Button>
        </div>
      </div>
    )
  }

  const rules = [
    "You must complete the assessment in one sitting",
    assessment.enableTabDetection ? "Do not switch tabs or leave the assessment window" : null,
    assessment.enableCopyPasteDetection ? "Copy-pasting from external sources is monitored" : null,
    assessment.enableWebcam ? "Webcam proctoring will be enabled throughout" : null,
    assessment.enableProctoring ? "Your screen activity may be recorded" : null,
  ].filter(Boolean)

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            Back to Assessments
          </Button>
          <h1 className="text-3xl font-bold text-foreground">{assessment.title}</h1>
          <div className="mt-2 flex items-center gap-2 text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span>{assessment.company || "Direct Recruitment"}</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Assessment Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Assessment Overview</CardTitle>
                <CardDescription>{assessment.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-medium">{assessment.duration} minutes</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Questions</p>
                      <p className="font-medium">{assessment.questions} questions</p>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div>
                  <h4 className="mb-2 text-sm font-medium">Skills Tested</h4>
                  <div className="flex flex-wrap gap-2">
                    {assessment.skills.map((skill: string) => (
                      <Badge key={skill} variant="outline">
                        <Code className="mr-1 h-3 w-3" />
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <Badge className={getDifficultyColor(assessment.difficulty)}>
                    {assessment.difficulty}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Passing Score: {assessment.passingScore}%
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Rules */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Assessment Rules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
                      <span className="text-sm text-muted-foreground">{rule}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Consent Checkboxes */}
            <Card>
              <CardHeader>
                <CardTitle>Agreement & Consent</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="rules"
                    checked={agreedToRules}
                    onCheckedChange={(checked) => setAgreedToRules(checked === true)}
                  />
                  <Label htmlFor="rules" className="text-sm leading-relaxed">
                    I have read and agree to follow all assessment rules. I understand that
                    any violation may result in disqualification.
                  </Label>
                </div>
                {assessment.enableWebcam && (
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="webcam"
                      checked={webcamConsent}
                      onCheckedChange={(checked) => setWebcamConsent(checked === true)}
                    />
                    <Label htmlFor="webcam" className="text-sm leading-relaxed">
                      <Camera className="mr-1 inline h-4 w-4" />
                      I consent to webcam proctoring during this assessment.
                    </Label>
                  </div>
                )}
                {assessment.enableTabDetection && (
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="fullscreen"
                      checked={fullscreenConsent}
                      onCheckedChange={(checked) => setFullscreenConsent(checked === true)}
                    />
                    <Label htmlFor="fullscreen" className="text-sm leading-relaxed">
                      <Monitor className="mr-1 inline h-4 w-4" />
                      I consent to full-screen mode and tab-switching detection.
                    </Label>
                  </div>
                )}
                {!assessment.enableWebcam && !assessment.enableTabDetection && (
                  <p className="text-sm text-muted-foreground italic">No additional proctoring consent required.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ready to Begin?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Stable internet connection
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Full-screen browser
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Quiet environment
                  </li>
                </ul>

                <Alert className="bg-primary/5 border-primary/20">
                  <Info className="h-4 w-4 text-primary" />
                  <AlertTitle className="text-primary">Important</AlertTitle>
                  <AlertDescription className="text-xs text-primary/80">
                    Once you start, the timer cannot be paused. Make sure you have enough
                    time to complete the assessment.
                  </AlertDescription>
                </Alert>

                <Button
                  size="lg"
                  className="w-full gap-2 shadow-lg shadow-primary/20"
                  disabled={!agreedToRules || (assessment.enableWebcam && !webcamConsent) || (assessment.enableTabDetection && !fullscreenConsent)}
                  onClick={handleStart}
                >
                  Start Assessment
                  <ArrowRight className="h-4 w-4" />
                </Button>

                {!canStart && (
                  <p className="text-center text-[10px] text-muted-foreground">
                    Please agree to all terms to proceed
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AssessmentStartPage() {
  return (
    <AssessmentStartContent />
  )
}
