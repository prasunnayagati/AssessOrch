import { NextRequest, NextResponse } from "next/server"
export const dynamic = 'force-dynamic'
import { db } from "@/lib/firebase"
import { doc, getDoc, updateDoc, increment } from "firebase/firestore"

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const { action } = body // e.g., 'start'

        const assessmentRef = doc(db, "assessments", id)
        const assessmentDoc = await getDoc(assessmentRef)

        if (!assessmentDoc.exists()) {
            return NextResponse.json({ success: false, error: "Assessment not found" }, { status: 404 })
        }

        if (action === 'start') {
            await updateDoc(assessmentRef, {
                candidates: increment(1)
            })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error tracking assessment progress:", error)
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
    }
}
