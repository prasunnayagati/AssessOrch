export interface Assessment {
    id: string
    title: string
    description: string
    status: "active" | "draft" | "closed"
    candidates: number
    completed: number
    avgScore: number
    created: string
    deadline: string | null
    questions: number
    duration: number
    passingScore: number
    difficulty: "beginner" | "intermediate" | "advanced"
    skills: string[]
    enableProctoring: boolean
    enableWebcam: boolean
    enableTabDetection: boolean
    enableCopyPasteDetection: boolean
    shuffleQuestions: boolean
    showResults: boolean
    questionIds: string[]
}

export let assessments: Assessment[] = [
    {
        id: "1",
        title: "Frontend Developer Assessment",
        description: "Test frontend development skills with React, JavaScript, and CSS",
        status: "active",
        candidates: 45,
        completed: 32,
        avgScore: 78,
        created: "Jan 15, 2026",
        deadline: "Jan 30, 2026",
        questions: 3,
        duration: 90,
        passingScore: 70,
        difficulty: "intermediate",
        skills: ["React", "JavaScript", "CSS"],
        enableProctoring: true,
        enableWebcam: true,
        enableTabDetection: true,
        enableCopyPasteDetection: true,
        shuffleQuestions: false,
        showResults: true,
        questionIds: ["1", "2", "3"],
    },
    {
        id: "2",
        title: "Full Stack Challenge",
        description: "Comprehensive full-stack development assessment",
        status: "active",
        candidates: 28,
        completed: 15,
        avgScore: 72,
        created: "Jan 18, 2026",
        deadline: "Feb 05, 2026",
        questions: 4,
        duration: 120,
        passingScore: 75,
        difficulty: "advanced",
        skills: ["React", "Node.js", "MongoDB"],
        enableProctoring: true,
        enableWebcam: true,
        enableTabDetection: true,
        enableCopyPasteDetection: true,
        shuffleQuestions: false,
        showResults: true,
        questionIds: ["1", "2", "3", "4"],
    },
    {
        id: "3",
        title: "Backend Developer Test",
        description: "Backend development skills assessment",
        status: "active",
        candidates: 35,
        completed: 20,
        avgScore: 81,
        created: "Jan 20, 2026",
        deadline: "Feb 10, 2026",
        questions: 3,
        duration: 90,
        passingScore: 70,
        difficulty: "intermediate",
        skills: ["Node.js", "Express", "MongoDB"],
        enableProctoring: true,
        enableWebcam: true,
        enableTabDetection: true,
        enableCopyPasteDetection: true,
        shuffleQuestions: false,
        showResults: true,
        questionIds: ["4", "5", "6"],
    },
]

export const addAssessment = (assessment: Assessment) => {
    assessments.unshift(assessment)
}

export const getAssessment = (id: string) => {
    return assessments.find(a => a.id === id)
}
