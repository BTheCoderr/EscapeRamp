import { 
  Account, Contact, Transaction, Invoice, Bill, BankAccount, 
  Company, TaxRate, FilterParams, PaginatedResult,
  DashboardStats, ProfitLossData, BalanceSheetData, CashFlowData,
  ReportPeriod
} from './types';
import { generateMockData } from './seed';

// Simulate API delay
const delay = (ms: number = 100) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory store
class MockStore {
  private data: ReturnType<typeof generateMockData>;
  private initialized = false;

  constructor() {
    this.data = generateMockData();
  }

  async init() {
    if (this.initialized) return;
    
    // Try to load from localStorage
    try {
      const stored = localStorage.getItem('accounting-app-data');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        this.data = this.deserializeData(parsed);
      }
    } catch (error) {
      console.warn('Failed to load data from localStorage:', error);
    }
    
    this.initialized = true;
  }

  private serializeData(data: any): any {
    return JSON.parse(JSON.stringify(data, (key, value) => {
      if (value instanceof Date) {
        return { __type: 'Date', value: value.toISOString() };
      }
      return value;
    }));
  }

  private deserializeData(data: any): any {
    return JSON.parse(JSON.stringify(data), (key, value) => {
      if (value && typeof value === 'object' && value.__type === 'Date') {
        return new Date(value.value);
      }
      return value;
    });
  }

  async save() {
    try {
      const serialized = this.serializeData(this.data);
      localStorage.setItem('accounting-app-data', JSON.stringify(serialized));
    } catch (error) {
      console.warn('Failed to save data to localStorage:', error);
    }
  }

  async reset() {
    this.data = generateMockData();
    await this.save();
  }

  getData() {
    return this.data;
  }

  setData(data: ReturnType<typeof generateMockData>) {
    this.data = data;
  }
}

// Global store instance
const store = new MockStore();

// Repository classes
export class AccountsRepository {
  async list(): Promise<Account[]> {
    await store.init();
    await delay();
    return [...store.getData().accounts];
  }

  async get(id: string): Promise<Account | null> {
    await store.init();
    await delay();
    return store.getData().accounts.find(account => account.id === id) || null;
  }

  async create(account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>): Promise<Account> {
    await store.init();
    await delay();
    
    const newAccount: Account = {
      ...account,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    store.getData().accounts.push(newAccount);
    await store.save();
    return newAccount;
  }

  async update(id: string, updates: Partial<Account>): Promise<Account | null> {
    await store.init();
    await delay();
    
    const accounts = store.getData().accounts;
    const index = accounts.findIndex(account => account.id === id);
    if (index === -1) return null;
    
    accounts[index] = { ...accounts[index], ...updates, updatedAt: new Date() };
    await store.save();
    return accounts[index];
  }

  async delete(id: string): Promise<boolean> {
    await store.init();
    await delay();
    
    const accounts = store.getData().accounts;
    const index = accounts.findIndex(account => account.id === id);
    if (index === -1) return false;
    
    accounts.splice(index, 1);
    await store.save();
    return true;
  }
}

export class ContactsRepository {
  async list(type?: 'customer' | 'vendor'): Promise<Contact[]> {
    await store.init();
    await delay();
    
    let contacts = [...store.getData().contacts];
    if (type) {
      contacts = contacts.filter(contact => contact.type === type);
    }
    
    return contacts;
  }

  async get(id: string): Promise<Contact | null> {
    await store.init();
    await delay();
    return store.getData().contacts.find(contact => contact.id === id) || null;
  }

  async create(contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contact> {
    await store.init();
    await delay();
    
    const newContact: Contact = {
      ...contact,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    store.getData().contacts.push(newContact);
    await store.save();
    return newContact;
  }

  async update(id: string, updates: Partial<Contact>): Promise<Contact | null> {
    await store.init();
    await delay();
    
    const contacts = store.getData().contacts;
    const index = contacts.findIndex(contact => contact.id === id);
    if (index === -1) return null;
    
    contacts[index] = { ...contacts[index], ...updates, updatedAt: new Date() };
    await store.save();
    return contacts[index];
  }

  async delete(id: string): Promise<boolean> {
    await store.init();
    await delay();
    
    const contacts = store.getData().contacts;
    const index = contacts.findIndex(contact => contact.id === id);
    if (index === -1) return false;
    
    contacts.splice(index, 1);
    await store.save();
    return true;
  }
}

export class TransactionsRepository {
  async list(params: FilterParams = {}): Promise<PaginatedResult<Transaction>> {
    await store.init();
    await delay();
    
    let transactions = [...store.getData().transactions];
    
    // Apply filters
    if (params.startDate) {
      transactions = transactions.filter(t => t.date >= params.startDate!);
    }
    if (params.endDate) {
      transactions = transactions.filter(t => t.date <= params.endDate!);
    }
    if (params.accountId) {
      transactions = transactions.filter(t => t.accountId === params.accountId);
    }
    if (params.contactId) {
      transactions = transactions.filter(t => t.contactId === params.contactId);
    }
    if (params.status) {
      transactions = transactions.filter(t => t.status === params.status);
    }
    if (params.search) {
      const search = params.search.toLowerCase();
      transactions = transactions.filter(t => 
        t.description.toLowerCase().includes(search) ||
        t.memo?.toLowerCase().includes(search) ||
        t.account?.name.toLowerCase().includes(search) ||
        t.contact?.name.toLowerCase().includes(search)
      );
    }
    
    const total = transactions.length;
    const limit = params.limit || 50;
    const offset = params.offset || 0;
    
    transactions = transactions.slice(offset, offset + limit);
    
    return { data: transactions, total, limit, offset };
  }

  async get(id: string): Promise<Transaction | null> {
    await store.init();
    await delay();
    return store.getData().transactions.find(transaction => transaction.id === id) || null;
  }

  async create(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
    await store.init();
    await delay();
    
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    store.getData().transactions.unshift(newTransaction);
    await store.save();
    return newTransaction;
  }

  async update(id: string, updates: Partial<Transaction>): Promise<Transaction | null> {
    await store.init();
    await delay();
    
    const transactions = store.getData().transactions;
    const index = transactions.findIndex(transaction => transaction.id === id);
    if (index === -1) return null;
    
    transactions[index] = { ...transactions[index], ...updates, updatedAt: new Date() };
    await store.save();
    return transactions[index];
  }

  async delete(id: string): Promise<boolean> {
    await store.init();
    await delay();
    
    const transactions = store.getData().transactions;
    const index = transactions.findIndex(transaction => transaction.id === id);
    if (index === -1) return false;
    
    transactions.splice(index, 1);
    await store.save();
    return true;
  }

  async bulkUpdate(ids: string[], updates: Partial<Transaction>): Promise<Transaction[]> {
    await store.init();
    await delay();
    
    const transactions = store.getData().transactions;
    const updated: Transaction[] = [];
    
    for (const id of ids) {
      const index = transactions.findIndex(t => t.id === id);
      if (index !== -1) {
        transactions[index] = { ...transactions[index], ...updates, updatedAt: new Date() };
        updated.push(transactions[index]);
      }
    }
    
    if (updated.length > 0) {
      await store.save();
    }
    
    return updated;
  }
}

export class InvoicesRepository {
  async list(params: FilterParams = {}): Promise<PaginatedResult<Invoice>> {
    await store.init();
    await delay();
    
    let invoices = [...store.getData().invoices];
    
    // Apply filters
    if (params.startDate) {
      invoices = invoices.filter(i => i.issueDate >= params.startDate!);
    }
    if (params.endDate) {
      invoices = invoices.filter(i => i.issueDate <= params.endDate!);
    }
    if (params.contactId) {
      invoices = invoices.filter(i => i.customerId === params.contactId);
    }
    if (params.status) {
      invoices = invoices.filter(i => i.status === params.status);
    }
    if (params.search) {
      const search = params.search.toLowerCase();
      invoices = invoices.filter(i => 
        i.number.toLowerCase().includes(search) ||
        i.customer?.name.toLowerCase().includes(search)
      );
    }
    
    const total = invoices.length;
    const limit = params.limit || 50;
    const offset = params.offset || 0;
    
    invoices = invoices.slice(offset, offset + limit);
    
    return { data: invoices, total, limit, offset };
  }

  async get(id: string): Promise<Invoice | null> {
    await store.init();
    await delay();
    return store.getData().invoices.find(invoice => invoice.id === id) || null;
  }

  async create(invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<Invoice> {
    await store.init();
    await delay();
    
    const newInvoice: Invoice = {
      ...invoice,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    store.getData().invoices.unshift(newInvoice);
    await store.save();
    return newInvoice;
  }

  async update(id: string, updates: Partial<Invoice>): Promise<Invoice | null> {
    await store.init();
    await delay();
    
    const invoices = store.getData().invoices;
    const index = invoices.findIndex(invoice => invoice.id === id);
    if (index === -1) return null;
    
    invoices[index] = { ...invoices[index], ...updates, updatedAt: new Date() };
    await store.save();
    return invoices[index];
  }

  async delete(id: string): Promise<boolean> {
    await store.init();
    await delay();
    
    const invoices = store.getData().invoices;
    const index = invoices.findIndex(invoice => invoice.id === id);
    if (index === -1) return false;
    
    invoices.splice(index, 1);
    await store.save();
    return true;
  }
}

export class BillsRepository {
  async list(params: FilterParams = {}): Promise<PaginatedResult<Bill>> {
    await store.init();
    await delay();
    
    let bills = [...store.getData().bills];
    
    // Apply filters similar to invoices
    if (params.startDate) {
      bills = bills.filter(b => b.issueDate >= params.startDate!);
    }
    if (params.endDate) {
      bills = bills.filter(b => b.issueDate <= params.endDate!);
    }
    if (params.contactId) {
      bills = bills.filter(b => b.vendorId === params.contactId);
    }
    if (params.status) {
      bills = bills.filter(b => b.status === params.status);
    }
    if (params.search) {
      const search = params.search.toLowerCase();
      bills = bills.filter(b => 
        b.number.toLowerCase().includes(search) ||
        b.vendor?.name.toLowerCase().includes(search)
      );
    }
    
    const total = bills.length;
    const limit = params.limit || 50;
    const offset = params.offset || 0;
    
    bills = bills.slice(offset, offset + limit);
    
    return { data: bills, total, limit, offset };
  }

  async get(id: string): Promise<Bill | null> {
    await store.init();
    await delay();
    return store.getData().bills.find(bill => bill.id === id) || null;
  }

  async create(bill: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'>): Promise<Bill> {
    await store.init();
    await delay();
    
    const newBill: Bill = {
      ...bill,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    store.getData().bills.unshift(newBill);
    await store.save();
    return newBill;
  }

  async update(id: string, updates: Partial<Bill>): Promise<Bill | null> {
    await store.init();
    await delay();
    
    const bills = store.getData().bills;
    const index = bills.findIndex(bill => bill.id === id);
    if (index === -1) return null;
    
    bills[index] = { ...bills[index], ...updates, updatedAt: new Date() };
    await store.save();
    return bills[index];
  }

  async delete(id: string): Promise<boolean> {
    await store.init();
    await delay();
    
    const bills = store.getData().bills;
    const index = bills.findIndex(bill => bill.id === id);
    if (index === -1) return false;
    
    bills.splice(index, 1);
    await store.save();
    return true;
  }
}

export class BankAccountsRepository {
  async list(): Promise<BankAccount[]> {
    await store.init();
    await delay();
    return [...store.getData().bankAccounts];
  }

  async get(id: string): Promise<BankAccount | null> {
    await store.init();
    await delay();
    return store.getData().bankAccounts.find(account => account.id === id) || null;
  }
}

export class CompanyRepository {
  async get(): Promise<Company> {
    await store.init();
    await delay();
    return store.getData().company;
  }

  async update(updates: Partial<Company>): Promise<Company> {
    await store.init();
    await delay();
    
    const data = store.getData();
    data.company = { ...data.company, ...updates };
    await store.save();
    return data.company;
  }
}

export class ReportsRepository {
  async getDashboardStats(): Promise<DashboardStats> {
    await store.init();
    await delay();
    
    const data = store.getData();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    
    // Cash on hand (sum of bank accounts)
    const cashOnHand = data.bankAccounts.reduce((sum, account) => sum + account.balance, 0);
    
    // Monthly revenue (paid invoices this month)
    const monthlyRevenue = data.invoices
      .filter(invoice => 
        invoice.status === 'paid' && 
        invoice.issueDate >= startOfMonth
      )
      .reduce((sum, invoice) => sum + invoice.total, 0);
    
    // Last month revenue for comparison
    const lastMonthRevenue = data.invoices
      .filter(invoice => 
        invoice.status === 'paid' && 
        invoice.issueDate >= startOfLastMonth &&
        invoice.issueDate <= endOfLastMonth
      )
      .reduce((sum, invoice) => sum + invoice.total, 0);
    
    // Monthly expenses (paid bills this month)
    const monthlyExpenses = data.bills
      .filter(bill => 
        bill.status === 'paid' && 
        bill.issueDate >= startOfMonth
      )
      .reduce((sum, bill) => sum + bill.total, 0);
    
    // Last month expenses for comparison
    const lastMonthExpenses = data.bills
      .filter(bill => 
        bill.status === 'paid' && 
        bill.issueDate >= startOfLastMonth &&
        bill.issueDate <= endOfLastMonth
      )
      .reduce((sum, bill) => sum + bill.total, 0);
    
    const netProfit = monthlyRevenue - monthlyExpenses;
    const lastMonthProfit = lastMonthRevenue - lastMonthExpenses;
    
    // Accounts receivable (unpaid invoices)
    const accountsReceivable = data.invoices
      .filter(invoice => invoice.status !== 'paid' && invoice.status !== 'cancelled')
      .reduce((sum, invoice) => sum + invoice.amountDue, 0);
    
    // Accounts payable (unpaid bills)
    const accountsPayable = data.bills
      .filter(bill => bill.status !== 'paid' && bill.status !== 'cancelled')
      .reduce((sum, bill) => sum + bill.amountDue, 0);
    
    // Calculate percentage changes
    const revenueChange = lastMonthRevenue > 0 ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;
    const expenseChange = lastMonthExpenses > 0 ? ((monthlyExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 : 0;
    const profitChange = lastMonthProfit !== 0 ? ((netProfit - lastMonthProfit) / Math.abs(lastMonthProfit)) * 100 : 0;
    
    return {
      cashOnHand,
      monthlyRevenue,
      monthlyExpenses,
      netProfit,
      accountsReceivable,
      accountsPayable,
      revenueChange,
      expenseChange,
      profitChange
    };
  }
}

// Export repository instances
export const accountsRepo = new AccountsRepository();
export const contactsRepo = new ContactsRepository();
export const transactionsRepo = new TransactionsRepository();
export const invoicesRepo = new InvoicesRepository();
export const billsRepo = new BillsRepository();
export const bankAccountsRepo = new BankAccountsRepository();
export const companyRepo = new CompanyRepository();
export const reportsRepo = new ReportsRepository();

// Utility function to reset all data
export const resetMockData = async () => {
  await store.reset();
};
