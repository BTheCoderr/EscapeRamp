"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercentage } from "@/lib/mock/currency";

interface StatCardProps {
  title: string;
  value: number;
  change?: number;
  format?: 'currency' | 'number' | 'percentage';
  icon?: React.ReactNode;
  description?: string;
}

export function StatCard({ 
  title, 
  value, 
  change, 
  format = 'currency',
  icon,
  description 
}: StatCardProps) {
  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return formatCurrency(val);
      case 'percentage':
        return formatPercentage(val);
      case 'number':
        return val.toLocaleString();
      default:
        return val.toString();
    }
  };

  const isPositive = change !== undefined ? change >= 0 : null;
  const changeIcon = isPositive ? TrendingUp : TrendingDown;
  const ChangeIcon = changeIcon;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon && (
          <div className="text-muted-foreground">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-tabular">
          {formatValue(value)}
        </div>
        {change !== undefined && (
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <ChangeIcon className={`mr-1 h-3 w-3 ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`} />
            <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
              {Math.abs(change).toFixed(1)}%
            </span>
            <span className="ml-1">from last month</span>
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
