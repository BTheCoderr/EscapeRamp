'use client';

import * as React from 'react';
import {
	MoreHorizontal,
	Plus,
	Edit,
	Trash,
	Calculator,
	FileText,
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
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface TaxRate {
	id: string;
	name: string;
	rate: number;
	description?: string;
	isActive: boolean;
	isDefault?: boolean;
}

const taxRates: TaxRate[] = [
	{
		id: '1',
		name: 'Sales Tax',
		rate: 8.5,
		description: 'California State Sales Tax',
		isActive: true,
		isDefault: true,
	},
	{
		id: '2',
		name: 'Service Tax',
		rate: 6.0,
		description: 'Service Tax Rate',
		isActive: true,
	},
	{
		id: '3',
		name: 'No Tax',
		rate: 0.0,
		description: 'Tax-exempt items',
		isActive: true,
	},
	{
		id: '4',
		name: 'Import Tax',
		rate: 12.0,
		description: 'Import duties and taxes',
		isActive: false,
	},
];

export default function TaxSettingsPage() {
	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Tax Settings</h3>
				<p className="text-sm text-muted-foreground">
					Manage tax rates and configure tax calculation settings.
				</p>
			</div>

			<Separator />

			{/* Tax Configuration */}
			<Card>
				<CardHeader>
					<CardTitle>Tax Configuration</CardTitle>
					<CardDescription>
						Configure how taxes are calculated and applied.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>Enable tax calculations</Label>
							<p className="text-sm text-muted-foreground">
								Automatically calculate taxes on invoices and bills.
							</p>
						</div>
						<Switch defaultChecked />
					</div>

					<Separator />

					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>Tax inclusive pricing</Label>
							<p className="text-sm text-muted-foreground">
								Prices include tax (tax is calculated from the total).
							</p>
						</div>
						<Switch />
					</div>

					<Separator />

					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>Show tax breakdown</Label>
							<p className="text-sm text-muted-foreground">
								Display detailed tax breakdown on invoices and reports.
							</p>
						</div>
						<Switch defaultChecked />
					</div>
				</CardContent>
			</Card>

			{/* Tax Rates */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>Tax Rates</CardTitle>
							<CardDescription>
								Manage your tax rates and categories.
							</CardDescription>
						</div>
						<Button>
							<Plus className="mr-2 h-4 w-4" />
							Add Tax Rate
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{taxRates.map((taxRate) => (
							<div
								key={taxRate.id}
								className="flex items-center justify-between"
							>
								<div className="flex items-center gap-4">
									<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
										<Calculator className="h-5 w-5" />
									</div>
									<div>
										<div className="flex items-center gap-2">
											<span className="font-medium">{taxRate.name}</span>
											{taxRate.isDefault && (
												<Badge variant="secondary" className="text-xs">
													Default
												</Badge>
											)}
										</div>
										<div className="text-sm text-muted-foreground">
											{taxRate.description}
										</div>
									</div>
								</div>
								<div className="flex items-center gap-4">
									<div className="text-right">
										<div className="font-medium font-tabular">
											{taxRate.rate.toFixed(1)}%
										</div>
										<Badge variant={taxRate.isActive ? 'default' : 'secondary'}>
											{taxRate.isActive ? 'Active' : 'Inactive'}
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
											<DropdownMenuItem>Set as Default</DropdownMenuItem>
											<DropdownMenuSeparator />
											<DropdownMenuItem>
												{taxRate.isActive ? 'Deactivate' : 'Activate'}
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
			</Card>

			{/* Tax Reporting */}
			<Card>
				<CardHeader>
					<CardTitle>Tax Reporting</CardTitle>
					<CardDescription>
						Configure tax reporting periods and compliance settings.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<div className="font-medium">Current tax period</div>
							<div className="text-sm text-muted-foreground">
								Q4 2024 (October - December)
							</div>
						</div>
						<Button variant="outline" size="sm">
							<FileText className="mr-2 h-4 w-4" />
							View Report
						</Button>
					</div>

					<Separator />

					<div className="flex items-center justify-between">
						<div>
							<div className="font-medium">Tax collected this period</div>
							<div className="text-sm text-muted-foreground">
								Total tax collected from sales
							</div>
						</div>
						<div className="text-right">
							<div className="font-medium font-tabular">$2,847.50</div>
							<div className="text-sm text-muted-foreground">8.5% avg rate</div>
						</div>
					</div>

					<Separator />

					<div className="flex items-center justify-between">
						<div>
							<div className="font-medium">Tax paid this period</div>
							<div className="text-sm text-muted-foreground">
								Tax paid on purchases and expenses
							</div>
						</div>
						<div className="text-right">
							<div className="font-medium font-tabular">$1,263.25</div>
							<div className="text-sm text-muted-foreground">Various rates</div>
						</div>
					</div>

					<Separator />

					<div className="flex items-center justify-between">
						<div>
							<div className="font-medium">Net tax liability</div>
							<div className="text-sm text-muted-foreground">
								Amount owed to tax authorities
							</div>
						</div>
						<div className="text-right">
							<div className="font-medium font-tabular text-red-600">
								$1,584.25
							</div>
							<div className="text-sm text-muted-foreground">Due Jan 31</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Quick Actions */}
			<Card>
				<CardHeader>
					<CardTitle>Quick Actions</CardTitle>
					<CardDescription>
						Common tax-related tasks and reports.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-3 md:grid-cols-2">
						<Button variant="outline" className="justify-start">
							<FileText className="mr-2 h-4 w-4" />
							Generate Tax Report
						</Button>
						<Button variant="outline" className="justify-start">
							<Calculator className="mr-2 h-4 w-4" />
							Tax Calculator
						</Button>
						<Button variant="outline" className="justify-start">
							<FileText className="mr-2 h-4 w-4" />
							Export for CPA
						</Button>
						<Button variant="outline" className="justify-start">
							<FileText className="mr-2 h-4 w-4" />
							Previous Returns
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
