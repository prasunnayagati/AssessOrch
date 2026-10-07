
import { generateText, Output } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

const QuestionSchema = z.object({
  title: z.string(),
  description: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  points: z.number(),
  type: z.enum(["coding", "system-design", "multiple-choice"]),
  timeEstimate: z.number(),
  hints: z.array(z.string()),
  testCases: z.array(
    z.object({
      input: z.string(),
      expectedOutput: z.string(),
      isHidden: z.boolean(),
    })
  ),
  starterCode: z.object({
    javascript: z.string(),
    python: z.string(),
    java: z.string(),
  }),
  solution: z.string(),
  tags: z.array(z.string()),
})

const GeneratedQuestionsSchema = z.object({
  questions: z.array(QuestionSchema),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { topic, difficulty, count, skills, questionType, bankContext } = body

    let prompt = `Generate ${count} assessment questions for the following criteria:

Topic/Role: ${topic}
Difficulty Level: ${difficulty}
Skills to Test: ${skills.join(", ")}
Question Type: ${questionType}`

    if (bankContext) {
      prompt += `\n\nContext from Question Bank:
Name: ${bankContext.name}
Description: ${bankContext.description}
Please ensure the generated questions are relevant to this bank's theme and depth.`
    }

    prompt += `\n\nFor each question, provide:
1. A clear, concise title
2. A detailed problem description with examples
3. Difficulty rating (easy, medium, hard)
4. Point value (easy: 10-15, medium: 15-25, hard: 25-40)
5. Estimated time to solve in minutes
6. 2-3 helpful hints
7. Test cases (at least 3, with at least 1 hidden, for coding questions)
8. Starter code in JavaScript, Python, and Java (for coding questions)
9. A reference solution
10. Relevant tags

Make the questions practical, real-world focused, and appropriate for technical interviews.
Ensure questions progressively test deeper understanding of the skills.`

    const { output } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      output: Output.object({
        schema: GeneratedQuestionsSchema,
      }),
    })

    return Response.json({ success: true, questions: output?.questions || [] })
  } catch (error) {
    console.error("Error generating questions:", error)
    return Response.json(
      { success: false, error: "Failed to generate questions. Please ensure your OpenAI API key is configured correctly." },
      { status: 500 }
    )
  }
}
