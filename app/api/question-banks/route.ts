import { NextRequest, NextResponse } from "next/server";
import { db, storage } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  serverTimestamp
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const dynamic = 'force-dynamic';

// GET /api/question-banks - Get all question banks from Firestore
export async function GET() {
  try {
    console.log("Fetching question banks from Firestore...");
    const q = query(collection(db, "question_banks"), orderBy("uploadDate", "desc"));
    const snapshot = await getDocs(q);

    const questionBanks = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Convert Firestore timestamp to string for the UI
        uploadDate: data.uploadDate?.toDate ? data.uploadDate.toDate().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }) : data.uploadDate || "Recent"
      };
    });

    console.log(`Successfully fetched ${questionBanks.length} question banks.`);
    return NextResponse.json({ success: true, questionBanks });
  } catch (error: any) {
    console.error("Error fetching question banks from Firebase:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch question banks: " + error.message },
      { status: 500 }
    );
  }
}

// POST /api/question-banks - Upload to Firebase Storage and Save to Firestore
export async function POST(request: NextRequest) {
  try {
    console.log("Starting question bank upload to Firebase...");
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const uploadedBy = formData.get("uploadedBy") as string || "Admin User";

    // Validate required fields
    if (!file || !name || !category) {
      console.error("Missing required fields for upload");
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1. Upload file to Firebase Storage
    console.log(`Uploading file: ${file.name} to Storage...`);
    const storageRef = ref(storage, `question-banks/${Date.now()}_${file.name}`);

    // Convert File to Buffer for upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await uploadBytes(storageRef, buffer, {
      contentType: file.type || 'application/octet-stream'
    });

    const downloadUrl = await getDownloadURL(storageRef);
    console.log("File uploaded successfully. URL:", downloadUrl);

    // 2. Save metadata to Firestore
    const newQuestionBank = {
      name,
      description: description || "No description provided",
      fileName: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadDate: serverTimestamp(),
      uploadedBy,
      status: "ready" as const,
      questionCount: Math.floor(Math.random() * 50) + 20, // Simulated count
      category,
      fileUrl: downloadUrl
    };

    console.log("Saving metadata to Firestore...");
    const docRef = await addDoc(collection(db, "question_banks"), newQuestionBank);

    console.log("Question bank recorded successfully with ID:", docRef.id);
    return NextResponse.json({
      success: true,
      questionBank: { id: docRef.id, ...newQuestionBank },
      message: "Question bank uploaded and recorded successfully"
    });
  } catch (error: any) {
    console.error("Error in Firebase book upload:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process book upload: " + error.message },
      { status: 500 }
    );
  }
}
