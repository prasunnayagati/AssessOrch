"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Building2,
  FileText,
  TrendingUp,
  AlertTriangle,
  Activity,
  Server,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Link from "next/link";

const platformStats = {
  totalUsers: 12450,
  usersGrowth: 12.5,
  totalOrganizations: 156,
  orgsGrowth: 8.3,
  totalAssessments: 3240,
  assessmentsGrowth: 15.7,
  activeTests: 847,
  testsGrowth: -2.1,
};

const userGrowthData = [
  { month: "Jul", students: 8200, recruiters: 1100, admins: 45 },
  { month: "Aug", students: 8800, recruiters: 1200, admins: 48 },
  { month: "Sep", students: 9400, recruiters: 1350, admins: 50 },
  { month: "Oct", students: 10200, recruiters: 1500, admins: 52 },
  { month: "Nov", students: 11100, recruiters: 1680, admins: 55 },
  { month: "Dec", students: 12000, recruiters: 1850, admins: 58 },
  { month: "Jan", students: 12450, recruiters: 2010, admins: 62 },
];

const assessmentsByCategory = [
  { name: "Full Stack", value: 35 },
  { name: "Frontend", value: 25 },
  { name: "Backend", value: 20 },
  { name: "Data Science", value: 12 },
  { name: "DevOps", value: 8 },
];

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

const systemHealth = {
  apiLatency: 45,
  uptime: 99.97,
  errorRate: 0.12,
  activeConnections: 1247,
};

const recentActivity = [
  {
    id: 1,
    type: "user_signup",
    message: "New organization 'TechCorp Inc' registered",
    time: "5 min ago",
  },
  {
    id: 2,
    type: "assessment",
    message: "Assessment 'Senior React Developer' created by Acme Corp",
    time: "12 min ago",
  },
  {
    id: 3,
    type: "alert",
    message: "High proctoring violation rate detected in assessment #4521",
    time: "25 min ago",
  },
  {
    id: 4,
    type: "user_signup",
    message: "500 new student registrations today",
    time: "1 hour ago",
  },
  {
    id: 5,
    type: "system",
    message: "Database backup completed successfully",
    time: "2 hours ago",
  },
];

const topOrganizations = [
  { name: "TechCorp Inc", assessments: 245, candidates: 1820 },
  { name: "Acme Corp", assessments: 198, candidates: 1450 },
  { name: "StartupXYZ", assessments: 156, candidates: 980 },
  { name: "DevHouse", assessments: 134, candidates: 870 },
  { name: "CodeFactory", assessments: 112, candidates: 650 },
];

export default function AdminDashboardPage() {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Platform overview and management</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Export Report</Button>
            <Button>View All Alerts</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{platformStats.totalUsers.toLocaleString()}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-500">+{platformStats.usersGrowth}%</span>
                    <span className="text-xs text-muted-foreground">vs last month</span>
                  </div>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Organizations</p>
                  <p className="text-2xl font-bold">{platformStats.totalOrganizations}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-500">+{platformStats.orgsGrowth}%</span>
                    <span className="text-xs text-muted-foreground">vs last month</span>
                  </div>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Assessments</p>
                  <p className="text-2xl font-bold">{platformStats.totalAssessments.toLocaleString()}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-500">+{platformStats.assessmentsGrowth}%</span>
                    <span className="text-xs text-muted-foreground">vs last month</span>
                  </div>
                </div>
                <div className="p-3 bg-amber-100 rounded-lg">
                  <FileText className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Tests</p>
                  <p className="text-2xl font-bold">{platformStats.activeTests}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-red-500">{platformStats.testsGrowth}%</span>
                    <span className="text-xs text-muted-foreground">vs last hour</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="students"
                      stroke="#4F46E5"
                      strokeWidth={2}
                      dot={false}
                      name="Students"
                    />
                    <Line
                      type="monotone"
                      dataKey="recruiters"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={false}
                      name="Recruiters"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-sm text-muted-foreground">Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-secondary" />
                  <span className="text-sm text-muted-foreground">Recruiters</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assessments by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={assessmentsByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {assessmentsByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {assessmentsByCategory.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {item.name} ({item.value}%)
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm">API Latency</span>
                </div>
                <span className="font-mono text-sm">{systemHealth.apiLatency}ms</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm">Uptime</span>
                </div>
                <span className="font-mono text-sm">{systemHealth.uptime}%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm">Error Rate</span>
                </div>
                <span className="font-mono text-sm">{systemHealth.errorRate}%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-sm">Active Connections</span>
                </div>
                <span className="font-mono text-sm">{systemHealth.activeConnections}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Activity</CardTitle>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        activity.type === "alert"
                          ? "bg-red-100"
                          : activity.type === "user_signup"
                          ? "bg-green-100"
                          : activity.type === "assessment"
                          ? "bg-blue-100"
                          : "bg-muted"
                      }`}
                    >
                      {activity.type === "alert" ? (
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      ) : activity.type === "user_signup" ? (
                        <Users className="h-4 w-4 text-green-600" />
                      ) : activity.type === "assessment" ? (
                        <FileText className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Server className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm truncate">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Top Organizations</CardTitle>
                <Link href="/admin/organizations">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topOrganizations.map((org, index) => (
                  <div key={org.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground font-mono w-5">
                        {index + 1}.
                      </span>
                      <div>
                        <p className="text-sm font-medium">{org.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {org.candidates.toLocaleString()} candidates
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">{org.assessments} tests</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
