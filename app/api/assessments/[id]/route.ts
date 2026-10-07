import { NextRequest, NextResponse } from "next/server"
export const dynamic = 'force-dynamic'
import { db } from "@/lib/firebase"
import { doc, getDoc, collection, query, where, getDocs, updateDoc, increment } from "firebase/firestore"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        console.log(`Fetching assessment details for ID: ${id}`);

        const assessmentRef = doc(db, "assessments", id);
        const assessmentDoc = await getDoc(assessmentRef);

        if (!assessmentDoc.exists()) {
            console.warn(`Assessment ${id} not found in database`);
            return NextResponse.json(
                { success: false, error: "Assessment not found in database" },
                { status: 404 }
            )
        }

        // Increment candidates count (as a proxy for "starts" or "views")
        // This ensures that progress (completed/candidates) can be calculated.
        try {
            await updateDoc(assessmentRef, {
                candidates: increment(1)
            });
            console.log(`Incremented candidate count for assessment ${id}`);
        } catch (updateErr) {
            console.error("Non-critical error incrementing candidates:", updateErr);
            // We don't fail the request if just the counter fails
        }

        const assessmentData = assessmentDoc.data()

        // Fetch full question objects from Firestore
        const questionIds = assessmentData.questionIds || []
        let fullQuestions: any[] = []

        if (questionIds.length > 0) {
            // Fetch each question individually in parallel to avoid 'in' query limit of 10
            const questionPromises = questionIds.map(async (qid: string) => {
                const qDoc = await getDoc(doc(db, "questions", qid))
                if (qDoc.exists()) {
                    return { ...qDoc.data(), id: qid }
                }
                return null
            })

            const results = await Promise.all(questionPromises)
            fullQuestions = results.filter(q => q !== null)
        }

        return NextResponse.json({
            success: true,
            assessment: {
                id: assessmentDoc.id,
                ...assessmentData,
                fullQuestions
            }
        })
    } catch (error) {
        console.error("Error fetching assessment details:", error)
        return NextResponse.json(
            { success: false, error: "Internal server error while fetching from database" },
            { status: 500 }
        )
    }
}
