'use client';

import * as React from 'react';
import {
	MoreHorizontal,
	Plus,
	UserPlus,
	Mail,
	Shield,
	Settings,
	Trash,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

interface TeamMember {
	id: string;
	name: string;
	email: string;
	role: string;
	status: 'active' | 'pending' | 'suspended';
	lastActive: string;
	avatar?: string;
}

const teamMembers: TeamMember[] = [
	{
		id: '1',
		name: 'John Doe',
		email: 'john@acmebusiness.com',
		role: 'Owner',
		status: 'active',
		lastActive: 'Online now',
		avatar: '/avatars/john-doe.jpg',
	},
	{
		id: '2',
		name: 'Sarah Johnson',
		email: 'sarah@acmebusiness.com',
		role: 'Accountant',
		status: 'active',
		lastActive: '2 hours ago',
	},
	{
		id: '3',
		name: 'Mike Chen',
		email: 'mike@acmebusiness.com',
		role: 'Bookkeeper',
		status: 'pending',
		lastActive: 'Never',
	},
	{
		id: '4',
		name: 'Emily Davis',
		email: 'emily@acmebusiness.com',
		role: 'Viewer',
		status: 'active',
		lastActive: 'Yesterday',
	},
];

const roles = [
	{
		name: 'Owner',
		description: 'Full access to all features and settings',
		permissions: ['Full access', 'Billing', 'Team management', 'All reports'],
	},
	{
		name: 'Accountant',
		description: 'Access to financial data and reports',
		permissions: ['Transactions', 'Reports', 'Invoices', 'Bills', 'Banking'],
	},
	{
		name: 'Bookkeeper',
		description: 'Day-to-day transaction management',
		permissions: ['Transactions', 'Invoices', 'Bills', 'Basic reports'],
	},
	{
		name: 'Viewer',
		description: 'Read-only access to reports and data',
		permissions: ['View reports', 'View transactions', 'Export data'],
	},
];

export default function TeamSettingsPage() {
	const getStatusBadge = (status: string) => {
		const variants = {
			active:
				'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
			pending:
				'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
			suspended: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
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

	const getRoleColor = (role: string) => {
		switch (role.toLowerCase()) {
			case 'owner':
				return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
			case 'accountant':
				return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
			case 'bookkeeper':
				return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
			case 'viewer':
				return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
			default:
				return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Team Management</h3>
				<p className="text-sm text-muted-foreground">
					Manage team members and their access permissions.
				</p>
			</div>

			<Separator />

			{/* Team Members */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>Team Members</CardTitle>
							<CardDescription>
								{teamMembers.length} member{teamMembers.length !== 1 ? 's' : ''}{' '}
								in your team
							</CardDescription>
						</div>
						<Button>
							<UserPlus className="mr-2 h-4 w-4" />
							Invite Member
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{teamMembers.map((member) => (
							<div
								key={member.id}
								className="flex items-center justify-between"
							>
								<div className="flex items-center gap-4">
									<Avatar className="h-10 w-10">
										<AvatarImage src={member.avatar} />
										<AvatarFallback>
											{member.name
												.split(' ')
												.map((n) => n[0])
												.join('')}
										</AvatarFallback>
									</Avatar>
									<div>
										<div className="font-medium">{member.name}</div>
										<div className="text-sm text-muted-foreground">
											{member.email}
										</div>
									</div>
								</div>
								<div className="flex items-center gap-4">
									<div className="text-right">
										<div className="flex items-center gap-2">
											<Badge
												variant="outline"
												className={getRoleColor(member.role)}
											>
												{member.role}
											</Badge>
											{getStatusBadge(member.status)}
										</div>
										<div className="text-sm text-muted-foreground mt-1">
											{member.lastActive}
										</div>
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
												<Mail className="mr-2 h-4 w-4" />
												Send Email
											</DropdownMenuItem>
											<DropdownMenuItem>
												<Shield className="mr-2 h-4 w-4" />
												Change Role
											</DropdownMenuItem>
											<DropdownMenuItem>
												<Settings className="mr-2 h-4 w-4" />
												Permissions
											</DropdownMenuItem>
											<DropdownMenuSeparator />
											{member.status === 'active' ? (
												<DropdownMenuItem className="text-red-600">
													Suspend Access
												</DropdownMenuItem>
											) : (
												<DropdownMenuItem>Activate Access</DropdownMenuItem>
											)}
											<DropdownMenuItem className="text-red-600">
												<Trash className="mr-2 h-4 w-4" />
												Remove
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Roles & Permissions */}
			<Card>
				<CardHeader>
					<CardTitle>Roles & Permissions</CardTitle>
					<CardDescription>
						Understand what each role can access and manage.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-6">
						{roles.map((role) => (
							<div key={role.name} className="space-y-3">
								<div className="flex items-center gap-3">
									<Badge variant="outline" className={getRoleColor(role.name)}>
										{role.name}
									</Badge>
									<span className="text-sm text-muted-foreground">
										{role.description}
									</span>
								</div>
								<div className="ml-6">
									<div className="text-sm font-medium mb-2">Permissions:</div>
									<div className="flex flex-wrap gap-2">
										{role.permissions.map((permission) => (
											<Badge
												key={permission}
												variant="secondary"
												className="text-xs"
											>
												{permission}
											</Badge>
										))}
									</div>
								</div>
								{role.name !== roles[roles.length - 1].name && (
									<Separator className="mt-4" />
								)}
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Invitation Settings */}
			<Card>
				<CardHeader>
					<CardTitle>Invitation Settings</CardTitle>
					<CardDescription>
						Configure how team invitations are handled.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<div className="font-medium">
								Require approval for new members
							</div>
							<div className="text-sm text-muted-foreground">
								All invitations must be approved by an owner before access is
								granted.
							</div>
						</div>
						<Button variant="outline" size="sm">
							Enabled
						</Button>
					</div>

					<Separator />

					<div className="flex items-center justify-between">
						<div>
							<div className="font-medium">Default role for new members</div>
							<div className="text-sm text-muted-foreground">
								The role automatically assigned to newly invited team members.
							</div>
						</div>
						<Badge variant="outline" className={getRoleColor('Viewer')}>
							Viewer
						</Badge>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
