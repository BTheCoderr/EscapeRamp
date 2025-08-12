export interface Account {
  id: string;
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'income' | 'expense';
  subtype: string;
  balance: number;
  parentId?: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contact {
  id: string;
  type: 'customer' | 'vendor' | 'employee';
  name: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  taxId?: string;
  paymentTerms?: string;
  creditLimit?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  accountId: string;
  account?: Account;
  contactId?: string;
  contact?: Contact;
  categoryId?: string;
  category?: string;
  invoiceId?: string;
  billId?: string;
  status: 'pending' | 'cleared' | 'reconciled';
  memo?: string;
  attachments?: string[];
  splits?: TransactionSplit[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionSplit {
  id: string;
  accountId: string;
  amount: number;
  description?: string;
  memo?: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  taxRate?: number;
  taxAmount?: number;
  accountId?: string;
}

export interface Invoice {
  id: string;
  number: string;
  customerId: string;
  customer?: Contact;
  issueDate: Date;
  dueDate: Date;
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'cancelled';
  lineItems: LineItem[];
  subtotal: number;
  taxTotal: number;
  total: number;
  amountPaid: number;
  amountDue: number;
  notes?: string;
  terms?: string;
  attachments?: string[];
  payments?: Payment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Bill {
  id: string;
  number: string;
  vendorId: string;
  vendor?: Contact;
  issueDate: Date;
  dueDate: Date;
  status: 'draft' | 'scheduled' | 'paid' | 'overdue' | 'cancelled';
  lineItems: LineItem[];
  subtotal: number;
  taxTotal: number;
  total: number;
  amountPaid: number;
  amountDue: number;
  notes?: string;
  attachments?: string[];
  payments?: Payment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  amount: number;
  date: Date;
  method: 'cash' | 'check' | 'credit_card' | 'bank_transfer' | 'other';
  reference?: string;
  memo?: string;
  accountId: string;
  account?: Account;
}

export interface BankAccount {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit_card' | 'line_of_credit';
  accountNumber: string;
  routingNumber?: string;
  institution: string;
  balance: number;
  reconciledBalance: number;
  lastReconciled?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReconciliationItem {
  id: string;
  bankAccountId: string;
  transactionId?: string;
  statementDate: Date;
  description: string;
  amount: number;
  status: 'unmatched' | 'matched' | 'excluded';
  matchedTransactionId?: string;
}

export interface TaxRate {
  id: string;
  name: string;
  rate: number;
  description?: string;
  isActive: boolean;
}

export interface Company {
  id: string;
  name: string;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  phone?: string;
  email?: string;
  website?: string;
  taxId?: string;
  logo?: string;
  fiscalYearStart: number; // month (1-12)
  baseCurrency: string;
  dateFormat: string;
  timeZone: string;
}

export interface ReportPeriod {
  start: Date;
  end: Date;
  label: string;
}

export interface ProfitLossData {
  period: ReportPeriod;
  income: { [accountId: string]: number };
  expenses: { [accountId: string]: number };
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
}

export interface BalanceSheetData {
  period: ReportPeriod;
  assets: { [accountId: string]: number };
  liabilities: { [accountId: string]: number };
  equity: { [accountId: string]: number };
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
}

export interface CashFlowData {
  period: ReportPeriod;
  operating: { [category: string]: number };
  investing: { [category: string]: number };
  financing: { [category: string]: number };
  netCashFlow: number;
}

export interface DashboardStats {
  cashOnHand: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  netProfit: number;
  accountsReceivable: number;
  accountsPayable: number;
  revenueChange: number;
  expenseChange: number;
  profitChange: number;
}

export interface FilterParams {
  startDate?: Date;
  endDate?: Date;
  accountId?: string;
  contactId?: string;
  status?: string;
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}
