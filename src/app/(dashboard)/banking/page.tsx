"use client";

import * as React from "react";
import {
  CreditCard,
  Building2,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Plus,
  Download,
  RefreshCw,
  Eye,
  Settings,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { BankAccount, Transaction } from "@/lib/mock/types";
import { bankAccountsRepo, transactionsRepo } from "@/lib/mock/repository";
import { formatCurrency } from "@/lib/mock/currency";
import { formatDate, formatRelativeTime } from "@/lib/mock/format";

export default function BankingPage() {
  const [bankAccounts, setBankAccounts] = React.useState<BankAccount[]>([]);
  const [recentTransactions, setRecentTransactions] = React.useState<Transaction[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadBankingData = async () => {
      try {
        const [accountsResult, transactionsResult] = await Promise.all([
          bankAccountsRepo.list(),
          transactionsRepo.list({ limit: 20 }),
        ]);
        
        setBankAccounts(accountsResult);
        setRecentTransactions(transactionsResult.data);
      } catch (error) {
        console.error("Failed to load banking data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBankingData();
  }, []);

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case 'checking':
      case 'savings':
        return <Building2 className="h-5 w-5" />;
      case 'credit_card':
        return <CreditCard className="h-5 w-5" />;
      default:
        return <Building2 className="h-5 w-5" />;
    }
  };

  const getAccountTypeBadge = (type: string) => {
    const variants = {
      checking: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      savings: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      credit_card: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      line_of_credit: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    };
    
    return (
      <Badge variant="secondary" className={variants[type as keyof typeof variants] || ""}>
        {type.replace('_', ' ')}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Banking</h1>
          <p className="text-muted-foreground">
            Manage your bank accounts and reconcile transactions.
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-4 w-40" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const totalBalance = bankAccounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Banking</h1>
          <p className="text-muted-foreground">
            Manage your bank accounts and reconcile transactions.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync Accounts
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Account
          </Button>
        </div>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Total Balance
          </CardTitle>
          <CardDescription>
            Combined balance across all accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold font-tabular">
            {formatCurrency(totalBalance)}
          </div>
        </CardContent>
      </Card>

      {/* Bank Accounts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {bankAccounts.map((account) => (
          <Card key={account.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getAccountTypeIcon(account.type)}
                  <CardTitle className="text-lg">{account.name}</CardTitle>
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
                      <Eye className="mr-2 h-4 w-4" />
                      View Transactions
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reconcile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Account Settings
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center gap-2">
                {getAccountTypeBadge(account.type)}
                <span className="text-sm text-muted-foreground">
                  {account.institution}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-2xl font-bold font-tabular">
                  {formatCurrency(account.balance)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Current Balance
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium">
                    {formatCurrency(account.reconciledBalance)}
                  </div>
                  <div className="text-muted-foreground">
                    Reconciled
                  </div>
                </div>
                <div>
                  <div className="font-medium">
                    {account.lastReconciled 
                      ? formatRelativeTime(account.lastReconciled)
                      : "Never"
                    }
                  </div>
                  <div className="text-muted-foreground">
                    Last Reconciled
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <Button variant="outline" className="w-full" size="sm">
                  View Transactions
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                Latest transactions across all accounts
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.slice(0, 10).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    transaction.type === 'credit' 
                      ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
                      : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    {transaction.type === 'credit' ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {transaction.account?.name} • {formatDate(transaction.date, "MMM d")}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-medium font-tabular ${
                    transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'credit' ? '+' : '-'}
                    {formatCurrency(Math.abs(transaction.amount))}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          
          <div className="pt-4 border-t">
            <Button variant="outline" className="w-full">
              View All Transactions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
