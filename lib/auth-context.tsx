"use client"

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type UserRole = "student" | "recruiter" | "admin"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string, name: string, role: UserRole) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demo purposes
const mockUsers: Record<string, User & { password: string }> = {
  "student@demo.com": {
    id: "1",
    email: "student@demo.com",
    name: "Alex Johnson",
    role: "student",
    password: "demo123",
  },
  "recruiter@demo.com": {
    id: "2",
    email: "recruiter@demo.com",
    name: "Sarah Smith",
    role: "recruiter",
    password: "demo123",
  },
  "admin@demo.com": {
    id: "3",
    email: "admin@demo.com",
    name: "Mike Admin",
    role: "admin",
    password: "demo123",
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = sessionStorage.getItem("codeassess_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 800)) // Simulate API call
    
    const mockUser = mockUsers[email]
    if (mockUser && mockUser.password === password) {
      const { password: _, ...userWithoutPassword } = mockUser
      setUser(userWithoutPassword)
      sessionStorage.setItem("codeassess_user", JSON.stringify(userWithoutPassword))
      return { success: true }
    }
    
    return { success: false, error: "Invalid email or password" }
  }

  const register = async (
    email: string,
    password: string,
    name: string,
    role: UserRole
  ): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 800)) // Simulate API call
    
    if (mockUsers[email]) {
      return { success: false, error: "Email already exists" }
    }
    
    const newUser: User = {
      id: Math.random().toString(36).substring(7),
      email,
      name,
      role,
    }
    
    setUser(newUser)
    sessionStorage.setItem("codeassess_user", JSON.stringify(newUser))
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem("codeassess_user")
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
