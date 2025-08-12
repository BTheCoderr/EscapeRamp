'use client';

import { useMemo } from 'react';
import {
	Area,
	AreaChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { formatCurrency } from '@/lib/mock/currency';
import { formatDate } from '@/lib/mock/format';
import { useThemeColors } from '@/hooks/use-theme-colors';

interface CashFlowData {
	date: string;
	inflow: number;
	outflow: number;
	net: number;
}

interface CashFlowChartProps {
	data: CashFlowData[];
	period: '30' | '90' | '365';
	onPeriodChange: (period: '30' | '90' | '365') => void;
}

export function CashFlowChart({
	data,
	period,
	onPeriodChange,
}: CashFlowChartProps) {
	const colors = useThemeColors();

	const chartData = useMemo(() => {
		return data.map((item) => ({
			...item,
			date: formatDate(new Date(item.date), 'MMM d'),
		}));
	}, [data]);

	const totalNet = useMemo(() => {
		return data.reduce((sum, item) => sum + item.net, 0);
	}, [data]);

	return (
		<Card className="col-span-2">
			<CardHeader className="flex flex-row items-center justify-between space-y-0">
				<div>
					<CardTitle>Cash Flow</CardTitle>
					<CardDescription>
						Net cash flow over the last {period} days
					</CardDescription>
				</div>
				<div className="flex gap-1">
					{(['30', '90', '365'] as const).map((p) => (
						<button
							key={p}
							onClick={() => onPeriodChange(p)}
							className={`px-3 py-1 text-sm rounded-md transition-colors ${
								period === p
									? 'bg-primary text-primary-foreground'
									: 'text-muted-foreground hover:text-foreground'
							}`}
						>
							{p}d
						</button>
					))}
				</div>
			</CardHeader>
			<CardContent>
				<div className="h-80">
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart data={chartData}>
							<defs>
								<linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
									<stop
										offset="5%"
										stopColor={colors.chart5}
										stopOpacity={0.9}
									/>
									<stop
										offset="95%"
										stopColor={colors.chart5}
										stopOpacity={0.1}
									/>
								</linearGradient>
								<linearGradient id="colorOutflow" x1="0" y1="0" x2="0" y2="1">
									<stop
										offset="5%"
										stopColor={colors.chart1}
										stopOpacity={0.9}
									/>
									<stop
										offset="95%"
										stopColor={colors.chart1}
										stopOpacity={0.1}
									/>
								</linearGradient>
								<linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
									<stop
										offset="5%"
										stopColor={colors.primary}
										stopOpacity={0.9}
									/>
									<stop
										offset="95%"
										stopColor={colors.primary}
										stopOpacity={0.1}
									/>
								</linearGradient>
							</defs>
							<XAxis
								dataKey="date"
								stroke="hsl(var(--muted-foreground))"
								fontSize={12}
								tickLine={false}
								axisLine={false}
								tick={{ fill: 'hsl(var(--muted-foreground))' }}
							/>
							<YAxis
								stroke="hsl(var(--muted-foreground))"
								fontSize={12}
								tickLine={false}
								axisLine={false}
								tick={{ fill: 'hsl(var(--muted-foreground))' }}
								tickFormatter={(value) =>
									formatCurrency(value).replace('$', '$')
								}
							/>
							<Tooltip
								contentStyle={{
									backgroundColor: 'hsl(var(--popover))',
									border: '1px solid hsl(var(--border))',
									borderRadius: '12px',
									boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
									color: 'hsl(var(--popover-foreground))',
								}}
								formatter={(value: number, name: string) => [
									formatCurrency(value),
									name === 'inflow'
										? 'Money In'
										: name === 'outflow'
										? 'Money Out'
										: 'Net Flow',
								]}
								labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
							/>
							<Area
								type="monotone"
								dataKey="inflow"
								stackId="1"
								stroke={colors.chart5}
								fill="url(#colorInflow)"
								strokeWidth={2}
							/>
							<Area
								type="monotone"
								dataKey="outflow"
								stackId="2"
								stroke={colors.chart1}
								fill="url(#colorOutflow)"
								strokeWidth={2}
							/>
							<Area
								type="monotone"
								dataKey="net"
								stroke={colors.primary}
								fill="url(#colorNet)"
								strokeWidth={3}
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>
				<div className="flex items-center gap-6 pt-4 text-sm">
					<div className="flex items-center gap-2">
						<div
							className="w-3 h-3 rounded-full"
							style={{ backgroundColor: colors.chart5 }}
						></div>
						<span className="text-muted-foreground">Money In</span>
					</div>
					<div className="flex items-center gap-2">
						<div
							className="w-3 h-3 rounded-full"
							style={{ backgroundColor: colors.chart1 }}
						></div>
						<span className="text-muted-foreground">Money Out</span>
					</div>
					<div className="flex items-center gap-2">
						<div
							className="w-3 h-3 rounded-full"
							style={{ backgroundColor: colors.primary }}
						></div>
						<span className="font-medium">Net: {formatCurrency(totalNet)}</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
