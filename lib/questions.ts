export interface Question {
    id: string
    title: string
    description: string
    difficulty: "easy" | "medium" | "hard"
    points: number
    type: "coding" | "system-design" | "multiple-choice"
    timeEstimate?: number
    isAIGenerated?: boolean
    tags?: string[]
}

export let questions: Question[] = [
    {
        id: "1",
        title: "Two Sum",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        difficulty: "easy",
        points: 10,
        type: "coding",
        timeEstimate: 15,
        tags: ["Array", "Hash Table"]
    },
    {
        id: "2",
        title: "Valid Parentheses",
        description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
        difficulty: "easy",
        points: 10,
        type: "coding",
        timeEstimate: 10,
        tags: ["String", "Stack"]
    },
    {
        id: "3",
        title: "Reverse Linked List",
        description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
        difficulty: "medium",
        points: 15,
        type: "coding",
        timeEstimate: 20,
        tags: ["Linked List"]
    },
    {
        id: "4",
        title: "Maximum Subarray",
        description: "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
        difficulty: "medium",
        points: 15,
        type: "coding",
        timeEstimate: 20,
        tags: ["Array", "Dynamic Programming"]
    },
    {
        id: "5",
        title: "LRU Cache",
        description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.",
        difficulty: "hard",
        points: 25,
        type: "coding",
        timeEstimate: 45,
        tags: ["Design", "Hash Table", "Linked List"]
    },
    {
        id: "6",
        title: "Binary Tree Traversal",
        description: "Implement various binary tree traversal algorithms (in-order, pre-order, post-order).",
        difficulty: "medium",
        points: 15,
        type: "coding",
        timeEstimate: 20,
        tags: ["Tree", "DFS"]
    },
    {
        id: "7",
        title: "REST API Design",
        description: "Design a RESTful API for a library management system.",
        difficulty: "medium",
        points: 20,
        type: "system-design",
        timeEstimate: 30,
        tags: ["API", "Backend"]
    },
    {
        id: "8",
        title: "Database Schema Design",
        description: "Design a database schema for an e-commerce platform.",
        difficulty: "hard",
        points: 25,
        type: "system-design",
        timeEstimate: 45,
        tags: ["Database", "Architecture"]
    },
]

export const addQuestion = (question: Question) => {
    questions.unshift(question)
}

export const addQuestions = (newQuestions: Question[]) => {
    // Filter out duplicates
    const existingIds = new Set(questions.map(q => q.id))
    const uniqueNew = newQuestions.filter(q => !existingIds.has(q.id))
    questions.unshift(...uniqueNew)
}

export const getQuestionsByIds = (ids: any[]) => {
    const idSet = new Set(ids.map(id => id.toString()))
    return questions.filter(q => idSet.has(q.id.toString()))
}
