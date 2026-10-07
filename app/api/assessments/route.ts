import { NextRequest, NextResponse } from "next/server"
export const dynamic = 'force-dynamic'
import { db } from "@/lib/firebase"
import { collection, addDoc, getDocs, query, where, Timestamp, getDoc, doc, setDoc } from "firebase/firestore"

const SHOWCASE_ASSESSMENTS = [
  {
    id: "showcase-frontend",
    title: "Showcase: Frontend Developer Pro",
    description: "A comprehensive test for modern frontend roles using React and Core JS.",
    status: "active",
    candidates: 120,
    completed: 85,
    avgScore: 76,
    duration: 45,
    passingScore: 70,
    difficulty: "intermediate",
    skills: ["React", "JavaScript", "Frontend"],
    enableProctoring: true,
    enableWebcam: true,
    enableTabDetection: true,
    enableCopyPasteDetection: true,
    shuffleQuestions: false,
    showResults: true,
    questionIds: ["mcq-1", "1", "3"],
  },
  {
    id: "showcase-fullstack",
    title: "Showcase: Full Stack Engineer",
    description: "Testing both system architecture and algorithm efficiency.",
    status: "active",
    candidates: 45,
    completed: 20,
    avgScore: 82,
    duration: 60,
    passingScore: 75,
    difficulty: "advanced",
    skills: ["System Design", "Node.js", "Algorithms"],
    enableProctoring: false,
    enableWebcam: false,
    enableTabDetection: false,
    enableCopyPasteDetection: false,
    shuffleQuestions: true,
    showResults: true,
    questionIds: ["mcq-2", "1", "3"],
  }
]

// GET /api/assessments - Get all assessments
export async function GET() {
  try {
    const assessmentsCol = collection(db, "assessments")
    const snapshot = await getDocs(assessmentsCol)

    let assessments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      created: doc.data().created?.toDate ? doc.data().created.toDate().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }) : doc.data().created
    }))

    // Auto-seed showcase if empty
    if (assessments.length === 0) {
      const seedPromises = SHOWCASE_ASSESSMENTS.map(a => {
        const { id, ...data } = a
        const aRef = doc(db, "assessments", id)
        return setDoc(aRef, { ...data, created: Timestamp.now() })
      })
      await Promise.all(seedPromises)
      assessments = SHOWCASE_ASSESSMENTS.map(a => ({ ...a, created: "Today" }))
    }

    return NextResponse.json({ success: true, assessments })
  } catch (error) {
    console.error("Error fetching assessments:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch assessments" },
      { status: 500 }
    )
  }
}

// POST /api/assessments - Create a new assessment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      duration,
      passingScore,
      difficulty,
      skills,
      questions,
      enableProctoring,
      enableWebcam,
      enableTabDetection,
      enableCopyPasteDetection,
      shuffleQuestions,
      showResults,
      deadline,
    } = body

    // Validate required fields
    if (!title || !description || !skills || skills.length === 0 || !questions || questions.length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Create new assessment object
    const newAssessmentData = {
      title,
      description,
      status: "active",
      candidates: 0,
      completed: 0,
      avgScore: 0,
      created: Timestamp.now(),
      deadline: deadline || null,
      questions: questions.length,
      duration: duration || 90,
      passingScore: passingScore || 70,
      difficulty: difficulty || "intermediate",
      skills: skills || [],
      enableProctoring: enableProctoring ?? true,
      enableWebcam: enableWebcam ?? true,
      enableTabDetection: enableTabDetection ?? true,
      enableCopyPasteDetection: enableCopyPasteDetection ?? true,
      shuffleQuestions: shuffleQuestions ?? false,
      showResults: showResults ?? true,
      questionIds: questions,
    }

    // Add to Firestore
    const docRef = await addDoc(collection(db, "assessments"), newAssessmentData)

    return NextResponse.json({
      success: true,
      assessment: { id: docRef.id, ...newAssessmentData },
      message: "Assessment created successfully and is now stored in the database"
    })
  } catch (error) {
    console.error("Error creating assessment:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create assessment" },
      { status: 500 }
    )
  }
}