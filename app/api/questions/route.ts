import { NextRequest, NextResponse } from "next/server"
export const dynamic = 'force-dynamic'
import { db } from "@/lib/firebase"
import { collection, addDoc, getDocs, doc, setDoc, query, where } from "firebase/firestore"

const INITIAL_QUESTIONS = [
    {
        id: "1",
        title: "Two Sum",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        difficulty: "easy",
        points: 10,
        type: "coding",
        tags: ["Array", "Hash Table"]
    },
    {
        id: "mcq-1",
        title: "React Hooks - useEffect",
        description: "Which of the following is the correct way to run a useEffect hook only once when the component mounts?",
        difficulty: "easy",
        points: 5,
        type: "multiple-choice",
        options: [
            "useEffect(() => { ... })",
            "useEffect(() => { ... }, [])",
            "useEffect(() => { ... }, [once])",
            "useEffect(() => { ... }, {})"
        ],
        correctOption: 1,
        tags: ["React", "Frontend"]
    },
    {
        id: "mcq-2",
        title: "HTTP Status Codes",
        description: "Which HTTP status code represents 'Internal Server Error'?",
        difficulty: "easy",
        points: 5,
        type: "multiple-choice",
        options: [
            "404",
            "403",
            "500",
            "502"
        ],
        correctOption: 2,
        tags: ["Backend", "HTTP"]
    },
    {
        id: "3",
        title: "Reverse Linked List",
        description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
        difficulty: "medium",
        points: 15,
        type: "coding",
        tags: ["Linked List"]
    }
]

// GET /api/questions - Get all questions
export async function GET() {
    try {
        const questionsCol = collection(db, "questions")
        const snapshot = await getDocs(questionsCol)

        let questions = snapshot.docs.map(d => ({ ...d.data(), id: d.id }))

        // Auto-seed if empty
        if (questions.length === 0) {
            const seedPromises = INITIAL_QUESTIONS.map(q => {
                const qRef = doc(db, "questions", q.id)
                return setDoc(qRef, q)
            })
            await Promise.all(seedPromises)
            questions = INITIAL_QUESTIONS
        }

        return NextResponse.json({
            success: true,
            questions
        })
    } catch (error) {
        console.error("Error fetching questions:", error)
        return NextResponse.json({ success: false, error: "Failed to fetch from DB" }, { status: 500 })
    }
}

// POST /api/questions - Bulk add questions
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { questions: newQuestions } = body

        if (!newQuestions || !Array.isArray(newQuestions)) {
            return NextResponse.json(
                { success: false, error: "Invalid questions data" },
                { status: 400 }
            )
        }

        // Add each question to Firestore
        // Using setDoc with id to allow consistent referencing
        const uploadPromises = newQuestions.map(q => {
            const qRef = doc(db, "questions", q.id)
            return setDoc(qRef, q)
        })

        await Promise.all(uploadPromises)

        return NextResponse.json({
            success: true,
            message: `${newQuestions.length} questions synchronized to database`
        })
    } catch (error) {
        console.error("Error adding questions to database:", error)
        return NextResponse.json(
            { success: false, error: "Failed to sync questions to database" },
            { status: 500 }
        )
    }
}
