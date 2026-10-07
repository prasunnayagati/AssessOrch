"use client"

import React, { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Clock,
  Play,
  RotateCcw,
  CheckCircle,
  XCircle,
  Code,
  TestTube,
  BookOpen,
  ArrowLeft,
  Trophy,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

// Mock problem data - in a real app, this would come from an API
const getProblemById = (id: string) => {
  const problems = [
    {
      id: "1",
      title: "Two Sum",
      description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
      difficulty: "easy",
      points: 10,
      timeLimit: 30,
      examples: [
        {
          input: "nums = [2,7,11,15], target = 9",
          output: "[0,1]",
          explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
        },
        {
          input: "nums = [3,2,4], target = 6",
          output: "[1,2]",
          explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
        }
      ],
      constraints: [
        "2 <= nums.length <= 10^4",
        "-10^9 <= nums[i] <= 10^9",
        "-10^9 <= target <= 10^9",
        "Only one valid answer exists."
      ],
      starterCode: {
        javascript: `function twoSum(nums, target) {
    // Your code here
    
}`,
        python: `def two_sum(nums, target):
    # Your code here
    pass`,
        java: `public int[] twoSum(int[] nums, int target) {
    // Your code here
    
}`
      },
      testCases: [
        { input: "[2,7,11,15], 9", expected: "[0,1]", hidden: false },
        { input: "[3,2,4], 6", expected: "[1,2]", hidden: false },
        { input: "[3,3], 6", expected: "[0,1]", hidden: true }
      ]
    }
  ]

  return problems.find(p => p.id === id) || null
}

function PracticeProblemContent() {
  const params = useParams()
  const router = useRouter()
  const problemId = params.id as string

  const problem = getProblemById(problemId)

  const [selectedLanguage, setSelectedLanguage] = useState("javascript")
  const [code, setCode] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [testResults, setTestResults] = useState<any[]>([])
  const [timeElapsed, setTimeElapsed] = useState(0)

  // Initialize code when problem or language changes
  React.useEffect(() => {
    if (problem) {
      setCode(problem.starterCode[selectedLanguage as keyof typeof problem.starterCode])
    }
  }, [problem, selectedLanguage])

  // Timer effect
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!problem) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <XCircle className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">Problem not found</h3>
          <p className="text-muted-foreground">The practice problem you're looking for doesn't exist.</p>
          <Button className="mt-4" onClick={() => router.push("/student/practice")}>
            Back to Practice
          </Button>
        </div>
      </div>
    )
  }

  const runTests = async () => {
    setIsRunning(true)
    // Simulate running tests
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Mock test results
    const results = problem.testCases.map((testCase, index) => ({
      id: index,
      input: testCase.input,
      expected: testCase.expected,
      actual: testCase.hidden ? "Hidden" : testCase.expected, // Mock passing tests
      passed: !testCase.hidden,
      hidden: testCase.hidden
    }))

    setTestResults(results)
    setIsRunning(false)

    const passedTests = results.filter(r => r.passed).length
    toast({
      title: `Tests completed`,
      description: `${passedTests}/${results.length} tests passed`,
      variant: passedTests === results.length ? "default" : "destructive",
    })
  }

  const submitSolution = async () => {
    setIsSubmitting(true)
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Mock successful submission
    toast({
      title: "Solution submitted!",
      description: "Your solution has been accepted. Great job!",
    })

    setIsSubmitting(false)
    router.push("/student/practice")
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-secondary/10 text-secondary border-secondary/20"
      case "medium":
        return "bg-accent/10 text-accent border-accent/20"
      case "hard":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push("/student/practice")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Practice
        </Button>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{problem.title}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getDifficultyColor(problem.difficulty)}>
                  {problem.difficulty}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {problem.points} points
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatTime(timeElapsed)}
              </div>
              <div className="flex items-center gap-1">
                <Trophy className="h-4 w-4" />
                {problem.timeLimit}min limit
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Problem Description */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Problem Description
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-line">{problem.description}</p>
              </div>

              {/* Examples */}
              <div className="space-y-3">
                <h4 className="font-medium">Examples:</h4>
                {problem.examples.map((example, index) => (
                  <div key={index} className="rounded-lg border p-3 bg-muted/50">
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Input:</span>
                        <code className="ml-2 text-sm bg-background px-2 py-1 rounded">
                          {example.input}
                        </code>
                      </div>
                      <div>
                        <span className="font-medium">Output:</span>
                        <code className="ml-2 text-sm bg-background px-2 py-1 rounded">
                          {example.output}
                        </code>
                      </div>
                      <div>
                        <span className="font-medium">Explanation:</span>
                        <span className="ml-2 text-sm">{example.explanation}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Constraints */}
              <div>
                <h4 className="font-medium mb-2">Constraints:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {problem.constraints.map((constraint, index) => (
                    <li key={index}>{constraint}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Code Editor */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" />
                  Code Editor
                </CardTitle>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Write your solution here..."
                className="min-h-[300px] font-mono text-sm"
              />
            </CardContent>
          </Card>

          {/* Test Results */}
          {testResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="h-5 w-5 text-primary" />
                  Test Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {testResults.map((result) => (
                    <div
                      key={result.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        result.passed
                          ? "border-secondary bg-secondary/5"
                          : "border-destructive bg-destructive/5"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {result.passed ? (
                          <CheckCircle className="h-5 w-5 text-secondary" />
                        ) : (
                          <XCircle className="h-5 w-5 text-destructive" />
                        )}
                        <div>
                          <p className="font-medium text-sm">
                            Test Case {result.id + 1}
                            {result.hidden && " (Hidden)"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Input: {result.input}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          Expected: {result.expected}
                        </p>
                        {!result.hidden && (
                          <p className="text-xs text-muted-foreground">
                            Got: {result.actual}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={runTests}
              disabled={isRunning || isSubmitting}
              variant="outline"
              className="flex-1"
            >
              {isRunning ? (
                <>
                  <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                  Running Tests...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Run Tests
                </>
              )}
            </Button>
            <Button
              onClick={submitSolution}
              disabled={isRunning || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Submit Solution
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PracticeProblemPage() {
  return (
    <DashboardLayout>
      <PracticeProblemContent />
    </DashboardLayout>
  )
}