'use client';

import { useEffect, useState } from 'react';
import {
	Building2,
	DollarSign,
	TrendingDown,
	TrendingUp,
	Users,
	Receipt,
	FileText,
	CreditCard,
	Clock,
	Plus,
} from 'lucide-react';

import { StatCard } from '@/components/ui/stat-card';
import { CashFlowChart } from '@/components/charts/cash-flow-chart';
import { ExpenseBreakdown } from '@/components/charts/expense-breakdown';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

import {
	reportsRepo,
	transactionsRepo,
	invoicesRepo,
	billsRepo,
} from '@/lib/mock/repository';
import { formatDate, formatRelativeTime } from '@/lib/mock/format';
import { formatCurrency } from '@/lib/mock/currency';
import { DashboardStats, Transaction, Invoice, Bill } from '@/lib/mock/types';

export default function DashboardPage() {
	const [stats, setStats] = useState<DashboardStats | null>(null);
	const [recentActivity, setRecentActivity] = useState<Array<{
		id: string;
		type: 'transaction' | 'invoice' | 'bill';
		title: string;
		subtitle: string;
		amount: number;
		date: Date;
		status?: string;
	}> | null>(null);
	const [cashFlowPeriod, setCashFlowPeriod] = useState<'30' | '90' | '365'>(
		'30'
	);
	const [loading, setLoading] = useState(true);

	// Mock cash flow data generator
	const generateCashFlowData = (days: number) => {
		const data = [];
		const now = new Date();

		for (let i = days - 1; i >= 0; i--) {
			const date = new Date(now);
			date.setDate(date.getDate() - i);

			const inflow = Math.random() * 5000 + 2000;
			const outflow = Math.random() * 4000 + 1500;

			data.push({
				date: date.toISOString(),
				inflow,
				outflow,
				net: inflow - outflow,
			});
		}

		return data;
	};

	// Mock expense data
	const expenseData = [
		{ category: 'Office Supplies', amount: 1250, color: 'hsl(var(--chart-1))' },
		{ category: 'Marketing', amount: 2800, color: 'hsl(var(--chart-2))' },
		{
			category: 'Professional Services',
			amount: 1900,
			color: 'hsl(var(--chart-3))',
		},
		{ category: 'Rent', amount: 3500, color: 'hsl(var(--chart-4))' },
		{ category: 'Utilities', amount: 650, color: 'hsl(var(--chart-5))' },
	];

	useEffect(() => {
		const loadDashboardData = async () => {
			try {
				const [
					dashboardStats,
					transactionsResult,
					invoicesResult,
					billsResult,
				] = await Promise.all([
					reportsRepo.getDashboardStats(),
					transactionsRepo.list({ limit: 10 }),
					invoicesRepo.list({ limit: 5 }),
					billsRepo.list({ limit: 5 }),
				]);

				setStats(dashboardStats);

				// Combine recent activity
				const activity = [
					...transactionsResult.data.slice(0, 3).map((t) => ({
						id: t.id,
						type: 'transaction' as const,
						title: t.description,
						subtitle: t.account?.name || 'Unknown Account',
						amount: t.amount,
						date: t.date,
						status: t.status,
					})),
					...invoicesResult.data.slice(0, 2).map((i) => ({
						id: i.id,
						type: 'invoice' as const,
						title: `Invoice ${i.number}`,
						subtitle: i.customer?.name || 'Unknown Customer',
						amount: i.total,
						date: i.issueDate,
						status: i.status,
					})),
					...billsResult.data.slice(0, 2).map((b) => ({
						id: b.id,
						type: 'bill' as const,
						title: `Bill ${b.number}`,
						subtitle: b.vendor?.name || 'Unknown Vendor',
						amount: b.total,
						date: b.issueDate,
						status: b.status,
					})),
				]
					.sort((a, b) => b.date.getTime() - a.date.getTime())
					.slice(0, 8);

				setRecentActivity(activity);
			} catch (error) {
				console.error('Failed to load dashboard data:', error);
			} finally {
				setLoading(false);
			}
		};

		loadDashboardData();
	}, []);

	const getActivityIcon = (type: string) => {
		switch (type) {
			case 'transaction':
				return <CreditCard className="h-4 w-4" />;
			case 'invoice':
				return <FileText className="h-4 w-4" />;
			case 'bill':
				return <Receipt className="h-4 w-4" />;
			default:
				return <FileText className="h-4 w-4" />;
		}
	};

	const getStatusBadge = (status: string, type: string) => {
		const getStatusColor = () => {
			switch (status) {
				case 'paid':
				case 'cleared':
				case 'reconciled':
					return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
				case 'pending':
				case 'draft':
					return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
				case 'overdue':
					return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
				case 'sent':
				case 'viewed':
				case 'scheduled':
					return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
				default:
					return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
			}
		};

		return (
			<Badge variant="secondary" className={getStatusColor()}>
				{status}
			</Badge>
		);
	};

	if (loading) {
		return (
			<div className="space-y-4">
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					{Array.from({ length: 6 }).map((_, i) => (
						<Card key={i}>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-4 w-4" />
							</CardHeader>
							<CardContent>
								<Skeleton className="h-8 w-20 mb-2" />
								<Skeleton className="h-3 w-32" />
							</CardContent>
						</Card>
					))}
				</div>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
					<Card className="col-span-4">
						<CardHeader>
							<Skeleton className="h-6 w-32" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-80 w-full" />
						</CardContent>
					</Card>
					<Card className="col-span-3">
						<CardHeader>
							<Skeleton className="h-6 w-32" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-80 w-full" />
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
					<p className="text-muted-foreground">
						Welcome back! Here's an overview of your business.
					</p>
				</div>
				<div className="flex gap-2">
					<Button>
						<Plus className="mr-2 h-4 w-4" />
						New Invoice
					</Button>
				</div>
			</div>

			{/* KPI Cards */}
			{stats && (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					<StatCard
						title="Cash on Hand"
						value={stats.cashOnHand}
						icon={<DollarSign className="h-4 w-4" />}
					/>
					<StatCard
						title="Monthly Revenue"
						value={stats.monthlyRevenue}
						change={stats.revenueChange}
						icon={<TrendingUp className="h-4 w-4" />}
					/>
					<StatCard
						title="Monthly Expenses"
						value={stats.monthlyExpenses}
						change={stats.expenseChange}
						icon={<TrendingDown className="h-4 w-4" />}
					/>
					<StatCard
						title="Net Profit"
						value={stats.netProfit}
						change={stats.profitChange}
						icon={<Building2 className="h-4 w-4" />}
					/>
				</div>
			)}

			{/* Secondary KPI Cards */}
			{stats && (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					<StatCard
						title="Accounts Receivable"
						value={stats.accountsReceivable}
						icon={<FileText className="h-4 w-4" />}
						description="Outstanding invoices"
					/>
					<StatCard
						title="Accounts Payable"
						value={stats.accountsPayable}
						icon={<Receipt className="h-4 w-4" />}
						description="Unpaid bills"
					/>
					<StatCard
						title="Total Customers"
						value={42}
						change={12.5}
						icon={<Users className="h-4 w-4" />}
						description="Active customers"
					/>
					<StatCard
						title="Avg. Invoice Value"
						value={2847}
						change={8.2}
						icon={<FileText className="h-4 w-4" />}
						description="This month"
					/>
				</div>
			)}

			{/* Charts and Activity */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
				<div className="col-span-4">
					<CashFlowChart
						data={generateCashFlowData(parseInt(cashFlowPeriod))}
						period={cashFlowPeriod}
						onPeriodChange={setCashFlowPeriod}
					/>
				</div>

				<div className="col-span-3">
					<ExpenseBreakdown data={expenseData} />
				</div>
			</div>

			{/* Bottom Section */}
			<div className="grid gap-4 md:grid-cols-7">
				{/* Recent Activity - takes up more space */}
				<Card className="col-span-4">
					<CardHeader>
						<CardTitle>Recent Activity</CardTitle>
						<CardDescription>
							Latest transactions, invoices, and bills
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{recentActivity?.map((item) => (
								<div
									key={item.id}
									className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
								>
									<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
										{getActivityIcon(item.type)}
									</div>
									<div className="flex-1 space-y-1">
										<p className="text-sm font-medium leading-none">
											{item.title}
										</p>
										<p className="text-sm text-muted-foreground">
											{item.subtitle}
										</p>
										<p className="text-xs text-muted-foreground">
											{formatRelativeTime(item.date)}
										</p>
									</div>
									<div className="text-right space-y-1">
										<p className="text-sm font-medium font-tabular">
											{formatCurrency(item.amount)}
										</p>
										{item.status && getStatusBadge(item.status, item.type)}
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Right Column */}
				<div className="col-span-3 space-y-4">
					{/* Quick Actions */}
					<Card>
						<CardHeader>
							<CardTitle>Quick Actions</CardTitle>
							<CardDescription>Common tasks and shortcuts</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							<Button variant="outline" className="w-full justify-start">
								<FileText className="mr-2 h-4 w-4" />
								Create Invoice
							</Button>
							<Button variant="outline" className="w-full justify-start">
								<Receipt className="mr-2 h-4 w-4" />
								Record Bill
							</Button>
							<Button variant="outline" className="w-full justify-start">
								<CreditCard className="mr-2 h-4 w-4" />
								Add Transaction
							</Button>
							<Button variant="outline" className="w-full justify-start">
								<Users className="mr-2 h-4 w-4" />
								Add Customer
							</Button>
							<Button variant="outline" className="w-full justify-start">
								<Building2 className="mr-2 h-4 w-4" />
								Import CSV
							</Button>
						</CardContent>
					</Card>

					{/* Cash Flow Summary */}
					<Card>
						<CardHeader>
							<CardTitle>This Month</CardTitle>
							<CardDescription>Cash flow summary</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div className="h-2 w-2 rounded-full bg-green-500"></div>
									<span className="text-sm text-muted-foreground">
										Money In
									</span>
								</div>
								<span className="text-sm font-medium font-tabular">
									{formatCurrency(45230)}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div className="h-2 w-2 rounded-full bg-red-500"></div>
									<span className="text-sm text-muted-foreground">
										Money Out
									</span>
								</div>
								<span className="text-sm font-medium font-tabular">
									{formatCurrency(31820)}
								</span>
							</div>
							<div className="border-t pt-4">
								<div className="flex items-center justify-between">
									<span className="text-sm font-medium">Net Cash Flow</span>
									<span className="text-sm font-bold font-tabular text-green-600">
										{formatCurrency(stats?.netProfit || 27410)}
									</span>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Upcoming Items */}
					<Card>
						<CardHeader>
							<CardTitle>Upcoming</CardTitle>
							<CardDescription>Bills due and tasks pending</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="flex items-center gap-3">
								<div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
									<Clock className="h-4 w-4" />
								</div>
								<div className="flex-1">
									<p className="text-sm font-medium">3 bills due this week</p>
									<p className="text-xs text-muted-foreground">
										Total: {formatCurrency(4750)}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
									<FileText className="h-4 w-4" />
								</div>
								<div className="flex-1">
									<p className="text-sm font-medium">5 invoices pending</p>
									<p className="text-xs text-muted-foreground">
										Total: {formatCurrency(12840)}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
									<TrendingUp className="h-4 w-4" />
								</div>
								<div className="flex-1">
									<p className="text-sm font-medium">Tax quarter ends</p>
									<p className="text-xs text-muted-foreground">in 45 days</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
