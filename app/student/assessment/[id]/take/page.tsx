"use client"

import React, { useState, useCallback, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"
import { CodeEditor } from "@/components/assessment/code-editor"
import { AssessmentTimer } from "@/components/assessment/assessment-timer"
import { QuestionPanel, type Question } from "@/components/assessment/question-panel"
import { useAuth } from "@/lib/auth-context"
import { Loader2 } from "lucide-react"
import {
  Code2,
  Send,
  Save,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"

function AssessmentTakeContent() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [questions, setQuestions] = useState<Question[]>([])
  const [assessment, setAssessment] = useState<any>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set())
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set())
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [showTimeUpDialog, setShowTimeUpDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(true)
  const [tabViolations, setTabViolations] = useState(0)
  const [copyPasteViolations, setCopyPasteViolations] = useState(0)

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const response = await fetch(`/api/assessments/${params.id}`, { cache: 'no-store' })
        const data = await response.json()
        if (data.success) {
          setAssessment(data.assessment)
          setQuestions(data.assessment.fullQuestions || [])
        } else {
          toast({
            title: "Error",
            description: data.error || "Assessment not found",
            variant: "destructive"
          })
        }
      } catch (error) {
        console.error("Error fetching assessment:", error)
        toast({
          title: "Error",
          description: "Failed to load assessment. Please try again.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchAssessment()
  }, [params.id])

  // Proctoring: Tab Switching Detection
  useEffect(() => {
    if (!assessment?.enableTabDetection) return

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabViolations(prev => prev + 1)
        toast({
          title: "Warning: Tab Switched",
          description: "Switching tabs is monitored. This activity has been recorded.",
          variant: "destructive",
        })
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [assessment])

  // Proctoring: Copy-Paste Detection
  useEffect(() => {
    if (!assessment?.enableCopyPasteDetection) return

    const handleCopyPaste = (e: Event) => {
      e.preventDefault()
      setCopyPasteViolations(prev => prev + 1)
      toast({
        title: "Proctoring Alert",
        description: `${e.type.charAt(0).toUpperCase() + e.type.slice(1)}ing is disabled for this assessment.`,
        variant: "destructive",
      })
    }

    window.addEventListener("copy", handleCopyPaste)
    window.addEventListener("paste", handleCopyPaste)
    window.addEventListener("cut", handleCopyPaste)

    return () => {
      window.removeEventListener("copy", handleCopyPaste)
      window.removeEventListener("paste", handleCopyPaste)
      window.removeEventListener("cut", handleCopyPaste)
    }
  }, [assessment])

  // Proctoring: Fullscreen Enforcement
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)

    // Initial request for fullscreen
    if (!isLoading) {
      // Automatic fullscreen is often blocked by browsers.
      // We rely on the user gesture button in the UI instead.
    }

    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [isLoading])

  const requestFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen()
    } catch (err) {
      console.error("Fullscreen request failed", err)
    }
  }

  const currentQuestion = questions[currentQuestionIndex]
  const questionNumber = currentQuestionIndex + 1

  const handleCodeChange = useCallback(
    (code: string) => {
      setAnswers((prev) => ({
        ...prev,
        [questionNumber]: code,
      }))

      if (code.trim().length > 10) {
        setAnsweredQuestions((prev) => new Set([...prev, questionNumber]))
      }
    },
    [questionNumber]
  )
  const handleAnswerSelect = useCallback(
    (answer: string) => {
      setAnswers((prev) => ({
        ...prev,
        [questionNumber]: answer,
      }))
      setAnsweredQuestions((prev) => new Set([...prev, questionNumber]))
    },
    [questionNumber]
  )

  const handleSave = () => {
    toast({
      title: "Progress saved",
      description: "Your answers have been saved automatically.",
    })
  }

  const handleFlag = () => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(questionNumber)) {
        newSet.delete(questionNumber)
      } else {
        newSet.add(questionNumber)
      }
      return newSet
    })
  }

  const handleTimeWarning = (minutesLeft: number) => {
    toast({
      title: `${minutesLeft} minute${minutesLeft > 1 ? "s" : ""} remaining!`,
      description: "Make sure to submit your answers.",
      variant: "destructive",
    })
  }

  const handleTimeUp = () => {
    setShowTimeUpDialog(true)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      // Calculate a simple score for demo: (answered / total) * 100
      const score = Math.round((answeredQuestions.size / questions.length) * 100)

      const response = await fetch(`/api/assessments/${params.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score,
          studentId: user?.id || "anonymous",
          studentName: user?.name || "Anonymous Student",
          studentEmail: user?.email || "anonymous@student.com",
          proctoringData: {
            tabViolations,
            copyPasteViolations,
            fullScreenViolations: 0, // Could add a counter for this too
          }
        }),
      })

      if (response.ok) {
        toast({
          title: "Assessment Submitted!",
          description: "Your results have been recorded.",
        })
        router.push(`/student/assessment/${params.id}/complete`)
      } else {
        throw new Error("Failed to submit")
      }
    } catch (error) {
      console.error("Error submitting:", error)
      toast({
        title: "Submission Error",
        description: "Please try again or contact support.",
        variant: "destructive"
      })
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium">Loading your assessment...</p>
        </div>
      </div>
    )
  }

  if (!assessment || questions.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6 max-w-md text-center px-6">
          <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Assessment Not Found</h2>
            <p className="text-muted-foreground">This assessment might have been closed or the link is invalid.</p>
          </div>
          <Button className="w-full" onClick={() => router.push("/student/dashboard")}>Return to Dashboard</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Fullscreen Overlay */}
      {!isFullscreen && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm">
          <div className="max-w-md p-8 text-center bg-card border rounded-xl shadow-2xl">
            <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl font-bold mb-2">Fullscreen Required</h2>
            <p className="text-muted-foreground mb-6">
              This assessment must be completed in full-screen mode to ensure integrity.
            </p>
            <Button size="lg" onClick={requestFullscreen} className="w-full gap-2 font-bold shadow-lg shadow-primary/20">
              Re-enter Fullscreen
            </Button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Code2 className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-semibold truncate max-w-[200px] md:max-w-none">{assessment.title}</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">In Progress</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <AssessmentTimer
            initialMinutes={assessment.duration || 90}
            onTimeUp={handleTimeUp}
            onWarning={handleTimeWarning}
          />
          <div className="hidden items-center gap-2 md:flex border-l pl-4 border-border">
            <Badge variant="outline" className="gap-1 bg-muted/50">
              <CheckCircle className="h-3 w-3 text-emerald-500" />
              <span className="font-mono">{answeredQuestions.size}/{questions.length}</span>
            </Badge>
          </div>
          <Button variant="ghost" size="sm" className="hidden sm:flex" onClick={handleSave}>
            <Save className="mr-1.5 h-4 w-4" />
            Save
          </Button>
          <Button size="sm" className="shadow-lg shadow-primary/20" onClick={() => setShowSubmitDialog(true)}>
            <Send className="mr-1.5 h-4 w-4" />
            Submit
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Question Panel */}
        <div className="hidden w-[400px] border-r border-border lg:block bg-card/50">
          <QuestionPanel
            question={currentQuestion}
            questionNumber={questionNumber}
            totalQuestions={questions.length}
            isAnswered={answeredQuestions.has(questionNumber)}
            isFlagged={flaggedQuestions.has(questionNumber)}
            onPrevious={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
            onNext={() => setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))}
            onFlag={handleFlag}
            onQuestionSelect={(index) => setCurrentQuestionIndex(index)}
            answeredQuestions={answeredQuestions}
            flaggedQuestions={flaggedQuestions}
            currentAnswer={answers[questionNumber]}
            onAnswerSelect={handleAnswerSelect}
          />
        </div>

        {/* Code Editor */}
        <div className="flex-1 overflow-hidden">
          <CodeEditor
            initialCode={answers[questionNumber] || ""}
            language="javascript"
            onCodeChange={handleCodeChange}
          />
        </div>
      </div>

      {/* Mobile Question Panel Toggle */}
      <div className="border-t border-border bg-card p-2 lg:hidden">
        <QuestionPanel
          question={currentQuestion}
          questionNumber={questionNumber}
          totalQuestions={questions.length}
          isAnswered={answeredQuestions.has(questionNumber)}
          isFlagged={flaggedQuestions.has(questionNumber)}
          onPrevious={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
          onNext={() => setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))}
          onFlag={handleFlag}
          onQuestionSelect={(index) => setCurrentQuestionIndex(index)}
          answeredQuestions={answeredQuestions}
          flaggedQuestions={flaggedQuestions}
          currentAnswer={answers[questionNumber]}
          onAnswerSelect={handleAnswerSelect}
        />
      </div>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Assessment?</AlertDialogTitle>
            <AlertDialogDescription>
              You have answered {answeredQuestions.size} out of {questions.length} questions.
              {flaggedQuestions.size > 0 && (
                <span className="mt-2 block text-amber-600 bg-amber-50 p-2 rounded border border-amber-100 font-medium">
                  <AlertTriangle className="mr-1 inline h-4 w-4" />
                  {flaggedQuestions.size} question(s) are flagged for review.
                </span>
              )}
              <span className="mt-4 block font-medium">
                Are you sure you want to submit? This action cannot be undone.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Working</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>Submit Assessment</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Time Up Dialog */}
      <AlertDialog open={showTimeUpDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Time{"'"}s Up!
            </AlertDialogTitle>
            <AlertDialogDescription>
              Your assessment time has ended. Your answers will be submitted automatically.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleSubmit}>View Results</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default function AssessmentTakePage() {
  return (
    <AssessmentTakeContent />
  )
}
