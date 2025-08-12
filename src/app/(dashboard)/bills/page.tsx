'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import {
	ArrowUpDown,
	MoreHorizontal,
	Plus,
	Eye,
	Edit,
	Trash,
	DollarSign,
	Calendar,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

import { DataTable } from '@/components/tables/data-table';
import { Bill } from '@/lib/mock/types';
import { billsRepo, contactsRepo } from '@/lib/mock/repository';
import { formatCurrency } from '@/lib/mock/currency';
import { formatDate, formatBillNumber } from '@/lib/mock/format';

export default function BillsPage() {
	const [bills, setBills] = React.useState<Bill[]>([]);
	const [vendors, setVendors] = React.useState<
		Array<{ id: string; name: string }>
	>([]);
	const [loading, setLoading] = React.useState(true);
	const [filters, setFilters] = React.useState({
		vendor: '',
		status: '',
	});

	const loadBills = React.useCallback(async () => {
		try {
			setLoading(true);
			const [billsResult, vendorsResult] = await Promise.all([
				billsRepo.list({
					contactId:
						filters.vendor && filters.vendor !== 'all'
							? filters.vendor
							: undefined,
					status:
						filters.status && filters.status !== 'all'
							? filters.status
							: undefined,
					limit: 100,
				}),
				contactsRepo.list('vendor'),
			]);

			setBills(billsResult.data);
			setVendors(vendorsResult.map((v) => ({ id: v.id, name: v.name })));
		} catch (error) {
			console.error('Failed to load bills:', error);
		} finally {
			setLoading(false);
		}
	}, [filters]);

	React.useEffect(() => {
		loadBills();
	}, [loadBills]);

	const getStatusBadge = (status: string) => {
		const variants = {
			draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
			scheduled:
				'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
			paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
			overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
			cancelled:
				'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
		};

		return (
			<Badge
				variant="secondary"
				className={variants[status as keyof typeof variants] || ''}
			>
				{status}
			</Badge>
		);
	};

	const columns: ColumnDef<Bill>[] = [
		{
			id: 'select',
			header: ({ table }) => (
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && 'indeterminate')
					}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label="Select all"
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label="Select row"
				/>
			),
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: 'number',
			header: 'Bill #',
			cell: ({ row }) => {
				const number = row.getValue('number') as string;
				return <div className="font-medium">{formatBillNumber(number)}</div>;
			},
		},
		{
			accessorKey: 'vendor',
			header: 'Vendor',
			cell: ({ row }) => {
				const vendor = row.original.vendor;
				return (
					<div className="font-medium">{vendor?.name || 'Unknown Vendor'}</div>
				);
			},
		},
		{
			accessorKey: 'issueDate',
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
						className="h-8 px-2"
					>
						Date
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => {
				const date = row.getValue('issueDate') as Date;
				return formatDate(date, 'MMM d, yyyy');
			},
		},
		{
			accessorKey: 'dueDate',
			header: 'Due Date',
			cell: ({ row }) => {
				const date = row.getValue('dueDate') as Date;
				const isOverdue = new Date() > date && row.original.status !== 'paid';
				return (
					<div className={isOverdue ? 'text-red-600 font-medium' : ''}>
						{formatDate(date, 'MMM d, yyyy')}
					</div>
				);
			},
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ row }) => {
				const status = row.getValue('status') as string;
				return getStatusBadge(status);
			},
		},
		{
			accessorKey: 'total',
			header: ({ column }) => {
				return (
					<div className="text-right">
						<Button
							variant="ghost"
							onClick={() =>
								column.toggleSorting(column.getIsSorted() === 'asc')
							}
							className="h-8 px-2"
						>
							Total
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					</div>
				);
			},
			cell: ({ row }) => {
				const total = row.getValue('total') as number;
				return (
					<div className="text-right font-tabular font-medium">
						{formatCurrency(total)}
					</div>
				);
			},
		},
		{
			accessorKey: 'amountDue',
			header: 'Amount Due',
			cell: ({ row }) => {
				const amountDue = row.getValue('amountDue') as number;
				const isPaid = amountDue === 0;
				return (
					<div
						className={`text-right font-tabular font-medium ${
							isPaid ? 'text-green-600' : 'text-red-600'
						}`}
					>
						{formatCurrency(amountDue)}
					</div>
				);
			},
		},
		{
			id: 'actions',
			cell: ({ row }) => {
				const bill = row.original;

				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuItem>
								<Eye className="mr-2 h-4 w-4" />
								View
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Edit className="mr-2 h-4 w-4" />
								Edit
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<DollarSign className="mr-2 h-4 w-4" />
								Record Payment
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Calendar className="mr-2 h-4 w-4" />
								Schedule Payment
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Mark as Paid</DropdownMenuItem>
							<DropdownMenuItem className="text-red-600">
								<Trash className="mr-2 h-4 w-4" />
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	const toolbar = (
		<div className="flex items-center space-x-2">
			<Select
				value={filters.vendor}
				onValueChange={(value) =>
					setFilters((prev) => ({ ...prev, vendor: value }))
				}
			>
				<SelectTrigger className="h-8 w-[180px]">
					<SelectValue placeholder="All vendors" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All vendors</SelectItem>
					{vendors.map((vendor) => (
						<SelectItem key={vendor.id} value={vendor.id}>
							{vendor.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Select
				value={filters.status}
				onValueChange={(value) =>
					setFilters((prev) => ({ ...prev, status: value }))
				}
			>
				<SelectTrigger className="h-8 w-[140px]">
					<SelectValue placeholder="All statuses" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All statuses</SelectItem>
					<SelectItem value="draft">Draft</SelectItem>
					<SelectItem value="scheduled">Scheduled</SelectItem>
					<SelectItem value="paid">Paid</SelectItem>
					<SelectItem value="overdue">Overdue</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);

	if (loading) {
		return (
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Bills</h1>
						<p className="text-muted-foreground">
							Manage your vendor bills and payables.
						</p>
					</div>
				</div>
				<div className="h-96 flex items-center justify-center">
					<div className="text-center">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
						<p className="mt-2 text-sm text-muted-foreground">
							Loading bills...
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Bills</h1>
					<p className="text-muted-foreground">
						Manage your vendor bills and payables.
					</p>
				</div>
			</div>

			<DataTable
				columns={columns}
				data={bills}
				searchKey="number"
				searchPlaceholder="Search bills..."
				onAdd={() => console.log('Add bill')}
				onExport={() => console.log('Export bills')}
				toolbar={toolbar}
			/>
		</div>
	);
}
