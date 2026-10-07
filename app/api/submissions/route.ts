import { NextRequest, NextResponse } from "next/server"
export const dynamic = 'force-dynamic'
import { db } from "@/lib/firebase"
import { collection, getDocs, query, orderBy, limit, Timestamp, where } from "firebase/firestore"

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const studentId = searchParams.get("studentId")

        const submissionsCol = collection(db, "submissions")
        let q = query(submissionsCol)

        if (studentId) {
            q = query(submissionsCol, where("studentId", "==", studentId))
        }

        const snapshot = await getDocs(q)

        let submissions = snapshot.docs.map(doc => {
            const data = doc.data()
            return {
                id: doc.id,
                ...data,
                date: data.submittedAt?.toDate ? data.submittedAt.toDate().toLocaleString() :
                    (data.submittedAt?.seconds ? new Date(data.submittedAt.seconds * 1000).toLocaleString() : "Recently")
            }
        })

        // Sort by date/submittedAt descending in JS
        submissions.sort((a: any, b: any) => {
            const timeA = a.submittedAt?.seconds || 0
            const timeB = b.submittedAt?.seconds || 0
            return timeB - timeA
        })

        // Limit to top 50
        submissions = submissions.slice(0, 50)

        return NextResponse.json({
            success: true,
            submissions
        })
    } catch (error) {
        console.error("Error fetching submissions:", error)
        return NextResponse.json({ success: false, error: "Failed to fetch submissions" }, { status: 500 })
    }
}
