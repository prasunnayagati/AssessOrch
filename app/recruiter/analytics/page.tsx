"use client"

import React from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Target,
  Award,
} from "lucide-react"

const scoreDistribution = [
  { range: "0-20", count: 5 },
  { range: "21-40", count: 12 },
  { range: "41-60", count: 28 },
  { range: "61-80", count: 45 },
  { range: "81-100", count: 32 },
]

const weeklyActivity = [
  { day: "Mon", assessments: 12, candidates: 28 },
  { day: "Tue", assessments: 18, candidates: 42 },
  { day: "Wed", assessments: 15, candidates: 35 },
  { day: "Thu", assessments: 22, candidates: 48 },
  { day: "Fri", assessments: 28, candidates: 62 },
  { day: "Sat", assessments: 8, candidates: 18 },
  { day: "Sun", assessments: 5, candidates: 12 },
]

const skillPerformance = [
  { skill: "JavaScript", avgScore: 78, candidates: 120 },
  { skill: "Python", avgScore: 82, candidates: 95 },
  { skill: "React", avgScore: 75, candidates: 88 },
  { skill: "SQL", avgScore: 71, candidates: 65 },
  { skill: "System Design", avgScore: 68, candidates: 45 },
  { skill: "Algorithms", avgScore: 65, candidates: 110 },
]

const statusDistribution = [
  { name: "Passed", value: 68, color: "hsl(var(--secondary))" },
  { name: "Failed", value: 18, color: "hsl(var(--destructive))" },
  { name: "In Progress", value: 8, color: "hsl(var(--accent))" },
  { name: "Invited", value: 6, color: "hsl(var(--chart-5))" },
]

const chartConfig = {
  count: { label: "Candidates", color: "hsl(var(--primary))" },
  assessments: { label: "Assessments", color: "hsl(var(--primary))" },
  candidates: { label: "Candidates", color: "hsl(var(--secondary))" },
}

function AnalyticsContent() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Analytics</h1>
          <p className="text-muted-foreground">
            Insights and metrics for your assessments
          </p>
        </div>
        <Select defaultValue="30">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Candidates</p>
                <p className="mt-1 text-3xl font-bold">1,234</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <Badge className="bg-secondary/10 text-secondary">
                <TrendingUp className="mr-1 h-3 w-3" />
                +12.5%
              </Badge>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Score</p>
                <p className="mt-1 text-3xl font-bold">74%</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <Target className="h-6 w-6 text-accent" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <Badge className="bg-secondary/10 text-secondary">
                <TrendingUp className="mr-1 h-3 w-3" />
                +3.2%
              </Badge>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pass Rate</p>
                <p className="mt-1 text-3xl font-bold">68%</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                <Award className="h-6 w-6 text-secondary" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <Badge className="bg-destructive/10 text-destructive">
                <TrendingDown className="mr-1 h-3 w-3" />
                -2.1%
              </Badge>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Duration</p>
                <p className="mt-1 text-3xl font-bold">67m</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-5/10">
                <Clock className="h-6 w-6 text-chart-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <Badge className="bg-secondary/10 text-secondary">
                <TrendingDown className="mr-1 h-3 w-3" />
                -5 min
              </Badge>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Score Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Score Distribution</CardTitle>
            <CardDescription>Candidate scores across all assessments</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreDistribution}>
                  <XAxis dataKey="range" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="count"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>Assessments and candidates this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyActivity}>
                  <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="assessments"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="candidates"
                    stroke="hsl(var(--secondary))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Candidate Status</CardTitle>
            <CardDescription>Distribution of candidate outcomes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ChartContainer config={chartConfig} className="h-[250px] w-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {statusDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {item.name}: {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Skill Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Skill Performance</CardTitle>
            <CardDescription>Average scores by skill category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {skillPerformance.map((skill) => (
                <div key={skill.skill} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{skill.skill}</span>
                      <Badge variant="outline" className="text-xs">
                        {skill.candidates} candidates
                      </Badge>
                    </div>
                    <span className="text-sm font-medium">{skill.avgScore}%</span>
                  </div>
                  <Progress value={skill.avgScore} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <AnalyticsContent />
    </DashboardLayout>
  )
}
