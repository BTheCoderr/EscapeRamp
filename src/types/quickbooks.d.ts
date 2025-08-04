declare module 'intuit-oauth' {
  export default class OAuthClient {
    constructor(config: {
      clientId: string;
      clientSecret: string;
      environment: string;
      redirectUri: string;
    });

    authorizeUri(options: {
      scope: string[];
      state: string;
    }): string;

    createToken(url: string): Promise<{
      token: {
        access_token: string;
        refresh_token: string;
        realmId: string;
      };
    }>;

    static scopes: {
      Accounting: string;
      OpenId: string;
      Profile: string;
      Email: string;
    };
  }
}

declare module 'node-quickbooks' {
  export default class QuickBooks {
    constructor(
      clientId: string,
      clientSecret: string,
      accessToken: string,
      debug: boolean,
      realmId: string,
      environment: string,
      logging: boolean,
      minorVersion: number,
      oauthVersion: string,
      refreshToken: string
    );

    realmId: string;

    findAccounts(query: any, callback: (err: any, accounts: any) => void): void;
    findCustomers(query: any, callback: (err: any, customers: any) => void): void;
    findInvoices(query: any, callback: (err: any, invoices: any) => void): void;
    
    createAccount(accountData: any, callback: (err: any, account: any) => void): void;
    createCustomer(customerData: any, callback: (err: any, customer: any) => void): void;
    createInvoice(invoiceData: any, callback: (err: any, invoice: any) => void): void;
    
    getCompanyInfo(realmId: string, callback: (err: any, companyInfo: any) => void): void;
  }
} 