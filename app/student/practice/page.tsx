"use client"

import React, { useState } from "react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Filter,
  Code,
  Clock,
  Star,
  Play,
  CheckCircle,
  Target,
  TrendingUp,
} from "lucide-react"

const practiceProblems = [
  {
    id: "1",
    title: "Two Sum",
    description: "Given an array of integers and a target sum, find two numbers that add up to the target.",
    difficulty: "easy",
    category: "arrays",
    points: 10,
    timeLimit: 30,
    attempts: 0,
    solved: false,
    tags: ["array", "hash-table"],
  },
  {
    id: "2",
    title: "Valid Parentheses",
    description: "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    difficulty: "easy",
    category: "strings",
    points: 10,
    timeLimit: 30,
    attempts: 2,
    solved: true,
    tags: ["string", "stack"],
  },
  {
    id: "3",
    title: "Merge Two Sorted Lists",
    description: "Merge two sorted linked lists and return it as a sorted list.",
    difficulty: "easy",
    category: "linked-lists",
    points: 15,
    timeLimit: 45,
    attempts: 1,
    solved: true,
    tags: ["linked-list", "recursion"],
  },
  {
    id: "4",
    title: "Maximum Subarray",
    description: "Given an integer array nums, find the contiguous subarray with the largest sum.",
    difficulty: "medium",
    category: "arrays",
    points: 20,
    timeLimit: 60,
    attempts: 0,
    solved: false,
    tags: ["array", "dynamic-programming"],
  },
  {
    id: "5",
    title: "Climbing Stairs",
    description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps.",
    difficulty: "easy",
    category: "dynamic-programming",
    points: 10,
    timeLimit: 30,
    attempts: 3,
    solved: true,
    tags: ["dynamic-programming", "math"],
  },
  {
    id: "6",
    title: "Binary Tree Inorder Traversal",
    description: "Given the root of a binary tree, return the inorder traversal of its nodes' values.",
    difficulty: "medium",
    category: "trees",
    points: 15,
    timeLimit: 45,
    attempts: 1,
    solved: false,
    tags: ["tree", "depth-first-search"],
  },
  {
    id: "7",
    title: "Valid Palindrome",
    description: "Given a string s, determine if it is a palindrome, considering only alphanumeric characters.",
    difficulty: "easy",
    category: "strings",
    points: 10,
    timeLimit: 30,
    attempts: 0,
    solved: false,
    tags: ["string", "two-pointers"],
  },
  {
    id: "8",
    title: "Reverse Linked List",
    description: "Given the head of a singly linked list, reverse the list.",
    difficulty: "easy",
    category: "linked-lists",
    points: 10,
    timeLimit: 30,
    attempts: 2,
    solved: true,
    tags: ["linked-list", "recursion"],
  },
]

function PracticeContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const filteredProblems = practiceProblems.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
    const matchesDifficulty =
      difficultyFilter === "all" || problem.difficulty === difficultyFilter
    const matchesCategory =
      categoryFilter === "all" || problem.category === categoryFilter
    return matchesSearch && matchesDifficulty && matchesCategory
  })

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

  const solvedCount = practiceProblems.filter(p => p.solved).length
  const totalPoints = practiceProblems.filter(p => p.solved).reduce((acc, p) => acc + p.points, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Practice</h1>
          <p className="text-muted-foreground">
            Sharpen your coding skills with practice problems
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{solvedCount}</p>
                <p className="text-sm text-muted-foreground">Problems Solved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                <Star className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalPoints}</p>
                <p className="text-sm text-muted-foreground">Total Points</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <Target className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {Math.round((solvedCount / practiceProblems.length) * 100)}%
                </p>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-5/10">
                <TrendingUp className="h-6 w-6 text-chart-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">+15</p>
                <p className="text-sm text-muted-foreground">Streak Days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search problems..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Topics</SelectItem>
                  <SelectItem value="arrays">Arrays</SelectItem>
                  <SelectItem value="strings">Strings</SelectItem>
                  <SelectItem value="linked-lists">Linked Lists</SelectItem>
                  <SelectItem value="trees">Trees</SelectItem>
                  <SelectItem value="dynamic-programming">Dynamic Programming</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Problems List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProblems.map((problem) => (
          <Card key={problem.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{problem.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {problem.description}
                  </CardDescription>
                </div>
                {problem.solved && (
                  <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className={getDifficultyColor(problem.difficulty)}>
                  {problem.difficulty}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="h-4 w-4" />
                  {problem.points} pts
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {problem.timeLimit}min
                </span>
                {problem.attempts > 0 && (
                  <span>{problem.attempts} attempts</span>
                )}
              </div>

              <div className="flex flex-wrap gap-1">
                {problem.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <Button className="w-full" asChild>
                <Link href={`/student/practice/${problem.id}`}>
                  <Play className="mr-2 h-4 w-4" />
                  {problem.solved ? "Practice Again" : "Start Problem"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProblems.length === 0 && (
        <div className="text-center py-12">
          <Code className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No problems found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  )
}

export default function PracticePage() {
  return (
    <DashboardLayout>
      <PracticeContent />
    </DashboardLayout>
  )
}