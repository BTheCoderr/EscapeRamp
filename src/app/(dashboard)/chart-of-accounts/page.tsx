'use client';

import * as React from 'react';
import {
	MoreHorizontal,
	Plus,
	Edit,
	Trash,
	TrendingUp,
	TrendingDown,
	Building2,
	DollarSign,
	Receipt,
	ChevronRight,
	ChevronDown,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';

import { Account } from '@/lib/mock/types';
import { accountsRepo } from '@/lib/mock/repository';
import { formatAccountCode, formatAccountName } from '@/lib/mock/format';
import { formatCurrency } from '@/lib/mock/currency';

export default function ChartOfAccountsPage() {
	const [accounts, setAccounts] = React.useState<Account[]>([]);
	const [loading, setLoading] = React.useState(true);
	const [search, setSearch] = React.useState('');
	const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
		new Set(['assets', 'liabilities', 'equity', 'income', 'expenses'])
	);

	React.useEffect(() => {
		const loadAccounts = async () => {
			try {
				const result = await accountsRepo.list();
				setAccounts(result);
			} catch (error) {
				console.error('Failed to load accounts:', error);
			} finally {
				setLoading(false);
			}
		};

		loadAccounts();
	}, []);

	const getAccountTypeIcon = (type: string) => {
		switch (type) {
			case 'asset':
				return <Building2 className="h-4 w-4" />;
			case 'liability':
				return <Receipt className="h-4 w-4" />;
			case 'equity':
				return <DollarSign className="h-4 w-4" />;
			case 'income':
				return <TrendingUp className="h-4 w-4" />;
			case 'expense':
				return <TrendingDown className="h-4 w-4" />;
			default:
				return <DollarSign className="h-4 w-4" />;
		}
	};

	const getAccountTypeColor = (type: string) => {
		switch (type) {
			case 'asset':
				return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
			case 'liability':
				return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
			case 'equity':
				return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
			case 'income':
				return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
			case 'expense':
				return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
			default:
				return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
		}
	};

	const filteredAccounts = accounts.filter(
		(account) =>
			account.name.toLowerCase().includes(search.toLowerCase()) ||
			account.code.toLowerCase().includes(search.toLowerCase())
	);

	const groupedAccounts = filteredAccounts.reduce((groups, account) => {
		const type = account.type;
		if (!groups[type]) {
			groups[type] = [];
		}
		groups[type].push(account);
		return groups;
	}, {} as Record<string, Account[]>);

	const toggleSection = (section: string) => {
		const newExpanded = new Set(expandedSections);
		if (newExpanded.has(section)) {
			newExpanded.delete(section);
		} else {
			newExpanded.add(section);
		}
		setExpandedSections(newExpanded);
	};

	const accountTypes = [
		{ key: 'asset', label: 'Assets', color: 'blue' },
		{ key: 'liability', label: 'Liabilities', color: 'red' },
		{ key: 'equity', label: 'Equity', color: 'purple' },
		{ key: 'income', label: 'Income', color: 'green' },
		{ key: 'expense', label: 'Expenses', color: 'orange' },
	];

	if (loading) {
		return (
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">
							Chart of Accounts
						</h1>
						<p className="text-muted-foreground">
							Organize and manage your accounting structure.
						</p>
					</div>
				</div>
				<div className="h-96 flex items-center justify-center">
					<div className="text-center">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
						<p className="mt-2 text-sm text-muted-foreground">
							Loading accounts...
						</p>
					</div>
				</div>
			</div>
		);
	}

	const totalAssets =
		groupedAccounts.asset?.reduce((sum, acc) => sum + acc.balance, 0) || 0;
	const totalLiabilities =
		groupedAccounts.liability?.reduce((sum, acc) => sum + acc.balance, 0) || 0;
	const totalEquity =
		groupedAccounts.equity?.reduce((sum, acc) => sum + acc.balance, 0) || 0;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Chart of Accounts
					</h1>
					<p className="text-muted-foreground">
						Organize and manage your accounting structure.
					</p>
				</div>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Add Account
				</Button>
			</div>

			{/* Summary Cards */}
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Assets</CardTitle>
						<Building2 className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold font-tabular">
							{formatCurrency(totalAssets)}
						</div>
						<p className="text-xs text-muted-foreground">
							{groupedAccounts.asset?.length || 0} accounts
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Liabilities
						</CardTitle>
						<Receipt className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold font-tabular">
							{formatCurrency(totalLiabilities)}
						</div>
						<p className="text-xs text-muted-foreground">
							{groupedAccounts.liability?.length || 0} accounts
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Equity</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold font-tabular">
							{formatCurrency(totalEquity)}
						</div>
						<p className="text-xs text-muted-foreground">
							{groupedAccounts.equity?.length || 0} accounts
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Search */}
			<div className="flex items-center space-x-2">
				<Input
					placeholder="Search accounts..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="max-w-sm"
				/>
			</div>

			{/* Accounts by Type */}
			<div className="space-y-4">
				{accountTypes.map((accountType) => {
					const accountsOfType = groupedAccounts[accountType.key] || [];
					const isExpanded = expandedSections.has(accountType.key);
					const totalBalance = accountsOfType.reduce(
						(sum, acc) => sum + acc.balance,
						0
					);

					return (
						<Card key={accountType.key}>
							<Collapsible
								open={isExpanded}
								onOpenChange={() => toggleSection(accountType.key)}
							>
								<CollapsibleTrigger asChild>
									<CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-3">
												<div className="flex items-center gap-2">
													{isExpanded ? (
														<ChevronDown className="h-4 w-4" />
													) : (
														<ChevronRight className="h-4 w-4" />
													)}
													{getAccountTypeIcon(accountType.key)}
												</div>
												<div>
													<CardTitle className="text-lg">
														{accountType.label}
													</CardTitle>
													<CardDescription>
														{accountsOfType.length} account
														{accountsOfType.length !== 1 ? 's' : ''}
													</CardDescription>
												</div>
											</div>
											<div className="text-right">
												<div className="text-lg font-bold font-tabular">
													{formatCurrency(totalBalance)}
												</div>
												<Badge
													variant="outline"
													className={getAccountTypeColor(accountType.key)}
												>
													{accountType.label}
												</Badge>
											</div>
										</div>
									</CardHeader>
								</CollapsibleTrigger>
								<CollapsibleContent>
									<CardContent className="pt-0">
										<div className="space-y-2">
											{accountsOfType.map((account) => (
												<div
													key={account.id}
													className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
												>
													<div className="flex items-center gap-3">
														<div className="text-sm font-mono text-muted-foreground">
															{formatAccountCode(account.code)}
														</div>
														<div>
															<div className="font-medium">{account.name}</div>
															{account.description && (
																<div className="text-sm text-muted-foreground">
																	{account.description}
																</div>
															)}
														</div>
													</div>
													<div className="flex items-center gap-4">
														<div className="text-right">
															<div className="font-medium font-tabular">
																{formatCurrency(account.balance)}
															</div>
															<Badge
																variant={
																	account.isActive ? 'default' : 'secondary'
																}
															>
																{account.isActive ? 'Active' : 'Inactive'}
															</Badge>
														</div>
														<DropdownMenu>
															<DropdownMenuTrigger asChild>
																<Button variant="ghost" className="h-8 w-8 p-0">
																	<MoreHorizontal className="h-4 w-4" />
																</Button>
															</DropdownMenuTrigger>
															<DropdownMenuContent align="end">
																<DropdownMenuLabel>Actions</DropdownMenuLabel>
																<DropdownMenuItem>
																	<Edit className="mr-2 h-4 w-4" />
																	Edit
																</DropdownMenuItem>
																<DropdownMenuItem>
																	View Transactions
																</DropdownMenuItem>
																<DropdownMenuSeparator />
																<DropdownMenuItem>
																	{account.isActive ? 'Deactivate' : 'Activate'}
																</DropdownMenuItem>
																<DropdownMenuItem className="text-red-600">
																	<Trash className="mr-2 h-4 w-4" />
																	Delete
																</DropdownMenuItem>
															</DropdownMenuContent>
														</DropdownMenu>
													</div>
												</div>
											))}
										</div>
									</CardContent>
								</CollapsibleContent>
							</Collapsible>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
