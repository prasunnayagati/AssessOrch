import { NextRequest, NextResponse } from "next/server"
export const dynamic = 'force-dynamic'
import { db } from "@/lib/firebase"
import { doc, getDoc, updateDoc, increment, collection, addDoc, Timestamp } from "firebase/firestore"

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const { score, studentId, studentName, studentEmail, proctoringData } = body

        console.log(`Received submission for assessment ${id}. Student: ${studentName}, Score: ${score}`);

        if (score === undefined || score === null) {
            console.error("Submission failed: Missing score in request body");
            return NextResponse.json({ success: false, error: "Missing score" }, { status: 400 });
        }

        const assessmentRef = doc(db, "assessments", id)
        const assessmentDoc = await getDoc(assessmentRef)

        if (!assessmentDoc.exists()) {
            console.error(`Submission failed: Assessment ${id} not found`);
            return NextResponse.json({ success: false, error: "Assessment not found" }, { status: 404 })
        }

        const data = assessmentDoc.data()
        const currentCompleted = data.completed || 0
        const currentAvg = data.avgScore || 0

        // Calculate new average
        const newAvg = Math.round(((currentAvg * currentCompleted) + score) / (currentCompleted + 1))

        // 1. Update Assessment Stats
        console.log("Updating assessment stats...");
        await updateDoc(assessmentRef, {
            completed: increment(1),
            avgScore: newAvg
        })

        // 2. Record Submission
        console.log("Adding submission record to Firestore...");
        const submissionData = {
            assessmentId: id,
            assessmentTitle: data.title,
            studentId: studentId || "anonymous",
            studentName: studentName || "Anonymous Student",
            studentEmail: studentEmail || "anonymous@student.com",
            score: score,
            totalPoints: data.fullQuestions?.reduce((acc: number, q: any) => acc + (q.points || 0), 0) || 100,
            submittedAt: Timestamp.now(),
            status: score >= (data.passingScore || 70) ? "passed" : "failed",
            proctoringData: proctoringData || null
        };

        const subRef = await addDoc(collection(db, "submissions"), submissionData);
        console.log(`Submission recorded successfully with ID: ${subRef.id}`);

        return NextResponse.json({ success: true, newAvg, submissionId: subRef.id })
    } catch (error) {
        console.error("Error submitting assessment:", error)
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
    }
}
