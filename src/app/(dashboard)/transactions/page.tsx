"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  MoreHorizontal,
  Plus,
  Filter,
  Calendar,
  Paperclip,
  Edit,
  Trash,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DataTable } from "@/components/tables/data-table";
import { Transaction } from "@/lib/mock/types";
import { transactionsRepo, accountsRepo } from "@/lib/mock/repository";
import { formatCurrency } from "@/lib/mock/currency";
import { formatDate } from "@/lib/mock/format";

export default function TransactionsPage() {
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [accounts, setAccounts] = React.useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = React.useState(true);
  const [filters, setFilters] = React.useState({
    account: "",
    status: "",
    type: "",
  });

  const loadTransactions = React.useCallback(async () => {
    try {
      setLoading(true);
      const [transactionsResult, accountsResult] = await Promise.all([
        transactionsRepo.list({ 
          accountId: filters.account && filters.account !== "all" ? filters.account : undefined,
          status: filters.status && filters.status !== "all" ? filters.status : undefined,
          limit: 100 
        }),
        accountsRepo.list(),
      ]);
      
      setTransactions(transactionsResult.data);
      setAccounts(accountsResult.map(a => ({ id: a.id, name: a.name })));
    } catch (error) {
      console.error("Failed to load transactions:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  React.useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      cleared: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      reconciled: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    };
    
    return (
      <Badge variant="secondary" className={colors[status as keyof typeof colors] || ""}>
        {status}
      </Badge>
    );
  };

  const columns: ColumnDef<Transaction>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
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
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = row.getValue("date") as Date;
        return (
          <div className="font-medium">
            {formatDate(date, "MMM d, yyyy")}
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const description = row.getValue("description") as string;
        const memo = row.original.memo;
        return (
          <div className="space-y-1">
            <div className="font-medium">{description}</div>
            {memo && (
              <div className="text-sm text-muted-foreground">{memo}</div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "account",
      header: "Account",
      cell: ({ row }) => {
        const account = row.original.account;
        return (
          <div className="text-sm">
            {account ? `${account.code} - ${account.name}` : "Unknown"}
          </div>
        );
      },
    },
    {
      accessorKey: "contact",
      header: "Contact",
      cell: ({ row }) => {
        const contact = row.original.contact;
        return (
          <div className="text-sm">
            {contact?.name || "—"}
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const category = row.getValue("category") as string;
        return (
          <Badge variant="outline" className="text-xs">
            {category || "Uncategorized"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <div className="text-right">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="h-8 px-2"
            >
              Amount
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        const amount = row.getValue("amount") as number;
        const type = row.original.type;
        return (
          <div className={`text-right font-tabular font-medium ${
            type === "credit" ? "text-green-600" : "text-red-600"
          }`}>
            {type === "credit" ? "+" : "-"}{formatCurrency(Math.abs(amount))}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return getStatusBadge(status);
      },
    },
    {
      id: "attachments",
      header: "",
      cell: ({ row }) => {
        const attachments = row.original.attachments;
        return attachments && attachments.length > 0 ? (
          <Paperclip className="h-4 w-4 text-muted-foreground" />
        ) : null;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const transaction = row.original;

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
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(transaction.id)}
              >
                Copy transaction ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                Split transaction
              </DropdownMenuItem>
              <DropdownMenuItem>
                Attach receipt
              </DropdownMenuItem>
              <DropdownMenuSeparator />
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
        value={filters.account}
        onValueChange={(value) => setFilters(prev => ({ ...prev, account: value }))}
      >
        <SelectTrigger className="h-8 w-[180px]">
          <SelectValue placeholder="All accounts" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All accounts</SelectItem>
          {accounts.map((account) => (
            <SelectItem key={account.id} value={account.id}>
              {account.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.status}
        onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
      >
        <SelectTrigger className="h-8 w-[140px]">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="cleared">Cleared</SelectItem>
          <SelectItem value="reconciled">Reconciled</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.type}
        onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
      >
        <SelectTrigger className="h-8 w-[120px]">
          <SelectValue placeholder="All types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All types</SelectItem>
          <SelectItem value="debit">Debit</SelectItem>
          <SelectItem value="credit">Credit</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
            <p className="text-muted-foreground">
              Manage your business transactions and general ledger.
            </p>
          </div>
        </div>
        <div className="h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading transactions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            Manage your business transactions and general ledger.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={transactions}
        searchKey="description"
        searchPlaceholder="Search transactions..."
        onAdd={() => console.log("Add transaction")}
        onExport={() => console.log("Export transactions")}
        toolbar={toolbar}
      />
    </div>
  );
}
