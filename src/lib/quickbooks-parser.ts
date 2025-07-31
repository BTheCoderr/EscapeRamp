import { z } from 'zod';

// QuickBooks Data Schemas
export const QuickBooksAccountSchema = z.object({
  Account: z.string(),
  AccountType: z.string(),
  Description: z.string().optional(),
  Balance: z.number().optional(),
  AccountNumber: z.string().optional(),
  TaxLine: z.string().optional(),
  Active: z.boolean().optional(),
});

export const QuickBooksCustomerSchema = z.object({
  Customer: z.string(),
  CustomerType: z.string().optional(),
  CompanyName: z.string().optional(),
  FirstName: z.string().optional(),
  LastName: z.string().optional(),
  Phone: z.string().optional(),
  Email: z.string().optional(),
  Balance: z.number().optional(),
  Address1: z.string().optional(),
  Address2: z.string().optional(),
  City: z.string().optional(),
  State: z.string().optional(),
  Zip: z.string().optional(),
  Country: z.string().optional(),
});

export const QuickBooksVendorSchema = z.object({
  Vendor: z.string(),
  VendorType: z.string().optional(),
  CompanyName: z.string().optional(),
  FirstName: z.string().optional(),
  LastName: z.string().optional(),
  Phone: z.string().optional(),
  Email: z.string().optional(),
  Balance: z.number().optional(),
  Address1: z.string().optional(),
  Address2: z.string().optional(),
  City: z.string().optional(),
  State: z.string().optional(),
  Zip: z.string().optional(),
  Country: z.string().optional(),
});

export const QuickBooksItemSchema = z.object({
  Item: z.string(),
  ItemType: z.string(),
  Description: z.string().optional(),
  Rate: z.number().optional(),
  Cost: z.number().optional(),
  QuantityOnHand: z.number().optional(),
  Account: z.string().optional(),
  TaxCode: z.string().optional(),
  Active: z.boolean().optional(),
});

export const QuickBooksTransactionSchema = z.object({
  Date: z.string(),
  Type: z.string(),
  Num: z.string().optional(),
  Customer: z.string().optional(),
  Vendor: z.string().optional(),
  Account: z.string().optional(),
  Memo: z.string().optional(),
  Amount: z.number(),
  Debit: z.number().optional(),
  Credit: z.number().optional(),
});

// Data Types
export type QuickBooksAccount = z.infer<typeof QuickBooksAccountSchema>;
export type QuickBooksCustomer = z.infer<typeof QuickBooksCustomerSchema>;
export type QuickBooksVendor = z.infer<typeof QuickBooksVendorSchema>;
export type QuickBooksItem = z.infer<typeof QuickBooksItemSchema>;
export type QuickBooksTransaction = z.infer<typeof QuickBooksTransactionSchema>;

export interface QuickBooksData {
  accounts: QuickBooksAccount[];
  customers: QuickBooksCustomer[];
  vendors: QuickBooksVendor[];
  items: QuickBooksItem[];
  transactions: QuickBooksTransaction[];
  metadata: {
    companyName: string;
    fiscalYearStart: string;
    dataSize: number;
    recordCounts: {
      accounts: number;
      customers: number;
      vendors: number;
      items: number;
      transactions: number;
    };
  };
}

// Data Cleanup Functions
export const dataCleanupRules = {
  // Remove special characters from account numbers
  accountNumbers: (value: string): string => {
    return value.replace(/[^A-Za-z0-9\-_]/g, '');
  },
  
  // Standardize phone numbers
  phoneNumbers: (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6)}`;
    }
    return value;
  },
  
  // Validate email addresses
  emailAddresses: (value: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? value : null;
  },
  
  // Handle currency formatting
  currency: (value: string | number): number => {
    if (typeof value === 'number') return value;
    return parseFloat(value.toString().replace(/[$,]/g, '')) || 0;
  },
  
  // Clean company names
  companyNames: (value: string): string => {
    return value.trim().replace(/\s+/g, ' ');
  }
};

// Account Type Mapping
export const accountTypeMapping = {
  // QuickBooks Desktop to QuickBooks Online
  'Bank': 'Bank',
  'Accounts Receivable': 'Accounts Receivable',
  'Other Current Asset': 'Other Current Asset',
  'Fixed Asset': 'Fixed Asset',
  'Other Asset': 'Other Asset',
  'Accounts Payable': 'Accounts Payable',
  'Credit Card': 'Credit Card',
  'Other Current Liability': 'Other Current Liability',
  'Long Term Liability': 'Long Term Liability',
  'Equity': 'Equity',
  'Income': 'Income',
  'Other Income': 'Other Income',
  'Cost of Goods Sold': 'Cost of Goods Sold',
  'Expense': 'Expense',
  'Other Expense': 'Other Expense'
} as const;

// Item Type Mapping
export const itemTypeMapping = {
  'Service': 'Service',
  'Inventory Part': 'Inventory',
  'Non-inventory Part': 'Non-inventory',
  'Other Charge': 'Other Charge',
  'Subtotal': 'Subtotal',
  'Group': 'Group',
  'Discount': 'Discount',
  'Payment': 'Payment',
  'Sales Tax Item': 'Sales Tax Item',
  'Sales Tax Group': 'Sales Tax Group'
} as const;

export class QuickBooksParser {
  private data: QuickBooksData;

  constructor() {
    this.data = {
      accounts: [],
      customers: [],
      vendors: [],
      items: [],
      transactions: [],
      metadata: {
        companyName: '',
        fiscalYearStart: '',
        dataSize: 0,
        recordCounts: {
          accounts: 0,
          customers: 0,
          vendors: 0,
          items: 0,
          transactions: 0
        }
      }
    };
  }

  // Parse CSV data
  parseCSV(csvContent: string, dataType: 'accounts' | 'customers' | 'vendors' | 'items' | 'transactions'): any[] {
    const lines = csvContent.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row: any = {};

      headers.forEach((header, index) => {
        let value = values[index] || '';
        
        // Clean up the value
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }

        // Apply data cleanup rules
        switch (header.toLowerCase()) {
          case 'account':
          case 'accountnumber':
            row[header] = dataCleanupRules.accountNumbers(value);
            break;
          case 'phone':
            row[header] = dataCleanupRules.phoneNumbers(value);
            break;
          case 'email':
            row[header] = dataCleanupRules.emailAddresses(value);
            break;
          case 'balance':
          case 'rate':
          case 'cost':
          case 'amount':
          case 'debit':
          case 'credit':
            row[header] = dataCleanupRules.currency(value);
            break;
          case 'companyname':
            row[header] = dataCleanupRules.companyNames(value);
            break;
          default:
            row[header] = value;
        }
      });

      data.push(row);
    }

    return data;
  }

  // Parse IIF (Intuit Interchange Format) data
  parseIIF(iifContent: string): QuickBooksData {
    const lines = iifContent.split('\n').filter(line => line.trim());
    let currentSection = '';
    let currentData: any[] = [];

    for (const line of lines) {
      if (line.startsWith('!')) {
        // Save previous section data
        if (currentSection && currentData.length > 0) {
          this.processSection(currentSection, currentData);
        }

        // Start new section
        currentSection = line.substring(1);
        currentData = [];
      } else if (line.trim() && currentSection) {
        const values = line.split('\t');
        const row: any = {};
        
        // Map IIF fields to our schema
        switch (currentSection) {
          case 'ACCNT':
            row.Account = values[0];
            row.AccountType = values[1];
            row.Description = values[2];
            row.Balance = dataCleanupRules.currency(values[3] || '0');
            break;
          case 'CUST':
            row.Customer = values[0];
            row.CompanyName = values[1];
            row.FirstName = values[2];
            row.LastName = values[3];
            row.Phone = dataCleanupRules.phoneNumbers(values[4] || '');
            row.Email = dataCleanupRules.emailAddresses(values[5] || '');
            row.Balance = dataCleanupRules.currency(values[6] || '0');
            break;
          case 'VEND':
            row.Vendor = values[0];
            row.CompanyName = values[1];
            row.FirstName = values[2];
            row.LastName = values[3];
            row.Phone = dataCleanupRules.phoneNumbers(values[4] || '');
            row.Email = dataCleanupRules.emailAddresses(values[5] || '');
            row.Balance = dataCleanupRules.currency(values[6] || '0');
            break;
          case 'INVITEM':
            row.Item = values[0];
            row.ItemType = values[1];
            row.Description = values[2];
            row.Rate = dataCleanupRules.currency(values[3] || '0');
            row.Cost = dataCleanupRules.currency(values[4] || '0');
            row.Account = values[5];
            break;
          case 'TRNS':
            row.Date = values[0];
            row.Type = values[1];
            row.Num = values[2];
            row.Customer = values[3];
            row.Vendor = values[4];
            row.Account = values[5];
            row.Memo = values[6];
            row.Amount = dataCleanupRules.currency(values[7] || '0');
            break;
        }

        if (Object.keys(row).length > 0) {
          currentData.push(row);
        }
      }
    }

    // Process final section
    if (currentSection && currentData.length > 0) {
      this.processSection(currentSection, currentData);
    }

    return this.data;
  }

  private processSection(section: string, data: any[]) {
    switch (section) {
      case 'ACCNT':
        this.data.accounts = data.map(row => QuickBooksAccountSchema.parse(row));
        break;
      case 'CUST':
        this.data.customers = data.map(row => QuickBooksCustomerSchema.parse(row));
        break;
      case 'VEND':
        this.data.vendors = data.map(row => QuickBooksVendorSchema.parse(row));
        break;
      case 'INVITEM':
        this.data.items = data.map(row => QuickBooksItemSchema.parse(row));
        break;
      case 'TRNS':
        this.data.transactions = data.map(row => QuickBooksTransactionSchema.parse(row));
        break;
    }
  }

  // Validate data integrity
  validateData(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check for required fields
    this.data.accounts.forEach((account, index) => {
      if (!account.Account) {
        errors.push(`Account ${index + 1}: Missing account name`);
      }
      if (!account.AccountType) {
        errors.push(`Account ${index + 1}: Missing account type`);
      }
    });

    this.data.customers.forEach((customer, index) => {
      if (!customer.Customer) {
        errors.push(`Customer ${index + 1}: Missing customer name`);
      }
    });

    this.data.vendors.forEach((vendor, index) => {
      if (!vendor.Vendor) {
        errors.push(`Vendor ${index + 1}: Missing vendor name`);
      }
    });

    this.data.items.forEach((item, index) => {
      if (!item.Item) {
        errors.push(`Item ${index + 1}: Missing item name`);
      }
      if (!item.ItemType) {
        errors.push(`Item ${index + 1}: Missing item type`);
      }
    });

    // Check for duplicate records
    const accountNames = this.data.accounts.map(a => a.Account);
    const duplicateAccounts = accountNames.filter((name, index) => accountNames.indexOf(name) !== index);
    if (duplicateAccounts.length > 0) {
      errors.push(`Duplicate account names: ${duplicateAccounts.join(', ')}`);
    }

    const customerNames = this.data.customers.map(c => c.Customer);
    const duplicateCustomers = customerNames.filter((name, index) => customerNames.indexOf(name) !== index);
    if (duplicateCustomers.length > 0) {
      errors.push(`Duplicate customer names: ${duplicateCustomers.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Generate migration report
  generateMigrationReport(): any {
    const validation = this.validateData();
    
    return {
      summary: {
        totalRecords: {
          accounts: this.data.accounts.length,
          customers: this.data.customers.length,
          vendors: this.data.vendors.length,
          items: this.data.items.length,
          transactions: this.data.transactions.length
        },
        dataIntegrity: {
          isValid: validation.isValid,
          errorCount: validation.errors.length
        },
        estimatedMigrationTime: this.estimateMigrationTime(),
        complexity: this.assessComplexity()
      },
      details: {
        accounts: {
          total: this.data.accounts.length,
          byType: this.groupBy(this.data.accounts, 'AccountType'),
          mappedTypes: this.data.accounts.map(acc => ({
            original: acc.AccountType,
            mapped: accountTypeMapping[acc.AccountType as keyof typeof accountTypeMapping] || 'Other'
          }))
        },
        customers: {
          total: this.data.customers.length,
          byType: this.groupBy(this.data.customers, 'CustomerType'),
          withEmail: this.data.customers.filter(c => c.Email).length,
          withPhone: this.data.customers.filter(c => c.Phone).length
        },
        vendors: {
          total: this.data.vendors.length,
          byType: this.groupBy(this.data.vendors, 'VendorType'),
          withEmail: this.data.vendors.filter(v => v.Email).length,
          withPhone: this.data.vendors.filter(v => v.Phone).length
        },
        items: {
          total: this.data.items.length,
          byType: this.groupBy(this.data.items, 'ItemType'),
          mappedTypes: this.data.items.map(item => ({
            original: item.ItemType,
            mapped: itemTypeMapping[item.ItemType as keyof typeof itemTypeMapping] || 'Other'
          }))
        }
      },
      errors: validation.errors,
      recommendations: this.generateRecommendations()
    };
  }

  private groupBy(array: any[], key: string): Record<string, number> {
    return array.reduce((groups, item) => {
      const value = item[key] || 'Unknown';
      groups[value] = (groups[value] || 0) + 1;
      return groups;
    }, {});
  }

  private estimateMigrationTime(): string {
    const totalRecords = this.data.accounts.length + this.data.customers.length + 
                        this.data.vendors.length + this.data.items.length + 
                        this.data.transactions.length;
    
    if (totalRecords < 1000) return '30-60 minutes';
    if (totalRecords < 5000) return '1-2 hours';
    if (totalRecords < 10000) return '2-4 hours';
    return '4+ hours';
  }

  private assessComplexity(): 'Low' | 'Medium' | 'High' {
    const totalRecords = this.data.accounts.length + this.data.customers.length + 
                        this.data.vendors.length + this.data.items.length + 
                        this.data.transactions.length;
    
    if (totalRecords < 500) return 'Low';
    if (totalRecords < 2000) return 'Medium';
    return 'High';
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];

    // Check for data quality issues
    const customersWithoutEmail = this.data.customers.filter(c => !c.Email).length;
    if (customersWithoutEmail > 0) {
      recommendations.push(`Consider adding email addresses for ${customersWithoutEmail} customers for better communication`);
    }

    const vendorsWithoutEmail = this.data.vendors.filter(v => !v.Email).length;
    if (vendorsWithoutEmail > 0) {
      recommendations.push(`Consider adding email addresses for ${vendorsWithoutEmail} vendors for better communication`);
    }

    // Check for unmapped account types
    const unmappedAccountTypes = this.data.accounts
      .map(acc => acc.AccountType)
      .filter(type => !accountTypeMapping[type as keyof typeof accountTypeMapping]);
    
    if (unmappedAccountTypes.length > 0) {
      recommendations.push(`Review account type mapping for: ${[...new Set(unmappedAccountTypes)].join(', ')}`);
    }

    // Check for unmapped item types
    const unmappedItemTypes = this.data.items
      .map(item => item.ItemType)
      .filter(type => !itemTypeMapping[type as keyof typeof itemTypeMapping]);
    
    if (unmappedItemTypes.length > 0) {
      recommendations.push(`Review item type mapping for: ${[...new Set(unmappedItemTypes)].join(', ')}`);
    }

    return recommendations;
  }

  // Get parsed data
  getData(): QuickBooksData {
    return this.data;
  }

  // Reset parser
  reset(): void {
    this.data = {
      accounts: [],
      customers: [],
      vendors: [],
      items: [],
      transactions: [],
      metadata: {
        companyName: '',
        fiscalYearStart: '',
        dataSize: 0,
        recordCounts: {
          accounts: 0,
          customers: 0,
          vendors: 0,
          items: 0,
          transactions: 0
        }
      }
    };
  }
}

// Export singleton instance
export const quickBooksParser = new QuickBooksParser(); 