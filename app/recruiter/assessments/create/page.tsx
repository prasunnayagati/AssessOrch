"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  FileText,
  Settings,
  Shield,
  Plus,
  Trash2,
  GripVertical,
  Code,
  Save,
  Sparkles,
  Loader2,
  Wand2,
  CheckCircle2,
  AlertCircle,
  Database,
} from "lucide-react"

interface GeneratedQuestion {
  id: string
  title: string
  description: string
  difficulty: "easy" | "medium" | "hard"
  points: number
  type: "coding" | "system-design" | "multiple-choice"
  timeEstimate: number
  hints: string[]
  testCases: Array<{
    input: string
    expectedOutput: string
    isHidden: boolean
  }>
  starterCode: {
    javascript: string
    python: string
    java: string
  }
  solution: string
  tags: string[]
}

interface QuestionItem {
  id: string
  title: string
  difficulty: string
  points: number
  type: string
  isAIGenerated?: boolean
  options?: string[]
  correctOption?: number
}

interface QuestionBank {
  id: string
  name: string
  description: string
  category: string
  status: string
}

// Local questions are now served via the /api/questions auto-seeder


function CreateAssessmentContent() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: 90,
    passingScore: 70,
    difficulty: "intermediate",
    skills: [] as string[],
    questions: [] as string[],
    enableProctoring: true,
    enableWebcam: true,
    enableTabDetection: true,
    enableCopyPasteDetection: true,
    shuffleQuestions: false,
    showResults: true,
    deadline: "",
  })

  const [newSkill, setNewSkill] = useState("")
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([])
  const [selectedGenerated, setSelectedGenerated] = useState<string[]>([])
  const [aiConfig, setAiConfig] = useState({
    topic: "",
    questionCount: 5,
    difficulty: "mixed",
    questionType: "coding",
    selectedBankId: "none",
  })
  const [availableBanks, setAvailableBanks] = useState<QuestionBank[]>([])
  const [dynamicQuestionBank, setDynamicQuestionBank] = useState<QuestionItem[]>([])
  const [persistedGeneratedQuestions, setPersistedGeneratedQuestions] = useState<QuestionItem[]>([])

  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false)
  const [customQuestion, setCustomQuestion] = useState<Omit<QuestionItem, "id">>({
    title: "",
    difficulty: "easy",
    points: 10,
    type: "coding",
    options: ["", "", "", ""],
    correctOption: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Question Banks
        const banksRes = await fetch("/api/question-banks")
        const banksData = await banksRes.json()
        if (banksData.success) {
          setAvailableBanks(banksData.questionBanks)
        }

        // Fetch Dynamic Questions
        const questionsRes = await fetch("/api/questions")
        const questionsData = await questionsRes.json()
        if (questionsData.success) {
          setDynamicQuestionBank(questionsData.questions)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchData()
  }, [])



  const addSkill = () => {
    if (newSkill && !formData.skills.includes(newSkill)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill],
      }))
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }))
  }

  const toggleQuestion = (questionId: string) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.includes(questionId)
        ? prev.questions.filter((q) => q !== questionId)
        : [...prev.questions, questionId],
    }))
  }

  const generateQuestionsWithAI = async () => {
    if (!aiConfig.topic) {
      toast({
        title: "Topic required",
        description: "Please enter a topic for question generation",
        variant: "destructive",
      })
      return
    }

    if (formData.skills.length === 0) {
      toast({
        title: "Skills required",
        description: "Please add at least one skill in Basic Info step first",
        variant: "destructive",
      })
      return
    }

    const selectedBank = availableBanks.find(b => b.id === aiConfig.selectedBankId)

    try {
      const response = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: aiConfig.topic,
          difficulty: aiConfig.difficulty,
          count: aiConfig.questionCount,
          skills: formData.skills,
          questionType: aiConfig.questionType,
          bankContext: selectedBank ? {
            name: selectedBank.name,
            description: selectedBank.description
          } : null
        }),
      })

      const data = await response.json()

      if (data.success && data.questions) {
        const questionsWithIds = data.questions.map(
          (q: Omit<GeneratedQuestion, "id">, index: number) => ({
            ...q,
            id: `ai-${Date.now()}-${index}`,
          })
        )
        setGeneratedQuestions(questionsWithIds)
        setSelectedGenerated(questionsWithIds.map((q: GeneratedQuestion) => q.id))
        toast({
          title: "Questions generated",
          description: `Generated ${questionsWithIds.length} questions successfully!`,
        })
      } else {
        toast({
          title: "Generation failed",
          description: data.error || "Failed to generate questions",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error generating questions:", error)
      toast({
        title: "Error",
        description: "Failed to generate questions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }


  const toggleGeneratedQuestion = (id: string) => {
    setSelectedGenerated((prev) =>
      prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]
    )
  }

  const addGeneratedQuestionsToAssessment = () => {
    const selectedQuestions = generatedQuestions.filter((q) =>
      selectedGenerated.includes(q.id)
    ).map(q => ({
      id: q.id,
      title: q.title,
      difficulty: q.difficulty,
      points: q.points,
      type: q.type,
      isAIGenerated: true,
      options: (q as any).options,
      correctOption: (q as any).correctOption
    }))

    // Persist these questions in the local pool so they don't disappear
    setPersistedGeneratedQuestions(prev => [...prev, ...selectedQuestions])

    // Select them in the form
    const newQuestionIds = selectedQuestions.map((q) => q.id)
    setFormData((prev) => ({
      ...prev,
      questions: [...prev.questions, ...newQuestionIds],
    }))

    toast({
      title: "Questions added",
      description: `Added ${selectedQuestions.length} AI-generated questions to the assessment`
    })
    setIsAIDialogOpen(false)
    setGeneratedQuestions([])
    setSelectedGenerated([])
  }

  const handleCreateCustomQuestion = () => {
    if (!customQuestion.title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a question title",
        variant: "destructive",
      })
      return
    }

    if (customQuestion.type === "multiple-choice") {
      if (!customQuestion.options || customQuestion.options.some(opt => !opt.trim())) {
        toast({
          title: "Options required",
          description: "Please fill in all options for the multiple-choice question",
          variant: "destructive",
        })
        return
      }
    }

    const newId = `custom-${Date.now()}`
    const newQuestion: QuestionItem = {
      ...customQuestion,
      id: newId,
    }

    // Add to persisted pool
    setPersistedGeneratedQuestions(prev => [...prev, newQuestion])

    // Auto-select it
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newId]
    }))

    toast({
      title: "Question Created",
      description: "Custom question has been added to the assessment.",
    })

    // Reset and close
    setCustomQuestion({
      title: "",
      difficulty: "easy",
      points: 10,
      type: "coding",
      options: ["", "", "", ""],
      correctOption: 0,
    })
    setIsCustomDialogOpen(false)
  }



  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    // Auto-add skill if user typed something but didn't click Plus
    if (newSkill.trim()) {
      addSkill()
    }

    // Validate required fields
    if (!formData.title.trim()) {
      toast({ title: "Title required", description: "Please enter an title", variant: "destructive" })
      return
    }

    if (formData.questions.length === 0) {
      toast({ title: "Questions required", description: "Please select at least one question", variant: "destructive" })
      return
    }

    setIsSaving(true)
    try {
      // 1. Sync ALL questions that might be new or custom to the server
      const questionsToSync = allQuestions.filter(q =>
        persistedGeneratedQuestions.some(pg => pg.id === q.id) || q.id.startsWith("custom-") || q.id.startsWith("ai-")
      )

      if (questionsToSync.length > 0) {
        await fetch("/api/questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questions: questionsToSync }),
        })
      }

      // 2. Create the assessment with fallback for optional fields
      const finalFormData = {
        ...formData,
        description: formData.description || "No description provided",
        skills: formData.skills.length > 0 ? formData.skills : ["General"]
      }

      const response = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalFormData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Assessment Published!",
          description: "Your assessment is now live and stored in Firestore.",
        })
        router.push("/recruiter/assessments")
      } else {
        throw new Error(data.error || "Failed to publish")
      }
    } catch (error: any) {
      console.error("Error creating assessment:", error)
      toast({
        title: "Publishing Failed",
        description: error.message || "Failed to create assessment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleNext = () => {
    if (step === 1) {
      // Auto-add skill if user typed but didn't click plus
      if (newSkill.trim()) {
        const skillToAdd = newSkill.trim()
        if (!formData.skills.includes(skillToAdd)) {
          setFormData(prev => ({ ...prev, skills: [...prev.skills, skillToAdd] }))
          setNewSkill("")
        }
      }

      if (!formData.title.trim()) {
        toast({ title: "Title required", description: "Please enter a title", variant: "destructive" })
        return
      }
      if (!formData.description.trim()) {
        toast({ title: "Description required", description: "Please enter a description", variant: "destructive" })
        return
      }
    } else if (step === 2) {
      if (formData.questions.length === 0) {
        toast({ title: "Questions required", description: "Please select at least one question", variant: "destructive" })
        return
      }
    }
    setStep((prev) => Math.min(3, prev + 1))
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

  const allQuestions: QuestionItem[] = [
    ...dynamicQuestionBank,
    ...persistedGeneratedQuestions,
    ...generatedQuestions.map((q) => ({
      id: q.id,
      title: q.title,
      difficulty: q.difficulty,
      points: q.points,
      type: q.type,
      isAIGenerated: true,
    })),
  ]


  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Create Assessment
          </h1>
          <p className="text-muted-foreground">
            Set up a new coding assessment for candidates
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${step >= s
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
                }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={`h-1 w-16 rounded ${step > s ? "bg-primary" : "bg-muted"}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-center gap-8 text-sm text-muted-foreground">
        <span className={step >= 1 ? "text-foreground" : ""}>Basic Info</span>
        <span className={step >= 2 ? "text-foreground" : ""}>Questions</span>
        <span className={step >= 3 ? "text-foreground" : ""}>Settings</span>
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Provide details about your assessment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Assessment Title</Label>
              <Input
                id="title"
                placeholder="e.g., Frontend Developer Assessment"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this assessment covers..."
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={4}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      duration: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passingScore">Passing Score (%)</Label>
                <Input
                  id="passingScore"
                  type="number"
                  value={formData.passingScore}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      passingScore: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(v) =>
                  setFormData((prev) => ({ ...prev, difficulty: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Skills Tested</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill (e.g., React)"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addSkill())
                  }
                />
                <Button type="button" onClick={addSkill}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill) => (
                  <Badge key={skill} variant="outline" className="gap-1">
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-1 rounded-full hover:bg-muted"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline (optional)</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, deadline: e.target.value }))
                }
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Questions */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" />
                  Select Questions
                </CardTitle>
                <CardDescription>
                  Choose questions from the question bank ({formData.questions.length}{" "}
                  selected)
                </CardDescription>
              </div>
              <Dialog open={isAIDialogOpen} onOpenChange={setIsAIDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    Generate with AI
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Wand2 className="h-5 w-5 text-primary" />
                      AI Question Generator
                    </DialogTitle>
                    <DialogDescription>
                      Automatically generate coding questions based on your requirements
                    </DialogDescription>
                  </DialogHeader>

                  {generatedQuestions.length === 0 ? (
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="ai-topic">Focus / Role</Label>
                        <Input
                          id="ai-topic"
                          placeholder="e.g., Senior React Developer"
                          value={aiConfig.topic}
                          onChange={(e) =>
                            setAiConfig((prev) => ({ ...prev, topic: e.target.value }))
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Source Question Bank (Optional)</Label>
                        <Select
                          value={aiConfig.selectedBankId}
                          onValueChange={(v) =>
                            setAiConfig((prev) => ({ ...prev, selectedBankId: v }))
                          }
                        >
                          <SelectTrigger>
                            <div className="flex items-center gap-2">
                              <Database className="h-4 w-4 text-muted-foreground" />
                              <SelectValue placeholder="Select a bank to use as context" />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">General AI Knowledge (None)</SelectItem>
                            {availableBanks.map((bank) => (
                              <SelectItem key={bank.id} value={bank.id}>
                                {bank.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-[10px] text-muted-foreground">
                          Selecting a bank helps AI generate questions specific to your uploaded documents.
                        </p>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-2">
                          <Label>Number of Questions</Label>
                          <Select
                            value={aiConfig.questionCount.toString()}
                            onValueChange={(v) =>
                              setAiConfig((prev) => ({
                                ...prev,
                                questionCount: parseInt(v),
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3">3 Questions</SelectItem>
                              <SelectItem value="5">5 Questions</SelectItem>
                              <SelectItem value="7">7 Questions</SelectItem>
                              <SelectItem value="10">10 Questions</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Difficulty</Label>
                          <Select
                            value={aiConfig.difficulty}
                            onValueChange={(v) =>
                              setAiConfig((prev) => ({ ...prev, difficulty: v }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="easy">Easy Only</SelectItem>
                              <SelectItem value="medium">Medium Only</SelectItem>
                              <SelectItem value="hard">Hard Only</SelectItem>
                              <SelectItem value="mixed">Mixed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Question Type</Label>
                          <Select
                            value={aiConfig.questionType}
                            onValueChange={(v) =>
                              setAiConfig((prev) => ({ ...prev, questionType: v }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="coding">Coding Challenges</SelectItem>
                              <SelectItem value="system-design">System Design</SelectItem>
                              <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {formData.skills.length > 0 && (
                        <div className="rounded-lg border border-border bg-muted/50 p-3">
                          <p className="text-sm text-muted-foreground mb-2">
                            Questions will be generated for these skills:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {formData.skills.map((skill) => (
                              <Badge key={skill} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {formData.skills.length === 0 && (
                        <div className="flex items-center gap-2 rounded-lg border border-accent bg-accent/10 p-3 text-sm">
                          <AlertCircle className="h-4 w-4 text-accent" />
                          <span>
                            Add skills in the Basic Info step for better question generation
                          </span>
                        </div>
                      )}

                      <Button
                        onClick={generateQuestionsWithAI}
                        disabled={isGenerating || !aiConfig.topic}
                        className="w-full gap-2"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Generating Questions...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4" />
                            Generate Questions
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4 py-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          {selectedGenerated.length} of {generatedQuestions.length} questions
                          selected
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setGeneratedQuestions([])
                            setSelectedGenerated([])
                          }}
                        >
                          Generate New
                        </Button>
                      </div>

                      <div className="space-y-3 max-h-[40vh] overflow-y-auto">
                        {generatedQuestions.map((question) => (
                          <div
                            key={question.id}
                            className={`rounded-lg border p-4 transition-colors cursor-pointer ${selectedGenerated.includes(question.id)
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                              }`}
                            onClick={() => toggleGeneratedQuestion(question.id)}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-3">
                                <Checkbox
                                  checked={selectedGenerated.includes(question.id)}
                                  onCheckedChange={() =>
                                    toggleGeneratedQuestion(question.id)
                                  }
                                />
                                <div className="space-y-1">
                                  <p className="font-medium">{question.title}</p>
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {question.description}
                                  </p>
                                  <div className="flex flex-wrap gap-1.5 mt-2">
                                    {question.tags.slice(0, 3).map((tag) => (
                                      <Badge
                                        key={tag}
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Badge className={getDifficultyColor(question.difficulty)}>
                                  {question.difficulty}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {question.points} pts
                                </span>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {question.timeEstimate} min
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsAIDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={addGeneratedQuestionsToAssessment}
                          disabled={selectedGenerated.length === 0}
                          className="gap-2"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Add {selectedGenerated.length} Questions
                        </Button>
                      </DialogFooter>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {allQuestions.map((question) => (
                <div
                  key={question.id}
                  className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${formData.questions.includes(question.id)
                    ? "border-primary bg-primary/5"
                    : "border-border"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <Checkbox
                      checked={formData.questions.includes(question.id)}
                      onCheckedChange={() => toggleQuestion(question.id)}
                    />
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{question.title}</p>
                        {question.isAIGenerated && (
                          <Badge
                            variant="outline"
                            className="gap-1 text-xs border-primary/50 text-primary"
                          >
                            <Sparkles className="h-3 w-3" />
                            AI
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {question.type === "coding"
                          ? "Coding Challenge"
                          : question.type === "system-design"
                            ? "System Design"
                            : "Multiple Choice"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getDifficultyColor(question.difficulty)}>
                      {question.difficulty}
                    </Badge>
                    <Badge variant="outline">{question.points} pts</Badge>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between rounded-lg bg-muted p-4">
              <span className="text-sm text-muted-foreground">
                Total Points:{" "}
                {allQuestions
                  .filter((q) => formData.questions.includes(q.id))
                  .reduce((acc, q) => acc + (q.points as number), 0)}
              </span>
              <Dialog open={isCustomDialogOpen} onOpenChange={setIsCustomDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Custom Question
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create Custom Question</DialogTitle>
                    <DialogDescription>
                      Manually add a question to this assessment.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="q-title">Question Title</Label>
                      <Input
                        id="q-title"
                        placeholder="e.g., Explain the event loop in JavaScript"
                        value={customQuestion.title}
                        onChange={(e) => setCustomQuestion({ ...customQuestion, title: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Select
                          value={customQuestion.type}
                          onValueChange={(v) => setCustomQuestion({ ...customQuestion, type: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="coding">Coding</SelectItem>
                            <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                            <SelectItem value="system-design">System Design</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Difficulty</Label>
                        <Select
                          value={customQuestion.difficulty}
                          onValueChange={(v) => setCustomQuestion({ ...customQuestion, difficulty: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="q-points">Points</Label>
                      <Input
                        id="q-points"
                        type="number"
                        value={customQuestion.points}
                        onChange={(e) => setCustomQuestion({ ...customQuestion, points: parseInt(e.target.value) || 0 })}
                      />
                    </div>

                    {customQuestion.type === "multiple-choice" && (
                      <div className="space-y-3 border-t pt-4">
                        <Label>Options & Correct Answer</Label>
                        {(customQuestion.options || ["", "", "", ""]).map((option, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <Checkbox
                              checked={customQuestion.correctOption === idx}
                              onCheckedChange={() => setCustomQuestion({ ...customQuestion, correctOption: idx })}
                              className="rounded-full"
                            />
                            <Input
                              placeholder={`Option ${idx + 1}`}
                              value={option}
                              onChange={(e) => {
                                const newOpts = [...(customQuestion.options || [])]
                                newOpts[idx] = e.target.value
                                setCustomQuestion({ ...customQuestion, options: newOpts })
                              }}
                            />
                          </div>
                        ))}
                        <p className="text-[10px] text-muted-foreground italic">
                          Mark the checkbox next to the correct answer.
                        </p>
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCustomDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateCustomQuestion}>Add Question</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Settings */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Assessment Settings
            </CardTitle>
            <CardDescription>
              Configure proctoring and other settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="mb-4 font-medium">Proctoring Options</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Proctoring</p>
                    <p className="text-sm text-muted-foreground">
                      Monitor candidate activity during the assessment
                    </p>
                  </div>
                  <Switch
                    checked={formData.enableProctoring}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        enableProctoring: checked,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Webcam Monitoring</p>
                    <p className="text-sm text-muted-foreground">
                      Record candidate via webcam
                    </p>
                  </div>
                  <Switch
                    checked={formData.enableWebcam}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, enableWebcam: checked }))
                    }
                    disabled={!formData.enableProctoring}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Tab Switch Detection</p>
                    <p className="text-sm text-muted-foreground">
                      Detect when candidate switches browser tabs
                    </p>
                  </div>
                  <Switch
                    checked={formData.enableTabDetection}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        enableTabDetection: checked,
                      }))
                    }
                    disabled={!formData.enableProctoring}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Copy-Paste Detection</p>
                    <p className="text-sm text-muted-foreground">
                      Monitor clipboard activity
                    </p>
                  </div>
                  <Switch
                    checked={formData.enableCopyPasteDetection}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        enableCopyPasteDetection: checked,
                      }))
                    }
                    disabled={!formData.enableProctoring}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="mb-4 font-medium">Assessment Options</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Shuffle Questions</p>
                    <p className="text-sm text-muted-foreground">
                      Randomize question order for each candidate
                    </p>
                  </div>
                  <Switch
                    checked={formData.shuffleQuestions}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        shuffleQuestions: checked,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Results Immediately</p>
                    <p className="text-sm text-muted-foreground">
                      Display score to candidates after completion
                    </p>
                  </div>
                  <Switch
                    checked={formData.showResults}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, showResults: checked }))
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setStep((prev) => Math.max(1, prev - 1))}
          disabled={step === 1}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        {step < 3 ? (
          <Button onClick={handleNext}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Create Assessment
          </Button>
        )}
      </div>
    </div>
  )
}

export default function CreateAssessmentPage() {
  return (
    <DashboardLayout>
      <CreateAssessmentContent />
    </DashboardLayout>
  )
}
