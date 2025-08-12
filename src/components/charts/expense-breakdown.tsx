'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { formatCurrency } from '@/lib/mock/currency';
import { useThemeColors } from '@/hooks/use-theme-colors';

interface ExpenseData {
	category: string;
	amount: number;
	color: string;
}

interface ExpenseBreakdownProps {
	data: ExpenseData[];
}

export function ExpenseBreakdown({ data }: ExpenseBreakdownProps) {
	const colors = useThemeColors();
	const total = data.reduce((sum, item) => sum + item.amount, 0);

	const COLORS = [
		colors.chart1, // Coral
		colors.chart2, // Teal
		colors.chart3, // Purple
		colors.chart4, // Golden
		colors.chart5, // Green
	];

	return (
		<Card>
			<CardHeader>
				<CardTitle>Expense Breakdown</CardTitle>
				<CardDescription>Monthly expenses by category</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="h-80">
					<ResponsiveContainer width="100%" height="100%">
						<PieChart>
							<Pie
								data={data}
								cx="50%"
								cy="50%"
								innerRadius={60}
								outerRadius={120}
								paddingAngle={2}
								dataKey="amount"
								cornerRadius={8}
							>
								{data.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={COLORS[index % COLORS.length]}
										stroke={COLORS[index % COLORS.length]}
										strokeWidth={2}
									/>
								))}
							</Pie>
							<Tooltip
								contentStyle={{
									backgroundColor: 'hsl(var(--popover))',
									border: '1px solid hsl(var(--border))',
									borderRadius: '12px',
									boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
									color: 'hsl(var(--popover-foreground))',
								}}
								formatter={(value: number, name: string, props: any) => [
									formatCurrency(value),
									props.payload.category,
								]}
								labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
							/>
						</PieChart>
					</ResponsiveContainer>
				</div>

				<div className="space-y-3 pt-4">
					{data.map((item, index) => {
						const percentage = (item.amount / total) * 100;
						return (
							<div
								key={item.category}
								className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-muted/50 transition-colors"
							>
								<div className="flex items-center gap-3">
									<div
										className="w-4 h-4 rounded-full shadow-sm"
										style={{ backgroundColor: COLORS[index % COLORS.length] }}
									/>
									<span className="font-medium">{item.category}</span>
								</div>
								<div className="text-right">
									<div className="font-tabular font-medium">
										{formatCurrency(item.amount)}
									</div>
									<div className="text-xs text-muted-foreground font-medium">
										{percentage.toFixed(1)}%
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}
