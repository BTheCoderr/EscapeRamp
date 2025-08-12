'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

export default function AppearanceSettingsPage() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<div className="space-y-6">
				<div>
					<h3 className="text-lg font-medium">Appearance</h3>
					<p className="text-sm text-muted-foreground">
						Customize the appearance of the app. Automatically switch between
						day and night themes.
					</p>
				</div>
				<div className="space-y-6">
					<Card>
						<CardHeader>
							<div className="animate-pulse h-5 bg-muted rounded w-32"></div>
						</CardHeader>
						<CardContent>
							<div className="animate-pulse h-20 bg-muted rounded"></div>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Appearance</h3>
				<p className="text-sm text-muted-foreground">
					Customize the appearance of the app. Automatically switch between day
					and night themes.
				</p>
			</div>

			<Separator />

			<Card>
				<CardHeader>
					<CardTitle>Theme</CardTitle>
					<CardDescription>Select the theme for the dashboard.</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<RadioGroup
						defaultValue={theme}
						onValueChange={setTheme}
						className="grid max-w-md grid-cols-3 gap-8 pt-2"
					>
						<div className="space-y-2">
							<Label
								htmlFor="light"
								className="flex flex-col items-center space-y-2 cursor-pointer"
							>
								<RadioGroupItem value="light" id="light" className="sr-only" />
								<div className="rounded-md border-2 border-muted p-1 hover:border-accent">
									<div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
										<div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
											<div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
											<div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
										</div>
										<div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
											<div className="h-4 w-4 rounded-full bg-[#ecedef]" />
											<div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
										</div>
										<div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
											<div className="h-4 w-4 rounded-full bg-[#ecedef]" />
											<div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
										</div>
									</div>
								</div>
								<span className="block w-full p-2 text-center font-normal">
									Light
								</span>
							</Label>
						</div>

						<div className="space-y-2">
							<Label
								htmlFor="dark"
								className="flex flex-col items-center space-y-2 cursor-pointer"
							>
								<RadioGroupItem value="dark" id="dark" className="sr-only" />
								<div className="rounded-md border-2 border-muted bg-popover p-1 hover:border-accent">
									<div className="space-y-2 rounded-sm bg-slate-950 p-2">
										<div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
											<div className="h-2 w-[80px] rounded-lg bg-slate-400" />
											<div className="h-2 w-[100px] rounded-lg bg-slate-400" />
										</div>
										<div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
											<div className="h-4 w-4 rounded-full bg-slate-400" />
											<div className="h-2 w-[100px] rounded-lg bg-slate-400" />
										</div>
										<div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
											<div className="h-4 w-4 rounded-full bg-slate-400" />
											<div className="h-2 w-[100px] rounded-lg bg-slate-400" />
										</div>
									</div>
								</div>
								<span className="block w-full p-2 text-center font-normal">
									Dark
								</span>
							</Label>
						</div>

						<div className="space-y-2">
							<Label
								htmlFor="system"
								className="flex flex-col items-center space-y-2 cursor-pointer"
							>
								<RadioGroupItem
									value="system"
									id="system"
									className="sr-only"
								/>
								<div className="rounded-md border-2 border-muted p-1 hover:border-accent">
									<div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
										<div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
											<div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
											<div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
										</div>
										<div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
											<div className="h-4 w-4 rounded-full bg-[#ecedef]" />
											<div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
										</div>
										<div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
											<div className="h-4 w-4 rounded-full bg-slate-400" />
											<div className="h-2 w-[100px] rounded-lg bg-slate-400" />
										</div>
									</div>
								</div>
								<span className="block w-full p-2 text-center font-normal">
									System
								</span>
							</Label>
						</div>
					</RadioGroup>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Display Settings</CardTitle>
					<CardDescription>
						Configure display density and other visual preferences.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>Compact Mode</Label>
							<p className="text-sm text-muted-foreground">
								Use a more compact layout to fit more content on screen.
							</p>
						</div>
						<Switch />
					</div>

					<Separator />

					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>Show Tooltips</Label>
							<p className="text-sm text-muted-foreground">
								Display helpful tooltips when hovering over interface elements.
							</p>
						</div>
						<Switch defaultChecked />
					</div>

					<Separator />

					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>Reduced Motion</Label>
							<p className="text-sm text-muted-foreground">
								Reduce animations and transitions for better accessibility.
							</p>
						</div>
						<Switch />
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Dashboard Preferences</CardTitle>
					<CardDescription>
						Customize your dashboard experience and default views.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>Auto-refresh Data</Label>
							<p className="text-sm text-muted-foreground">
								Automatically refresh dashboard data every 5 minutes.
							</p>
						</div>
						<Switch defaultChecked />
					</div>

					<Separator />

					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>Show Welcome Tips</Label>
							<p className="text-sm text-muted-foreground">
								Display helpful tips and onboarding guidance.
							</p>
						</div>
						<Switch defaultChecked />
					</div>

					<Separator />

					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>Sidebar Collapsed by Default</Label>
							<p className="text-sm text-muted-foreground">
								Start with the sidebar collapsed to maximize content area.
							</p>
						</div>
						<Switch />
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
