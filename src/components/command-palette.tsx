'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
	Calculator,
	Calendar,
	CreditCard,
	FileText,
	Receipt,
	Search,
	Settings,
	Users,
	BarChart3,
	Building2,
	Wallet,
} from 'lucide-react';

import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from '@/components/ui/command';

interface CommandPaletteProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
	const router = useRouter();

	const runCommand = React.useCallback(
		(command: () => unknown) => {
			onOpenChange(false);
			command();
		},
		[onOpenChange]
	);

	return (
		<CommandDialog open={open} onOpenChange={onOpenChange}>
			<CommandInput placeholder="Type a command or search..." />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup heading="Navigation">
					<CommandItem
						value="dashboard"
						onSelect={() => runCommand(() => router.push('/'))}
					>
						<Building2 className="mr-2 h-4 w-4" />
						<span>Dashboard</span>
					</CommandItem>
					<CommandItem
						value="transactions"
						onSelect={() => runCommand(() => router.push('/transactions'))}
					>
						<CreditCard className="mr-2 h-4 w-4" />
						<span>Transactions</span>
					</CommandItem>
					<CommandItem
						value="invoices"
						onSelect={() => runCommand(() => router.push('/invoices'))}
					>
						<FileText className="mr-2 h-4 w-4" />
						<span>Invoices</span>
					</CommandItem>
					<CommandItem
						value="bills"
						onSelect={() => runCommand(() => router.push('/bills'))}
					>
						<Receipt className="mr-2 h-4 w-4" />
						<span>Bills</span>
					</CommandItem>
					<CommandItem
						value="banking"
						onSelect={() => runCommand(() => router.push('/banking'))}
					>
						<Wallet className="mr-2 h-4 w-4" />
						<span>Banking</span>
					</CommandItem>
					<CommandItem
						value="reports"
						onSelect={() => runCommand(() => router.push('/reports'))}
					>
						<BarChart3 className="mr-2 h-4 w-4" />
						<span>Reports</span>
					</CommandItem>
					<CommandItem
						value="customers"
						onSelect={() => runCommand(() => router.push('/customers'))}
					>
						<Users className="mr-2 h-4 w-4" />
						<span>Customers</span>
					</CommandItem>
					<CommandItem
						value="vendors"
						onSelect={() => runCommand(() => router.push('/vendors'))}
					>
						<Users className="mr-2 h-4 w-4" />
						<span>Vendors</span>
					</CommandItem>
				</CommandGroup>
				<CommandSeparator />
				<CommandGroup heading="Quick Actions">
					<CommandItem
						value="new invoice"
						onSelect={() => runCommand(() => router.push('/invoices/new'))}
					>
						<FileText className="mr-2 h-4 w-4" />
						<span>Create Invoice</span>
					</CommandItem>
					<CommandItem
						value="new bill"
						onSelect={() => runCommand(() => router.push('/bills/new'))}
					>
						<Receipt className="mr-2 h-4 w-4" />
						<span>Record Bill</span>
					</CommandItem>
					<CommandItem
						value="new transaction"
						onSelect={() => runCommand(() => router.push('/transactions/new'))}
					>
						<CreditCard className="mr-2 h-4 w-4" />
						<span>Add Transaction</span>
					</CommandItem>
				</CommandGroup>
				<CommandSeparator />
				<CommandGroup heading="Settings">
					<CommandItem
						value="settings"
						onSelect={() => runCommand(() => router.push('/settings'))}
					>
						<Settings className="mr-2 h-4 w-4" />
						<span>Settings</span>
					</CommandItem>
					<CommandItem
						value="company settings"
						onSelect={() => runCommand(() => router.push('/settings/company'))}
					>
						<Building2 className="mr-2 h-4 w-4" />
						<span>Company Settings</span>
					</CommandItem>
				</CommandGroup>
			</CommandList>
		</CommandDialog>
	);
}
