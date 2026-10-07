"use client"

import React, { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"
import { toast } from "@/hooks/use-toast"
import {
    User,
    Lock,
    Bell,
    Eye,
    Monitor,
    Save,
    Loader2,
    Camera,
    Globe,
    ShieldCheck
} from "lucide-react"

export default function SettingsPage() {
    const { user } = useAuth()
    const [isSaving, setIsSaving] = useState(false)

    const [profileData, setProfileData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        bio: "Full-stack developer passionate about building scalable web applications.",
        location: "San Francisco, CA",
        website: "https://johndoe.com"
    })

    const [notifications, setNotifications] = useState({
        emailAssessments: true,
        emailResults: true,
        emailMarketing: false,
        pushNewTests: true,
        pushResults: true
    })

    const handleSaveProfile = async () => {
        setIsSaving(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsSaving(false)
        toast({
            title: "Profile updated",
            description: "Your personal information has been saved successfully."
        })
    }

    const handleSaveSecurity = async () => {
        setIsSaving(true)
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsSaving(false)
        toast({
            title: "Security updated",
            description: "Your password has been changed."
        })
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Settings</h1>
                    <p className="text-muted-foreground">Manage your account settings and preferences</p>
                </div>

                <Tabs defaultValue="profile" className="space-y-6">
                    <TabsList className="flex w-full justify-start border-b rounded-none h-auto p-0 bg-transparent space-x-6">
                        <TabsTrigger
                            value="profile"
                            className="px-2 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent shadow-none"
                        >
                            <User className="h-4 w-4 mr-2" />
                            Profile
                        </TabsTrigger>
                        <TabsTrigger
                            value="security"
                            className="px-2 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent shadow-none"
                        >
                            <Lock className="h-4 w-4 mr-2" />
                            Security
                        </TabsTrigger>
                        <TabsTrigger
                            value="notifications"
                            className="px-2 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent shadow-none"
                        >
                            <Bell className="h-4 w-4 mr-2" />
                            Notifications
                        </TabsTrigger>
                        <TabsTrigger
                            value="appearance"
                            className="px-2 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent shadow-none"
                        >
                            <Monitor className="h-4 w-4 mr-2" />
                            Appearance
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>Update your photo and personal details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center gap-6">
                                    <div className="relative">
                                        <Avatar className="h-24 w-24 border-2 border-muted">
                                            <AvatarImage src={user?.avatar} />
                                            <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                                                {user?.name.split(" ").map(n => n[0]).join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <Button size="icon" variant="secondary" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full shadow-md border">
                                            <Camera className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium mb-1">Profile Picture</h4>
                                        <p className="text-xs text-muted-foreground mb-3">JPG, GIF or PNG. Max size of 800K</p>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline">Upload New</Button>
                                            <Button size="sm" variant="ghost" className="text-destructive">Remove</Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            value={profileData.name}
                                            onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={profileData.email}
                                            onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Textarea
                                        id="bio"
                                        rows={4}
                                        value={profileData.bio}
                                        onChange={e => setProfileData({ ...profileData, bio: e.target.value })}
                                    />
                                    <p className="text-xs text-muted-foreground">Brief description for your profile.</p>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="location">Location</Label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="location"
                                                className="pl-9"
                                                value={profileData.location}
                                                onChange={e => setProfileData({ ...profileData, location: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="website">Website</Label>
                                        <Input
                                            id="website"
                                            value={profileData.website}
                                            onChange={e => setProfileData({ ...profileData, website: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4 border-t">
                                    <Button onClick={handleSaveProfile} disabled={isSaving}>
                                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                        Save Changes
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="security" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Change Password</CardTitle>
                                <CardDescription>Secure your account with a strong password</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="current-password">Current Password</Label>
                                    <Input id="current-password" type="password" placeholder="••••••••" />
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="new-password">New Password</Label>
                                        <Input id="new-password" type="password" placeholder="••••••••" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                                        <Input id="confirm-password" type="password" placeholder="••••••••" />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4 border-t">
                                    <Button onClick={handleSaveSecurity} disabled={isSaving}>
                                        Update Password
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-destructive/20 bg-destructive/5">
                            <CardHeader>
                                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                                <CardDescription>Permanently delete your account and all data</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4 font-normal">
                                    Once you delete your account, there is no going back. Please be certain.
                                </p>
                                <Button variant="destructive">Delete Account</Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="notifications" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Notification Preferences</CardTitle>
                                <CardDescription>Choose what updates you want to receive</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold flex items-center gap-2">
                                        <Bell className="h-4 w-4" />
                                        Email Notifications
                                    </h4>
                                    <div className="space-y-4 pl-6">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Upcoming Assessments</Label>
                                                <p className="text-xs text-muted-foreground font-normal">Receive alerts about new tests assigned to you.</p>
                                            </div>
                                            <Switch
                                                checked={notifications.emailAssessments}
                                                onCheckedChange={v => setNotifications({ ...notifications, emailAssessments: v })}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Assessment Results</Label>
                                                <p className="text-xs text-muted-foreground font-normal">Get notified as soon as your score is processed.</p>
                                            </div>
                                            <Switch
                                                checked={notifications.emailResults}
                                                onCheckedChange={v => setNotifications({ ...notifications, emailResults: v })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t">
                                    <h4 className="text-sm font-semibold flex items-center gap-2">
                                        <ShieldCheck className="h-4 w-4" />
                                        Security Alerts
                                    </h4>
                                    <div className="flex items-center justify-between pl-6">
                                        <div className="space-y-0.5">
                                            <Label>Login Alerts</Label>
                                            <p className="text-xs text-muted-foreground font-normal">Get notified of new logins from unrecognized devices.</p>
                                        </div>
                                        <Switch checked={true} disabled />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4 border-t">
                                    <Button onClick={() => toast({ title: "Preferences saved" })}>Save Preferences</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="appearance" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Appearance Settings</CardTitle>
                                <CardDescription>Customize the look and feel of your dashboard</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <Label>Theme Interface</Label>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="cursor-pointer space-y-2 rounded-lg border-2 border-primary p-1 bg-white">
                                            <div className="h-20 rounded bg-slate-100" />
                                            <p className="text-center text-xs font-medium text-black">Light</p>
                                        </div>
                                        <div className="cursor-pointer space-y-2 rounded-lg border border-muted p-1 bg-slate-900">
                                            <div className="h-20 rounded bg-slate-800" />
                                            <p className="text-center text-xs font-medium text-white">Dark</p>
                                        </div>
                                        <div className="cursor-pointer space-y-2 rounded-lg border border-muted p-1 bg-gradient-to-br from-white to-slate-900">
                                            <div className="h-20 rounded bg-slate-400" />
                                            <p className="text-center text-xs font-medium">System</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t">
                                    <div className="space-y-0.5">
                                        <Label>Compact Mode</Label>
                                        <p className="text-xs text-muted-foreground font-normal">Reduce vertical spacing in lists and tables.</p>
                                    </div>
                                    <Switch />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    )
}
