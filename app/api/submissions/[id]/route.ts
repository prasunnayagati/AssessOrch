import { NextRequest, NextResponse } from "next/server"
export const dynamic = 'force-dynamic'
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const submissionRef = doc(db, "submissions", id)
        const submissionDoc = await getDoc(submissionRef)

        if (!submissionDoc.exists()) {
            return NextResponse.json({ success: false, error: "Submission not found" }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            submission: {
                id: submissionDoc.id,
                ...submissionDoc.data()
            }
        })
    } catch (error) {
        console.error("Error fetching submission details:", error)
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
    }
}
