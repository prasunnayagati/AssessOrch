"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/lib/auth-context"
import {
  Code2,
  LayoutDashboard,
  FileText,
  BarChart3,
  Settings,
  Users,
  FolderOpen,
  PlusCircle,
  History,
  Award,
  Building2,
  Shield,
  ClipboardList,
} from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
}

const studentNavItems: NavItem[] = [
  { title: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
  { title: "Available Tests", href: "/student/assessments", icon: FileText },
  { title: "Practice", href: "/student/practice", icon: Award },
  { title: "History", href: "/student/history", icon: History },
]

const recruiterNavItems: NavItem[] = [
  { title: "Dashboard", href: "/recruiter/dashboard", icon: LayoutDashboard },
  { title: "Assessments", href: "/recruiter/assessments", icon: ClipboardList },
  { title: "Create Test", href: "/recruiter/assessments/create", icon: PlusCircle },
  { title: "Candidates", href: "/recruiter/candidates", icon: Users },
  { title: "Question Bank", href: "/recruiter/questions", icon: FolderOpen },
]

const adminNavItems: NavItem[] = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Organizations", href: "/admin/organizations", icon: Building2 },
  { title: "All Assessments", href: "/admin/assessments", icon: ClipboardList },
  { title: "Question Library", href: "/admin/questions", icon: FolderOpen },
  { title: "Security", href: "/admin/security", icon: Shield },
  { title: "Settings", href: "/admin/settings", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const getNavItems = (): NavItem[] => {
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
    <aside className="fixed left-0 top-16 z-30 hidden h-[calc(100vh-64px)] w-64 border-r border-border bg-card md:block">
      <ScrollArea className="h-full py-6">
        <div className="px-3">
          <div className="mb-6 px-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Code2 className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">CodeAssess</span>
            </Link>
          </div>

          <nav className="space-y-1">
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
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            ))}
          </nav>

          <div className="mt-8 border-t border-border pt-6">
            <Button
              variant="ghost"
              asChild
              className={cn(
                "w-full justify-start gap-3",
                pathname === "/settings"
                  ? "bg-primary/10 text-primary hover:bg-primary/15"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Link href="/settings">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </Button>
          </div>
        </div>
      </ScrollArea>
    </aside>
  )
}
