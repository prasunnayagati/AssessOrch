"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, CheckCircle, Circle, Flag } from "lucide-react"

export interface Question {
  id: string
  title: string
  description: string
  difficulty: "easy" | "medium" | "hard"
  points: number
  type?: string
  options?: string[]
  correctOption?: number
  examples?: {
    input: string
    output: string
    explanation?: string
  }[]
  constraints?: string[]
  hints?: string[]
}

interface QuestionPanelProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  isAnswered: boolean
  isFlagged: boolean
  onPrevious?: () => void
  onNext?: () => void
  onFlag?: () => void
  onQuestionSelect?: (index: number) => void
  answeredQuestions: Set<number>
  flaggedQuestions: Set<number>
  onAnswerSelect?: (answer: string) => void
  currentAnswer?: string
}

export function QuestionPanel({
  question,
  questionNumber,
  totalQuestions,
  isAnswered,
  isFlagged,
  onPrevious,
  onNext,
  onFlag,
  onQuestionSelect,
  answeredQuestions,
  flaggedQuestions,
  onAnswerSelect,
  currentAnswer,
}: QuestionPanelProps) {
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

  return (
    <div className="flex h-full flex-col">
      {/* Question Navigation */}
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrevious}
            disabled={questionNumber === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            Question {questionNumber} of {totalQuestions}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onNext}
            disabled={questionNumber === totalQuestions}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getDifficultyColor(question.difficulty)}>
            {question.difficulty}
          </Badge>
          <Badge variant="outline">{question.points} pts</Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={onFlag}
            className={cn(isFlagged && "text-accent")}
          >
            <Flag className={cn("h-4 w-4", isFlagged && "fill-accent")} />
          </Button>
        </div>
      </div>

      {/* Question Navigator */}
      <div className="flex gap-1 overflow-x-auto border-b border-border bg-muted/30 px-4 py-2">
        {Array.from({ length: totalQuestions }).map((_, index) => {
          const qNum = index + 1
          const isAnsweredQ = answeredQuestions.has(qNum)
          const isFlaggedQ = flaggedQuestions.has(qNum)
          const isCurrent = qNum === questionNumber

          return (
            <Button
              key={qNum}
              variant={isCurrent ? "default" : "outline"}
              size="sm"
              className={cn(
                "h-8 w-8 p-0",
                !isCurrent && isAnsweredQ && "border-secondary bg-secondary/10",
                !isCurrent && isFlaggedQ && "border-accent bg-accent/10"
              )}
              onClick={() => onQuestionSelect?.(index)}
            >
              {isAnsweredQ && !isCurrent ? (
                <CheckCircle className="h-4 w-4 text-secondary" />
              ) : isFlaggedQ && !isCurrent ? (
                <Flag className="h-4 w-4 text-accent" />
              ) : (
                qNum
              )}
            </Button>
          )
        })}
      </div>

      {/* Question Content */}
      <ScrollArea className="flex-1">
        <div className="p-6">
          <h2 className="mb-4 text-xl font-semibold text-foreground">{question.title}</h2>

          <div className="prose prose-sm max-w-none text-muted-foreground">
            <p className="whitespace-pre-wrap">{question.description}</p>
          </div>

          {question.type === "multiple-choice" && question.options && (
            <div className="mt-8 space-y-3">
              <h3 className="font-semibold text-foreground">Select one option:</h3>
              <div className="grid gap-3">
                {question.options.map((option, idx) => {
                  const isSelected = currentAnswer === idx.toString()
                  return (
                    <Button
                      key={idx}
                      variant={isSelected ? "default" : "outline"}
                      className={cn(
                        "justify-start h-auto py-4 px-6 text-left whitespace-normal border-2",
                        isSelected ? "border-primary bg-primary/10 text-foreground hover:bg-primary/20" : "hover:border-primary/50"
                      )}
                      onClick={() => onAnswerSelect?.(idx.toString())}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0",
                          isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"
                        )}>
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span className={cn(isSelected && "font-medium")}>{option}</span>
                      </div>
                    </Button>
                  )
                })}
              </div>
            </div>
          )}

          {question.examples && question.examples.length > 0 && (
            <>
              <Separator className="my-6" />
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Examples</h3>
                {question.examples.map((example, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-border bg-muted/30 p-4"
                  >
                    <div className="mb-2">
                      <span className="text-sm font-medium text-foreground">
                        Example {index + 1}:
                      </span>
                    </div>
                    <div className="space-y-2 font-mono text-sm">
                      <div>
                        <span className="text-muted-foreground">Input: </span>
                        <code className="rounded bg-muted px-1.5 py-0.5">{example.input}</code>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Output: </span>
                        <code className="rounded bg-muted px-1.5 py-0.5">{example.output}</code>
                      </div>
                      {example.explanation && (
                        <div className="mt-2 text-muted-foreground">
                          <span className="font-medium">Explanation: </span>
                          {example.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {question.constraints && question.constraints.length > 0 && (
            <>
              <Separator className="my-6" />
              <div>
                <h3 className="mb-3 font-semibold text-foreground">Constraints</h3>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  {question.constraints.map((constraint, index) => (
                    <li key={index}>
                      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                        {constraint}
                      </code>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {question.hints && question.hints.length > 0 && (
            <>
              <Separator className="my-6" />
              <div>
                <h3 className="mb-3 font-semibold text-foreground">Hints</h3>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  {question.hints.map((hint, index) => (
                    <li key={index}>{hint}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </ScrollArea>

      {/* Question Status */}
      <div className="flex items-center justify-between border-t border-border bg-muted/30 px-4 py-2">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-secondary" />
            {answeredQuestions.size} answered
          </span>
          <span className="flex items-center gap-1">
            <Flag className="h-3 w-3 text-accent" />
            {flaggedQuestions.size} flagged
          </span>
          <span className="flex items-center gap-1">
            <Circle className="h-3 w-3" />
            {totalQuestions - answeredQuestions.size} remaining
          </span>
        </div>
      </div>
    </div>
  )
}
