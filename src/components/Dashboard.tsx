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
import { AIAssistant } from "./AIAssistant"
import { DocumentUpload } from "./DocumentUpload"
import { HistoricalDataTracker } from "./HistoricalDataTracker"

type NavigationItem = {
  title: string
  icon: React.ComponentType<{ className?: string }>
  id: string
  badge?: string
}

const navigationItems: NavigationItem[] = [
  { title: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
  { title: "My Migration", icon: Migration, id: "migration" }, // Will be handled in renderContent
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
                    isActive={activeItem === item.id || (item.id === "migration" && activeItem === "dashboard")}
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
              Your migration from QuickBooks Desktop to the cloud is in progress. Unlike QB&apos;s cluttered interface,
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
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    // Open chat interface or redirect to AI Assistant
                    window.open('/?tab=assistant', '_blank');
                  }}
                >
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Chat
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    // Open phone call or schedule call
                    window.open('tel:+1-800-ESCAPE-RAMP', '_blank');
                  }}
                >
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
              Unlike QuickBooks&apos; limited progress tracking, see exactly where your data is in real-time
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
          <CardDescription>Unlike QuickBooks&apos; rigid layout, personalize your experience</CardDescription>
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
            Rich visualizations and insights - far beyond QuickBooks&apos; basic reports
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
          <Button
            onClick={() => {
              // Generate and download report
              const reportData = {
                timeRange,
                reportType,
                generatedAt: new Date().toISOString(),
                data: {
                  revenue: "$45,230",
                  expenses: "$12,450",
                  profit: "$32,780",
                  growth: "23%"
                }
              };
              
              const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `escape-ramp-report-${timeRange}-${new Date().toISOString().split('T')[0]}.json`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
              
              alert('Report exported successfully!');
            }}
          >
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
          <CardDescription>Powerful filtering that actually works - unlike QuickBooks&apos; clunky system</CardDescription>
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
            Build exactly the reports you need - no more being stuck with QB&apos;s limited options
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
  return <HistoricalDataTracker />
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
          <CardDescription>See how much you&apos;ll save by switching from QuickBooks Desktop</CardDescription>
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
  return <DocumentUpload />
}

function ConnectCloudAppView() {
  const [selectedApp, setSelectedApp] = useState<string>("")
  const [connectionStatus, setConnectionStatus] = useState<Record<string, string>>({})

  const cloudApps = [
    {
      id: "quickbooks-online",
      name: "QuickBooks Online",
      description: "Connect to your existing QuickBooks Online account",
      icon: "💼",
      status: "connected",
      lastSync: "2 hours ago"
    },
    {
      id: "xero",
      name: "Xero",
      description: "Popular cloud accounting for small businesses",
      icon: "📊",
      status: "available",
      lastSync: null
    },
    {
      id: "freshbooks",
      name: "FreshBooks",
      description: "Simple invoicing and time tracking",
      icon: "⏰",
      status: "available",
      lastSync: null
    },
    {
      id: "wave",
      name: "Wave",
      description: "Free accounting software for small businesses",
      icon: "🌊",
      status: "available",
      lastSync: null
    },
    {
      id: "sage-intacct",
      name: "Sage Intacct",
      description: "Advanced cloud ERP for growing companies",
      icon: "📈",
      status: "available",
      lastSync: null
    }
  ]

  const handleConnect = (appId: string) => {
    setConnectionStatus(prev => ({ ...prev, [appId]: "connecting" }))
    // Simulate connection process
    setTimeout(() => {
      setConnectionStatus(prev => ({ ...prev, [appId]: "connected" }))
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Connect Cloud App</h1>
          <p className="text-muted-foreground mt-2">
            Choose your destination cloud accounting platform. We&apos;ll handle the migration seamlessly.
          </p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Cloud className="w-4 h-4" />
          View All Integrations
        </Button>
      </div>

      {/* Connection Status */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <CheckCircle className="w-5 h-5" />
            Current Connection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">
              💼
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">QuickBooks Online</h3>
              <p className="text-sm text-muted-foreground">Connected • Last sync: 2 hours ago</p>
            </div>
            <Badge className="bg-green-100 text-green-700">Connected</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Available Apps Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Cloud Platforms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cloudApps.map((app) => (
            <Card key={app.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                    {app.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{app.name}</CardTitle>
                    <CardDescription>{app.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge 
                      variant={app.status === "connected" ? "default" : "secondary"}
                      className={app.status === "connected" ? "bg-green-100 text-green-700" : ""}
                    >
                      {app.status === "connected" ? "Connected" : "Available"}
                    </Badge>
                  </div>
                  
                  {app.lastSync && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Last Sync:</span>
                      <span className="text-sm">{app.lastSync}</span>
                    </div>
                  )}
                  
                  <Button 
                    className="w-full" 
                    variant={app.status === "connected" ? "outline" : "default"}
                    disabled={app.status === "connected" || connectionStatus[app.id] === "connecting"}
                    onClick={() => {
                      if (app.status === "connected") {
                        // Show connection details
                        alert(`${app.name} is already connected. Last sync: ${app.lastSync}`);
                      } else {
                        handleConnect(app.id);
                      }
                    }}
                  >
                    {connectionStatus[app.id] === "connecting" ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Connecting...
                      </>
                    ) : app.status === "connected" ? (
                      "Connected"
                    ) : (
                      "Connect"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Migration Benefits */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Zap className="w-5 h-5" />
            Why Migrate to Cloud?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-1">Automatic Backups</h3>
              <p className="text-sm text-muted-foreground">Your data is automatically backed up and secure</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-1">Team Collaboration</h3>
              <p className="text-sm text-muted-foreground">Multiple users can access and work simultaneously</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-1">Real-time Updates</h3>
              <p className="text-sm text-muted-foreground">Always have the latest features and security updates</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AIAssistantView() {
  return <AIAssistant />
}

function SettingsView() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    weeklyReports: true,
    migrationUpdates: true
  })

  const [preferences, setPreferences] = useState({
    theme: "light",
    language: "en",
    timezone: "America/New_York",
    currency: "USD"
  })

  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: "24h",
    loginNotifications: true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account preferences, notifications, and security settings.
        </p>
      </div>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Avatar className="w-5 h-5" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src="/placeholder.svg?height=64&width=64" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold">John Doe</h3>
              <p className="text-muted-foreground">john@company.com</p>
              <p className="text-sm text-muted-foreground">Member since January 2024</p>
            </div>
            <Button variant="outline">Edit Profile</Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Choose how you want to receive updates about your migration.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
              <Switch 
                checked={notifications.email} 
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Get real-time updates in your browser</p>
              </div>
              <Switch 
                checked={notifications.push} 
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">SMS Notifications</p>
                <p className="text-sm text-muted-foreground">Receive text messages for urgent updates</p>
              </div>
              <Switch 
                checked={notifications.sms} 
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sms: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Weekly Reports</p>
                <p className="text-sm text-muted-foreground">Get a summary of your migration progress</p>
              </div>
              <Switch 
                checked={notifications.weeklyReports} 
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, weeklyReports: checked }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Theme</label>
              <Select value={preferences.theme} onValueChange={(value) => setPreferences(prev => ({ ...prev, theme: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Language</label>
              <Select value={preferences.language} onValueChange={(value) => setPreferences(prev => ({ ...prev, language: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Timezone</label>
              <Select value={preferences.timezone} onValueChange={(value) => setPreferences(prev => ({ ...prev, timezone: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="America/Chicago">Central Time</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Currency</label>
              <Select value={preferences.currency} onValueChange={(value) => setPreferences(prev => ({ ...prev, currency: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="CAD">CAD (C$)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
              </div>
              <Switch 
                checked={security.twoFactor} 
                onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, twoFactor: checked }))}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Session Timeout</label>
              <Select value={security.sessionTimeout} onValueChange={(value) => setSecurity(prev => ({ ...prev, sessionTimeout: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1 hour</SelectItem>
                  <SelectItem value="8h">8 hours</SelectItem>
                  <SelectItem value="24h">24 hours</SelectItem>
                  <SelectItem value="7d">7 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Login Notifications</p>
                <p className="text-sm text-muted-foreground">Get notified when someone logs into your account</p>
              </div>
              <Switch 
                checked={security.loginNotifications} 
                onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, loginNotifications: checked }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button 
          onClick={() => {
            // Save settings to localStorage or API
            localStorage.setItem('escapeRampSettings', JSON.stringify({
              notifications,
              preferences,
              security
            }));
            alert('Settings saved successfully!');
          }}
        >
          Save Changes
        </Button>
        <Button 
          variant="outline"
          onClick={() => {
            // Reset to default settings
            setNotifications({
              email: true,
              push: false,
              sms: false,
              weeklyReports: true,
              migrationUpdates: true
            });
            setPreferences({
              theme: "light",
              language: "en",
              timezone: "America/New_York",
              currency: "USD"
            });
            setSecurity({
              twoFactor: false,
              sessionTimeout: "24h",
              loginNotifications: true
            });
            alert('Settings reset to defaults!');
          }}
        >
          Reset to Defaults
        </Button>
        <Button 
          variant="destructive"
          onClick={() => {
            if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
              // Handle account deletion
              alert('Account deletion requested. Please contact support for assistance.');
            }
          }}
        >
          Delete Account
        </Button>
      </div>
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
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  // Open help modal or redirect to support
                  const helpOptions = [
                    'Chat with AI Assistant',
                    'Contact Migration Specialist',
                    'View Documentation',
                    'Schedule a Call'
                  ];
                  
                  const choice = prompt(`How can we help you?\n\n${helpOptions.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}\n\nEnter a number (1-4):`);
                  
                  switch(choice) {
                    case '1':
                      // Navigate to AI Assistant
                      window.location.href = '/?tab=assistant';
                      break;
                    case '2':
                      // Show specialist contact info
                      alert('Contact Sarah Mitchell:\nEmail: sarah@escaperamp.com\nPhone: +1-800-ESCAPE-RAMP');
                      break;
                    case '3':
                      // Open documentation
                      window.open('https://docs.escaperamp.com', '_blank');
                      break;
                    case '4':
                      // Schedule call
                      window.open('https://calendly.com/escaperamp/consultation', '_blank');
                      break;
                    default:
                      alert('Please select a valid option.');
                  }
                }}
              >
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