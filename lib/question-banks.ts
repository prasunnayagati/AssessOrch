// Shared in-memory storage for question banks
// In production, this should be replaced with a database

export interface QuestionBank {
  id: string;
  name: string;
  description: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  uploadedBy: string;
  status: "processing" | "ready" | "error";
  questionCount: number;
  category: string;
}

export const questionBanks: QuestionBank[] = [
  {
    id: "1",
    name: "Frontend Developer Questions",
    description: "Comprehensive question bank for frontend development roles",
    fileName: "frontend-questions.pdf",
    fileSize: "2.4 MB",
    uploadDate: "Jan 20, 2026",
    uploadedBy: "Admin User",
    status: "ready",
    questionCount: 150,
    category: "Frontend",
  },
  {
    id: "2",
    name: "Backend Developer Questions",
    description: "Backend development and system design questions",
    fileName: "backend-questions.pdf",
    fileSize: "3.1 MB",
    uploadDate: "Jan 18, 2026",
    uploadedBy: "Admin User",
    status: "ready",
    questionCount: 200,
    category: "Backend",
  },
];