"use client";

import * as React from "react";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Calendar,
  Download,
  Eye,
  Filter,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { reportsRepo } from "@/lib/mock/repository";
import { formatCurrency } from "@/lib/mock/currency";
import { formatDate } from "@/lib/mock/format";
import { DashboardStats } from "@/lib/mock/types";

export default function ReportsPage() {
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [period, setPeriod] = React.useState("this-month");

  React.useEffect(() => {
    const loadReportsData = async () => {
      try {
        const dashboardStats = await reportsRepo.getDashboardStats();
        setStats(dashboardStats);
      } catch (error) {
        console.error("Failed to load reports data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReportsData();
  }, []);

  const reportCards = [
    {
      title: "Profit & Loss",
      description: "Income and expenses breakdown",
      icon: <TrendingUp className="h-5 w-5" />,
      value: stats ? formatCurrency(stats.netProfit) : "—",
      change: stats?.profitChange,
      href: "/reports/profit-loss",
      color: "blue",
    },
    {
      title: "Balance Sheet",
      description: "Assets, liabilities, and equity",
      icon: <BarChart3 className="h-5 w-5" />,
      value: stats ? formatCurrency(stats.cashOnHand) : "—",
      href: "/reports/balance-sheet",
      color: "green",
    },
    {
      title: "Cash Flow",
      description: "Cash movement over time",
      icon: <DollarSign className="h-5 w-5" />,
      value: stats ? formatCurrency(stats.monthlyRevenue - stats.monthlyExpenses) : "—",
      change: stats?.revenueChange,
      href: "/reports/cash-flow",
      color: "purple",
    },
    {
      title: "Accounts Receivable",
      description: "Outstanding customer invoices",
      icon: <FileText className="h-5 w-5" />,
      value: stats ? formatCurrency(stats.accountsReceivable) : "—",
      href: "/reports/accounts-receivable",
      color: "orange",
    },
    {
      title: "Accounts Payable",
      description: "Outstanding vendor bills",
      icon: <FileText className="h-5 w-5" />,
      value: stats ? formatCurrency(stats.accountsPayable) : "—",
      href: "/reports/accounts-payable",
      color: "red",
    },
    {
      title: "Sales Tax",
      description: "Tax collected and owed",
      icon: <Calendar className="h-5 w-5" />,
      value: "—",
      href: "/reports/sales-tax",
      color: "gray",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Financial reports and business insights.
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-40" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-4 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Financial reports and business insights.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="this-quarter">This Quarter</SelectItem>
              <SelectItem value="last-quarter">Last Quarter</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
              <SelectItem value="last-year">Last Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-tabular">
              {stats ? formatCurrency(stats.monthlyRevenue) : "—"}
            </div>
            {stats && stats.revenueChange !== undefined && (
              <p className={`text-xs ${
                stats.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {stats.revenueChange >= 0 ? '+' : ''}{stats.revenueChange.toFixed(1)}% from last month
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-tabular">
              {stats ? formatCurrency(stats.monthlyExpenses) : "—"}
            </div>
            {stats && stats.expenseChange !== undefined && (
              <p className={`text-xs ${
                stats.expenseChange <= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {stats.expenseChange >= 0 ? '+' : ''}{stats.expenseChange.toFixed(1)}% from last month
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-tabular">
              {stats ? formatCurrency(stats.netProfit) : "—"}
            </div>
            {stats && stats.profitChange !== undefined && (
              <p className={`text-xs ${
                stats.profitChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {stats.profitChange >= 0 ? '+' : ''}{stats.profitChange.toFixed(1)}% from last month
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Balance</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-tabular">
              {stats ? formatCurrency(stats.cashOnHand) : "—"}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all accounts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Report Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reportCards.map((report) => (
          <Card key={report.title} className="group cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg bg-${report.color}-100 text-${report.color}-600 dark:bg-${report.color}-900 dark:text-${report.color}-300`}>
                    {report.icon}
                  </div>
                  <div>
                    <CardTitle className="text-base">{report.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {report.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-2xl font-bold font-tabular">
                  {report.value}
                </div>
                {report.change !== undefined && (
                  <p className={`text-sm ${
                    report.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {report.change >= 0 ? '+' : ''}{report.change.toFixed(1)}% from last period
                  </p>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common reporting tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              Year-End Close
            </Button>
            <Button variant="outline" className="justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Tax Summary
            </Button>
            <Button variant="outline" className="justify-start">
              <Download className="mr-2 h-4 w-4" />
              Export to Excel
            </Button>
            <Button variant="outline" className="justify-start">
              <Filter className="mr-2 h-4 w-4" />
              Custom Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
