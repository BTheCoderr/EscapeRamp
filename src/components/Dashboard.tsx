"use client"

import type React from "react"

import { useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LayoutDashboard,
  MoveIcon as Migration,
  Upload,
  Cloud,
  Bot,
  Settings,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  History,
  DollarSign,
  Users,
  TrendingUp,
  Filter,
  Download,
  Eye,
  MessageSquare,
  Phone,
  Star,
  Zap,
  Shield,
  Palette,
  Bell,
  Search,
  PieChart,
  LineChart,
} from "lucide-react"

type NavigationItem = {
  title: string
  icon: React.ComponentType<any>
  id: string
  badge?: string
}

const navigationItems: NavigationItem[] = [
  { title: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
  { title: "My Migration", icon: Migration, id: "migration" },
  { title: "Upload Files", icon: Upload, id: "upload" },
  { title: "Connect Cloud App", icon: Cloud, id: "connect" },
  { title: "AI Assistant", icon: Bot, id: "assistant", badge: "Smart" },
  { title: "Analytics & Reports", icon: BarChart3, id: "analytics", badge: "New" },
  { title: "Audit Trail", icon: History, id: "audit" },
  { title: "Pricing & Billing", icon: DollarSign, id: "pricing" },
  { title: "Settings", icon: Settings, id: "settings" },
]

function AppSidebar({ activeItem, setActiveItem }: { activeItem: string; setActiveItem: (item: string) => void }) {
  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">ER</span>
          </div>
          <div>
            <span className="font-bold text-lg">Escape Ramp</span>
            <p className="text-xs text-muted-foreground">Migration Made Simple</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveItem(item.id)}
                    isActive={activeItem === item.id}
                    className="w-full justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </div>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                        {item.badge}
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3 p-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">John Doe</p>
            <p className="text-xs text-muted-foreground truncate">john@company.com</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

function DashboardView() {
  const [customizations, setCustomizations] = useState({
    showWelcome: true,
    showProgress: true,
    showSummary: true,
    showSpecialist: true,
  })

  return (
    <div className="space-y-6">
      {/* Customizable Welcome Banner */}
      {customizations.showWelcome && (
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 text-green-700 hover:text-green-800"
            onClick={() => setCustomizations((prev) => ({ ...prev, showWelcome: false }))}
          >
            ×
          </Button>
          <CardHeader>
            <CardTitle className="text-2xl text-green-800 flex items-center gap-2">
              <Zap className="w-6 h-6" />
              Welcome to Escape Ramp
            </CardTitle>
            <CardDescription className="text-green-700">
              Your migration from QuickBooks Desktop to the cloud is in progress. Unlike QB's cluttered interface,
              everything here is designed for simplicity and clarity.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Migration Specialist Assignment */}
      {customizations.showSpecialist && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Users className="w-5 h-5" />
              Your Migration Specialist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src="/placeholder.svg?height=64&width=64" />
                <AvatarFallback>SM</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Sarah Mitchell</h3>
                <p className="text-sm text-muted-foreground">Senior Migration Specialist • 5+ years experience</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">4.9/5 rating</span>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Online Now</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Chat
                </Button>
                <Button size="sm" variant="outline">
                  <Phone className="w-4 h-4 mr-1" />
                  Call
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Migration Progress */}
      {customizations.showProgress && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Migration className="w-5 h-5 text-green-600" />
                Real-Time Migration Progress
              </div>
              <Badge className="bg-blue-100 text-blue-700">Live Updates</Badge>
            </CardTitle>
            <CardDescription>
              Unlike QuickBooks' limited progress tracking, see exactly where your data is in real-time
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">65% Complete • Est. 2 days remaining</span>
            </div>
            <Progress value={65} className="h-3" />

            {/* Detailed Pipeline Steps */}
            <div className="space-y-3">
              {[
                { step: "Data Export", status: "completed", time: "2 hours ago" },
                { step: "Data Validation", status: "completed", time: "1 hour ago" },
                { step: "Chart of Accounts Mapping", status: "in-progress", time: "Currently processing" },
                { step: "Transaction Import", status: "pending", time: "Next" },
                { step: "Final Testing", status: "pending", time: "Final step" },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      item.status === "completed"
                        ? "bg-green-100 text-green-600"
                        : item.status === "in-progress"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {item.status === "completed" ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : item.status === "in-progress" ? (
                      <Clock className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.step}</p>
                    <p className="text-sm text-muted-foreground">{item.time}</p>
                  </div>
                  {item.status === "completed" && (
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Summary Cards */}
      {customizations.showSummary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Software</p>
                  <p className="font-semibold">QuickBooks Desktop</p>
                  <p className="text-xs text-muted-foreground">Version 2023 • 15GB data</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Cloud className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Target Platform</p>
                  <p className="font-semibold">QuickBooks Online</p>
                  <p className="text-xs text-muted-foreground">Plus Plan • $30/month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time Saved</p>
                  <p className="font-semibold">40+ Hours</p>
                  <p className="text-xs text-muted-foreground">vs. manual migration</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cost Savings</p>
                  <p className="font-semibold">$2,400/year</p>
                  <p className="text-xs text-muted-foreground">vs. QB Desktop fees</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Dashboard Customization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-600" />
            Customize Your Dashboard
          </CardTitle>
          <CardDescription>Unlike QuickBooks' rigid layout, personalize your experience</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(customizations).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium capitalize">
                  {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                </span>
                <Switch
                  checked={value}
                  onCheckedChange={(checked) => setCustomizations((prev) => ({ ...prev, [key]: checked }))}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AnalyticsView() {
  const [timeRange, setTimeRange] = useState("30d")
  const [reportType, setReportType] = useState("overview")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics & Reports</h1>
          <p className="text-muted-foreground">
            Rich visualizations and insights - far beyond QuickBooks' basic reports
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Interactive Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Revenue Trends
            </CardTitle>
            <CardDescription>Interactive revenue visualization with drill-down capabilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <LineChart className="w-16 h-16 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Interactive Revenue Chart</p>
                <p className="text-xs text-muted-foreground">Click segments to drill down</p>
              </div>
            </div>
            <div className="flex justify-between mt-4 text-sm">
              <div className="text-center">
                <p className="font-semibold text-green-600">↑ 23%</p>
                <p className="text-muted-foreground">vs. last period</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">$45,230</p>
                <p className="text-muted-foreground">This period</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-blue-600">$52,100</p>
                <p className="text-muted-foreground">Projected</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-600" />
              Expense Breakdown
            </CardTitle>
            <CardDescription>Smart categorization with custom filters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <PieChart className="w-16 h-16 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Interactive Expense Breakdown</p>
                <p className="text-xs text-muted-foreground">Hover for details</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm">Office Supplies (32%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Marketing (28%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Software (25%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm">Other (15%)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            Advanced Filters & Segmentation
          </CardTitle>
          <CardDescription>Powerful filtering that actually works - unlike QuickBooks' clunky system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Customer Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                <SelectItem value="new">New Customers</SelectItem>
                <SelectItem value="returning">Returning</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Product Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="services">Services</SelectItem>
                <SelectItem value="products">Products</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Payment Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="card">Credit Card</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-green-600 hover:bg-green-700">Apply Filters</Button>
          </div>
        </CardContent>
      </Card>

      {/* Custom Report Builder */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Report Builder</CardTitle>
          <CardDescription>
            Build exactly the reports you need - no more being stuck with QB's limited options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={reportType} onValueChange={setReportType}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="customer">Customer</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Profit & Loss</h3>
                  <p className="text-sm text-muted-foreground mb-3">Interactive P&L with drill-down capabilities</p>
                  <Button size="sm" className="w-full">
                    Generate Report
                  </Button>
                </Card>
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Cash Flow</h3>
                  <p className="text-sm text-muted-foreground mb-3">Visual cash flow projections and trends</p>
                  <Button size="sm" className="w-full">
                    Generate Report
                  </Button>
                </Card>
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Balance Sheet</h3>
                  <p className="text-sm text-muted-foreground mb-3">Real-time balance sheet with comparisons</p>
                  <Button size="sm" className="w-full">
                    Generate Report
                  </Button>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function AuditTrailView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  const auditEntries = [
    {
      id: 1,
      action: "Transaction Modified",
      user: "Sarah Mitchell (Specialist)",
      details: "Updated invoice #INV-001 amount from $1,200 to $1,250",
      timestamp: "2024-01-15 14:30:22",
      type: "modification",
      before: "$1,200.00",
      after: "$1,250.00",
    },
    {
      id: 2,
      action: "Chart of Accounts Updated",
      user: "John Doe (You)",
      details: "Added new account: Marketing Expenses (6200)",
      timestamp: "2024-01-15 13:15:10",
      type: "creation",
      before: null,
      after: "Account 6200 created",
    },
    {
      id: 3,
      action: "Data Import",
      user: "System",
      details: "Imported 1,247 transactions from QuickBooks Desktop",
      timestamp: "2024-01-15 10:00:00",
      type: "import",
      before: "0 transactions",
      after: "1,247 transactions",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Complete Audit Trail</h1>
        <p className="text-muted-foreground">
          Full transparency and version control - everything QuickBooks Desktop lacks
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search audit trail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Changes</SelectItem>
                <SelectItem value="modification">Modifications</SelectItem>
                <SelectItem value="creation">Creations</SelectItem>
                <SelectItem value="deletion">Deletions</SelectItem>
                <SelectItem value="import">Imports</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Entries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            Recent Changes
          </CardTitle>
          <CardDescription>Every change is tracked with full before/after details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {auditEntries.map((entry) => (
              <div key={entry.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant={
                          entry.type === "modification"
                            ? "default"
                            : entry.type === "creation"
                              ? "secondary"
                              : entry.type === "import"
                                ? "outline"
                                : "destructive"
                        }
                      >
                        {entry.action}
                      </Badge>
                      <span className="text-sm text-muted-foreground">by {entry.user}</span>
                    </div>
                    <p className="text-sm mb-2">{entry.details}</p>
                    <p className="text-xs text-muted-foreground">{entry.timestamp}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>

                {/* Before/After Comparison */}
                {entry.before && entry.after && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-red-600 mb-1">Before:</p>
                        <p className="bg-red-50 p-2 rounded text-red-800">{entry.before}</p>
                      </div>
                      <div>
                        <p className="font-medium text-green-600 mb-1">After:</p>
                        <p className="bg-green-50 p-2 rounded text-green-800">{entry.after}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Version Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            Data Version Control
          </CardTitle>
          <CardDescription>Rollback capabilities and data snapshots - never lose your work</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Daily Snapshots</h3>
              <p className="text-sm text-muted-foreground mb-3">Automatic daily backups of all your data</p>
              <Button size="sm" variant="outline" className="w-full bg-transparent">
                View Snapshots
              </Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Change Rollback</h3>
              <p className="text-sm text-muted-foreground mb-3">Undo any change with one click</p>
              <Button size="sm" variant="outline" className="w-full bg-transparent">
                Rollback Changes
              </Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Data Recovery</h3>
              <p className="text-sm text-muted-foreground mb-3">Restore from any point in time</p>
              <Button size="sm" variant="outline" className="w-full bg-transparent">
                Recovery Options
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function PricingView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Transparent Pricing</h1>
        <p className="text-muted-foreground">No hidden fees, no annual price hikes - everything QuickBooks should be</p>
      </div>

      {/* Current Plan */}
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckCircle className="w-5 h-5" />
            Your Current Plan: Complete Migration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-800">$497</p>
              <p className="text-sm text-green-700">One-time flat fee • No surprises</p>
            </div>
            <Badge className="bg-green-100 text-green-700">Active</Badge>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm">Complete data migration</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm">Dedicated specialist</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm">30-day support included</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm">Data validation & cleanup</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Comparison: Escape Ramp vs. QuickBooks</CardTitle>
          <CardDescription>See how much you'll save by switching from QuickBooks Desktop</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* QuickBooks Costs */}
            <div className="p-4 border rounded-lg bg-red-50">
              <h3 className="font-semibold text-red-800 mb-4">QuickBooks Desktop (Annual)</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Software License</span>
                  <span className="font-semibold">$549.99</span>
                </div>
                <div className="flex justify-between">
                  <span>Payroll Add-on</span>
                  <span className="font-semibold">$1,800.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Support Plan</span>
                  <span className="font-semibold">$599.99</span>
                </div>
                <div className="flex justify-between">
                  <span>IT Maintenance</span>
                  <span className="font-semibold">$1,200.00</span>
                </div>
                <hr className="border-red-200" />
                <div className="flex justify-between font-bold text-red-800">
                  <span>Total Annual Cost</span>
                  <span>$4,149.98</span>
                </div>
              </div>
            </div>

            {/* Cloud Solution Costs */}
            <div className="p-4 border rounded-lg bg-green-50">
              <h3 className="font-semibold text-green-800 mb-4">Cloud Solution (Annual)</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>QuickBooks Online Plus</span>
                  <span className="font-semibold">$360.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Payroll (included)</span>
                  <span className="font-semibold">$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Support (included)</span>
                  <span className="font-semibold">$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span>IT Maintenance</span>
                  <span className="font-semibold">$0.00</span>
                </div>
                <hr className="border-green-200" />
                <div className="flex justify-between font-bold text-green-800">
                  <span>Total Annual Cost</span>
                  <span>$360.00</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center">
            <p className="text-lg font-semibold text-blue-800">Annual Savings: $3,789.98</p>
            <p className="text-sm text-blue-700">Your migration pays for itself in just 6 weeks!</p>
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>Track all payments and invoices in one place</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { date: "2024-01-15", description: "Migration Service", amount: "$497.00", status: "Paid" },
              { date: "2024-01-10", description: "Initial Consultation", amount: "$0.00", status: "Complimentary" },
            ].map((payment, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{payment.description}</p>
                  <p className="text-sm text-muted-foreground">{payment.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{payment.amount}</p>
                  <Badge variant={payment.status === "Paid" ? "default" : "secondary"}>{payment.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function UploadFilesView() {
  return (
    <div>
      <h1>Upload Files View</h1>
      {/* Placeholder for Upload Files View */}
    </div>
  )
}

function ConnectCloudAppView() {
  return (
    <div>
      <h1>Connect Cloud App View</h1>
      {/* Placeholder for Connect Cloud App View */}
    </div>
  )
}

function AIAssistantView() {
  return (
    <div>
      <h1>AI Assistant View</h1>
      {/* Placeholder for AI Assistant View */}
    </div>
  )
}

function SettingsView() {
  return (
    <div>
      <h1>Settings View</h1>
      {/* Placeholder for Settings View */}
    </div>
  )
}

export default function Dashboard() {
  const [activeItem, setActiveItem] = useState("dashboard")

  const renderContent = () => {
    switch (activeItem) {
      case "dashboard":
        return <DashboardView />
      case "migration":
        return <DashboardView />
      case "upload":
        return <UploadFilesView />
      case "connect":
        return <ConnectCloudAppView />
      case "assistant":
        return <AIAssistantView />
      case "analytics":
        return <AnalyticsView />
      case "audit":
        return <AuditTrailView />
      case "pricing":
        return <PricingView />
      case "settings":
        return <SettingsView />
      default:
        return <DashboardView />
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50/30">
        <AppSidebar activeItem={activeItem} setActiveItem={setActiveItem} />
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                Need Help?
              </Button>
            </div>
          </header>
          <main className="flex-1 p-6">{renderContent()}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
} 