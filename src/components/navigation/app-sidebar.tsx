'use client';

import * as React from 'react';
import {
	BarChart3,
	Building2,
	Calculator,
	FileText,
	Home,
	Landmark,
	Receipt,
	Settings,
	TrendingUp,
	Users,
	FileBarChart,
} from 'lucide-react';

import { NavMain } from '@/components/navigation/nav-main';
import { NavUser } from '@/components/navigation/nav-user';
import { TeamSwitcher } from '@/components/navigation/team-switcher';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from '@/components/ui/sidebar';

// This is sample data.
const data = {
	user: {
		name: 'John Doe',
		email: 'john@acmebusiness.com',
		avatar: '/avatars/john-doe.jpg',
	},
	teams: [
		{
			name: 'Escape Ramp Solutions',
			logo: Building2,
			plan: 'Professional',
		},
	],
	navMain: [
		{
			title: 'Dashboard',
			url: '/',
			icon: Home,
		},
		{
			title: 'Transactions',
			url: '/transactions',
			icon: Calculator,
		},
		{
			title: 'Invoices',
			url: '/invoices',
			icon: FileText,
		},
		{
			title: 'Bills',
			url: '/bills',
			icon: Receipt,
		},
		{
			title: 'Banking',
			url: '/banking',
			icon: Landmark,
			items: [
				{
					title: 'Accounts',
					url: '/banking',
				},
				{
					title: 'Reconciliation',
					url: '/banking/reconciliation',
				},
			],
		},
		{
			title: 'Reports',
			url: '/reports',
			icon: FileBarChart,
			items: [
				{
					title: 'Overview',
					url: '/reports',
				},
				{
					title: 'Profit & Loss',
					url: '/reports/profit-loss',
				},
				{
					title: 'Balance Sheet',
					url: '/reports/balance-sheet',
				},
				{
					title: 'Cash Flow',
					url: '/reports/cash-flow',
				},
			],
		},
		{
			title: 'Contacts',
			url: '/contacts',
			icon: Users,
			items: [
				{
					title: 'Customers',
					url: '/customers',
				},
				{
					title: 'Vendors',
					url: '/vendors',
				},
			],
		},
		{
			title: 'Chart of Accounts',
			url: '/chart-of-accounts',
			icon: BarChart3,
		},
		{
			title: 'Settings',
			url: '/settings',
			icon: Settings,
			items: [
				{
					title: 'Company',
					url: '/settings/company',
				},
				{
					title: 'Appearance',
					url: '/settings/appearance',
				},
				{
					title: 'Team',
					url: '/settings/team',
				},
				{
					title: 'Taxes',
					url: '/settings/taxes',
				},
			],
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<TeamSwitcher teams={data.teams} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
