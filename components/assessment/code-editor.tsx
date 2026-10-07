"use client"

import React, { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Play,
  RotateCcw,
  Copy,
  Check,
  Terminal,
  FileCode,
  Loader2,
} from "lucide-react"

interface CodeEditorProps {
  initialCode?: string
  language?: string
  onCodeChange?: (code: string) => void
  onRun?: (code: string, language: string) => Promise<{ output: string; error?: string }>
  readOnly?: boolean
}

const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "typescript", label: "TypeScript" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
]

const defaultCode: Record<string, string> = {
  javascript: `// Write your solution here
function solution(input) {
  // Your code here
  return input;
}

// Test your code
console.log(solution("Hello, World!"));`,
  python: `# Write your solution here
def solution(input):
    # Your code here
    return input

# Test your code
print(solution("Hello, World!"))`,
  typescript: `// Write your solution here
function solution(input: string): string {
  // Your code here
  return input;
}

// Test your code
console.log(solution("Hello, World!"));`,
  java: `// Write your solution here
public class Solution {
    public static String solution(String input) {
        // Your code here
        return input;
    }
    
    public static void main(String[] args) {
        System.out.println(solution("Hello, World!"));
    }
}`,
  cpp: `// Write your solution here
#include <iostream>
#include <string>

std::string solution(std::string input) {
    // Your code here
    return input;
}

int main() {
    std::cout << solution("Hello, World!") << std::endl;
    return 0;
}`,
  csharp: `// Write your solution here
using System;

class Solution {
    static string Solve(string input) {
        // Your code here
        return input;
    }
    
    static void Main() {
        Console.WriteLine(Solve("Hello, World!"));
    }
}`,
  go: `// Write your solution here
package main

import "fmt"

func solution(input string) string {
    // Your code here
    return input
}

func main() {
    fmt.Println(solution("Hello, World!"))
}`,
  rust: `// Write your solution here
fn solution(input: &str) -> String {
    // Your code here
    input.to_string()
}

fn main() {
    println!("{}", solution("Hello, World!"));
}`,
}

export function CodeEditor({
  initialCode,
  language: initialLanguage = "javascript",
  onCodeChange,
  onRun,
  readOnly = false,
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode || defaultCode[initialLanguage] || "")
  const [language, setLanguage] = useState(initialLanguage)
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCodeChange = useCallback(
    (value: string) => {
      setCode(value)
      onCodeChange?.(value)
    },
    [onCodeChange]
  )

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
    if (!initialCode) {
      const newCode = defaultCode[newLanguage] || ""
      setCode(newCode)
      onCodeChange?.(newCode)
    }
  }

  const handleReset = () => {
    const resetCode = initialCode || defaultCode[language] || ""
    setCode(resetCode)
    onCodeChange?.(resetCode)
    setOutput("")
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRun = async () => {
    setIsRunning(true)
    setOutput("")
    
    try {
      if (onRun) {
        const result = await onRun(code, language)
        if (result.error) {
          setOutput(`Error: ${result.error}`)
        } else {
          setOutput(result.output)
        }
      } else {
        // Simulate code execution
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setOutput("Hello, World!\n\n[Execution completed successfully]")
      }
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2">
        <div className="flex items-center gap-3">
          <Select value={language} onValueChange={handleLanguageChange} disabled={readOnly}>
            <SelectTrigger className="h-8 w-[140px]">
              <FileCode className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge variant="outline" className="text-xs">
            UTF-8
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            {copied ? (
              <Check className="mr-1.5 h-4 w-4 text-secondary" />
            ) : (
              <Copy className="mr-1.5 h-4 w-4" />
            )}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleReset} disabled={readOnly}>
            <RotateCcw className="mr-1.5 h-4 w-4" />
            Reset
          </Button>
          <Button size="sm" onClick={handleRun} disabled={isRunning || readOnly}>
            {isRunning ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Play className="mr-1.5 h-4 w-4" />
            )}
            Run
          </Button>
        </div>
      </div>

      {/* Editor and Output */}
      <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        {/* Code Editor */}
        <div className="flex-1 overflow-hidden border-b border-border lg:border-b-0 lg:border-r">
          <Textarea
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            className="h-full min-h-[300px] resize-none rounded-none border-0 bg-background font-mono text-sm focus-visible:ring-0 lg:min-h-full"
            placeholder="Write your code here..."
            readOnly={readOnly}
            spellCheck={false}
          />
        </div>

        {/* Output Panel */}
        <div className="flex h-[200px] flex-col lg:h-auto lg:w-[400px]">
          <Tabs defaultValue="output" className="flex h-full flex-col">
            <TabsList className="h-10 w-full justify-start rounded-none border-b border-border bg-muted/30 px-4">
              <TabsTrigger value="output" className="gap-1.5 text-xs">
                <Terminal className="h-3.5 w-3.5" />
                Output
              </TabsTrigger>
              <TabsTrigger value="testcases" className="gap-1.5 text-xs">
                Test Cases
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="output" className="mt-0 flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <pre className="p-4 font-mono text-sm text-muted-foreground">
                  {isRunning ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Running...
                    </span>
                  ) : output ? (
                    output
                  ) : (
                    "Click 'Run' to execute your code..."
                  )}
                </pre>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="testcases" className="mt-0 flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="space-y-3 p-4">
                  <div className="rounded-lg border border-border p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium">Test Case 1</span>
                      <Badge className="bg-secondary/10 text-secondary text-xs">Sample</Badge>
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p><span className="font-medium">Input:</span> {"\"Hello, World!\""}</p>
                      <p><span className="font-medium">Expected:</span> {"\"Hello, World!\""}</p>
                    </div>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium">Test Case 2</span>
                      <Badge className="bg-secondary/10 text-secondary text-xs">Sample</Badge>
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p><span className="font-medium">Input:</span> {"\"Test\""}</p>
                      <p><span className="font-medium">Expected:</span> {"\"Test\""}</p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
