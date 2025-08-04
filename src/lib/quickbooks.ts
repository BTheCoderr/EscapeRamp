import OAuthClient from 'intuit-oauth';
import QuickBooks from 'node-quickbooks';

// QuickBooks OAuth Configuration
const oauthClient = new OAuthClient({
  clientId: process.env.QUICKBOOKS_CLIENT_ID!,
  clientSecret: process.env.QUICKBOOKS_CLIENT_SECRET!,
  environment: (process.env.QUICKBOOKS_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
  redirectUri: process.env.QUICKBOOKS_REDIRECT_URI!,
});

export interface QBAccount {
  Id: string;
  Name: string;
  AccountType: string;
  AccountSubType: string;
  Classification: string;
  CurrentBalance: number;
  CurrencyRef: {
    value: string;
    name: string;
  };
}

export interface QBCustomer {
  Id: string;
  DisplayName: string;
  CompanyName?: string;
  PrimaryEmailAddr?: {
    Address: string;
  };
  BillAddr?: {
    Line1: string;
    City: string;
    CountrySubDivisionCode: string;
    PostalCode: string;
    Country: string;
  };
}

export interface QBInvoice {
  Id: string;
  DocNumber: string;
  CustomerRef: {
    value: string;
    name: string;
  };
  Line: Array<{
    Amount: number;
    DetailType: string;
    SalesItemLineDetail?: {
      ItemRef: {
        value: string;
        name: string;
      };
      Qty: number;
      UnitPrice: number;
    };
  }>;
  TotalAmt: number;
  DueDate: string;
  TxnDate: string;
}

export class QuickBooksService {
  private qbo: QuickBooks | null = null;

  // Get OAuth authorization URL
  getAuthorizationUrl(): string {
    return oauthClient.authorizeUri({
      scope: [
        OAuthClient.scopes.Accounting,
        OAuthClient.scopes.OpenId,
        OAuthClient.scopes.Profile,
        OAuthClient.scopes.Email,
      ],
      state: 'teststate',
    });
  }

  // Handle OAuth callback
  async handleCallback(url: string) {
    try {
      const authResponse = await oauthClient.createToken(url);
      const { access_token, refresh_token, realmId } = authResponse.token;
      
      // Initialize QuickBooks client
      this.qbo = new QuickBooks(
        process.env.QUICKBOOKS_CLIENT_ID!,
        process.env.QUICKBOOKS_CLIENT_SECRET!,
        access_token,
        false, // no debug
        realmId,
        (process.env.QUICKBOOKS_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
        true, // enable logging
        4, // set minor version
        '2.0', // oauth version
        refresh_token
      );

      return {
        access_token,
        refresh_token,
        realmId,
        success: true
      };
    } catch (error) {
      console.error('OAuth callback error:', error);
      throw error;
    }
  }

  // Initialize with existing tokens
  initialize(accessToken: string, refreshToken: string, realmId: string) {
    this.qbo = new QuickBooks(
      process.env.QUICKBOOKS_CLIENT_ID!,
      process.env.QUICKBOOKS_CLIENT_SECRET!,
      accessToken,
      false,
      realmId,
      (process.env.QUICKBOOKS_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
      true,
      4,
      '2.0',
      refreshToken
    );
  }

  // Get all accounts
  async getAccounts(): Promise<QBAccount[]> {
    if (!this.qbo) throw new Error('QuickBooks not initialized');
    
    return new Promise((resolve, reject) => {
      this.qbo!.findAccounts({
        limit: 1000
      }, (err, accounts) => {
        if (err) {
          reject(err);
        } else {
          resolve(accounts.QueryResponse.Account || []);
        }
      });
    });
  }

  // Get all customers
  async getCustomers(): Promise<QBCustomer[]> {
    if (!this.qbo) throw new Error('QuickBooks not initialized');
    
    return new Promise((resolve, reject) => {
      this.qbo!.findCustomers({
        limit: 1000
      }, (err, customers) => {
        if (err) {
          reject(err);
        } else {
          resolve(customers.QueryResponse.Customer || []);
        }
      });
    });
  }

  // Get all invoices
  async getInvoices(): Promise<QBInvoice[]> {
    if (!this.qbo) throw new Error('QuickBooks not initialized');
    
    return new Promise((resolve, reject) => {
      this.qbo!.findInvoices({
        limit: 1000
      }, (err, invoices) => {
        if (err) {
          reject(err);
        } else {
          resolve(invoices.QueryResponse.Invoice || []);
        }
      });
    });
  }

  // Create a new account
  async createAccount(accountData: Partial<QBAccount>): Promise<QBAccount> {
    if (!this.qbo) throw new Error('QuickBooks not initialized');
    
    return new Promise((resolve, reject) => {
      this.qbo!.createAccount(accountData, (err, account) => {
        if (err) {
          reject(err);
        } else {
          resolve(account);
        }
      });
    });
  }

  // Create a new customer
  async createCustomer(customerData: Partial<QBCustomer>): Promise<QBCustomer> {
    if (!this.qbo) throw new Error('QuickBooks not initialized');
    
    return new Promise((resolve, reject) => {
      this.qbo!.createCustomer(customerData, (err, customer) => {
        if (err) {
          reject(err);
        } else {
          resolve(customer);
        }
      });
    });
  }

  // Create a new invoice
  async createInvoice(invoiceData: Partial<QBInvoice>): Promise<QBInvoice> {
    if (!this.qbo) throw new Error('QuickBooks not initialized');
    
    return new Promise((resolve, reject) => {
      this.qbo!.createInvoice(invoiceData, (err, invoice) => {
        if (err) {
          reject(err);
        } else {
          resolve(invoice);
        }
      });
    });
  }

  // Get company info
  async getCompanyInfo() {
    const qbo = this.qbo;
    if (!qbo) throw new Error('QuickBooks not initialized');
    
    return new Promise((resolve, reject) => {
      qbo.getCompanyInfo(qbo.realmId, (err, companyInfo) => {
        if (err) {
          reject(err);
        } else {
          resolve(companyInfo);
        }
      });
    });
  }
}

// Export singleton instance
export const quickBooksService = new QuickBooksService(); 