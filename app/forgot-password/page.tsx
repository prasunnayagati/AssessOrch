"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
    const [submitted, setSubmitted] = useState(false)
    const [email, setEmail] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitted(true)
    }

    return (
        <div className="flex min-h-screen flex-col bg-muted/30">
            <Navbar />
            <div className="flex flex-1 items-center justify-center px-4 py-12">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Reset Password</CardTitle>
                        <CardDescription>
                            {submitted
                                ? "Check your inbox for reset instructions"
                                : "Enter your email to receive a password reset link"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {submitted ? (
                            <div className="space-y-6">
                                <Alert className="bg-secondary/10 border-secondary/20">
                                    <CheckCircle2 className="h-4 w-4 text-secondary" />
                                    <AlertDescription>
                                        If an account exists for {email}, you will receive a reset link shortly.
                                    </AlertDescription>
                                </Alert>
                                <Button variant="outline" className="w-full bg-transparent" asChild>
                                    <Link href="/login">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back to Login
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full">Send Reset Link</Button>
                                <div className="text-center mt-4">
                                    <Link href="/login" className="text-sm text-primary hover:underline flex items-center justify-center">
                                        <ArrowLeft className="mr-2 h-3 w-3" />
                                        Back to Login
                                    </Link>
                                </div>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
