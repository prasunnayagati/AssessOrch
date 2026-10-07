"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { useAuth } from "@/lib/auth-context"
import {
  Menu,
  Bell,
  LogOut,
  Settings,
  User,
  Code2,
  LayoutDashboard,
  FileText,
  BarChart3,
  History,
  Award,
  Users,
  PlusCircle,
  FolderOpen,
  ClipboardList,
  Building2,
  Shield,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

const studentNavItems = [
  { title: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
  { title: "Available Tests", href: "/student/assessments", icon: FileText },
  { title: "Practice", href: "/student/practice", icon: Award },
  { title: "History", href: "/student/history", icon: History },
]

const recruiterNavItems = [
  { title: "Dashboard", href: "/recruiter/dashboard", icon: LayoutDashboard },
  { title: "Assessments", href: "/recruiter/assessments", icon: ClipboardList },
  { title: "Create Test", href: "/recruiter/assessments/create", icon: PlusCircle },
  { title: "Candidates", href: "/recruiter/candidates", icon: Users },
  { title: "Question Bank", href: "/recruiter/questions", icon: FolderOpen },
]

const adminNavItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Organizations", href: "/admin/organizations", icon: Building2 },
  { title: "All Assessments", href: "/admin/assessments", icon: ClipboardList },
  { title: "Question Library", href: "/admin/questions", icon: FolderOpen },
  { title: "Security", href: "/admin/security", icon: Shield },
]

export function DashboardHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "New Assessment Available",
      description: "Frontend Developer Assessment is now live",
      time: "2 mins ago",
      read: false,
      type: "info"
    },
    {
      id: "2",
      title: "Assessment Completed",
      description: "You've successfully finished 'React Fundamentals'",
      time: "1 hour ago",
      read: false,
      type: "success"
    },
    {
      id: "3",
      title: "System Update",
      description: "AI generation features have been improved",
      time: "3 hours ago",
      read: true,
      type: "info"
    },
    {
      id: "4",
      title: "New Message",
      description: "Your recruiter sent a message regarding your last test",
      time: "1 day ago",
      read: true,
      type: "message"
    }
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const getNavItems = () => {
    switch (user?.role) {
      case "student":
        return studentNavItems
      case "recruiter":
        return recruiterNavItems
      case "admin":
        return adminNavItems
      default:
        return []
    }
  }

  const navItems = getNavItems()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation Menu</SheetTitle>
                <SheetDescription>Access dashboard, assessments, candidates and more.</SheetDescription>
              </SheetHeader>
              <div className="p-6">
                <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                    <Code2 className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="font-semibold">CodeAssess</span>
                </Link>
              </div>
              <nav className="space-y-1 px-3">
                {navItems.map((item) => (
                  <Button
                    key={item.href}
                    variant="ghost"
                    asChild
                    className={cn(
                      "w-full justify-start gap-3",
                      pathname === item.href
                        ? "bg-primary/10 text-primary hover:bg-primary/15"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  </Button>
                ))}
              </nav>
              <div className="mt-6 border-t border-border px-3 pt-6">
                <Button
                  variant="ghost"
                  asChild
                  className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  <Link href="/settings">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <div className="hidden md:block">
            <h1 className="text-lg font-semibold">
              {user?.role === "student" && "Student Portal"}
              {user?.role === "recruiter" && "Recruiter Portal"}
              {user?.role === "admin" && "Admin Portal"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white outline outline-2 outline-background">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
              <div className="flex items-center justify-between p-4">
                <h3 className="font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-xs text-primary hover:bg-transparent"
                    onClick={markAllRead}
                  >
                    Mark all as read
                  </Button>
                )}
              </div>
              <DropdownMenuSeparator />
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <DropdownMenuItem
                      key={n.id}
                      className={cn(
                        "flex flex-col items-start gap-1 p-4 cursor-pointer focus:bg-muted",
                        !n.read && "bg-primary/5"
                      )}
                      onSelect={() => markRead(n.id)}
                    >
                      <div className="flex w-full items-start justify-between gap-1">
                        <span className={cn(
                          "text-sm font-semibold",
                          !n.read ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {n.title}
                        </span>
                        {!n.read && <span className="h-2 w-2 rounded-full bg-primary mt-1.5" />}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {n.description}
                      </p>
                      <span className="mt-1 text-[10px] text-muted-foreground">
                        {n.time}
                      </span>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-sm text-muted-foreground">No new updates</p>
                  </div>
                )}
              </div>

            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <div className="flex items-center gap-2 p-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {user?.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex cursor-pointer items-center">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex cursor-pointer items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
