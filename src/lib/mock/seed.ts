import {
	Account,
	Contact,
	Transaction,
	Invoice,
	Bill,
	BankAccount,
	Company,
	LineItem,
	Payment,
	TaxRate,
} from './types';

// Utility to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Date utilities
const randomDate = (start: Date, end: Date) => {
	return new Date(
		start.getTime() + Math.random() * (end.getTime() - start.getTime())
	);
};

const daysAgo = (days: number) => {
	const date = new Date();
	date.setDate(date.getDate() - days);
	return date;
};

const daysFromNow = (days: number) => {
	const date = new Date();
	date.setDate(date.getDate() + days);
	return date;
};

// Sample data arrays
const companyNames = [
	'Acme Corp',
	'Global Solutions Inc',
	'TechStart LLC',
	'Creative Agency',
	'Marketing Pro',
	'Design Studio',
	'Consulting Group',
	'Innovation Labs',
	'Digital Solutions',
	'Business Partners',
	'Enterprise Co',
	'Startup Inc',
];

const vendorNames = [
	'Office Supply Co',
	'Tech Equipment Ltd',
	'Software Solutions',
	'Legal Services',
	'Accounting Firm',
	'Internet Provider',
	'Insurance Company',
	'Utilities Corp',
	'Marketing Agency',
	'Cleaning Services',
	'Security Systems',
	'Delivery Service',
];

const descriptions = [
	'Monthly subscription',
	'Equipment purchase',
	'Professional services',
	'Office supplies',
	'Software license',
	'Consulting fees',
	'Marketing campaign',
	'Legal consultation',
	'Equipment maintenance',
	'Travel expenses',
	'Training course',
	'Website development',
	'Social media management',
];

// Generate chart of accounts
export const generateAccounts = (): Account[] => {
	const accounts: Account[] = [];

	// Assets
	accounts.push(
		{
			id: '1',
			code: '1000',
			name: 'Cash',
			type: 'asset',
			subtype: 'current',
			balance: 25000,
			isActive: true,
			createdAt: daysAgo(365),
			updatedAt: daysAgo(1),
		},
		{
			id: '2',
			code: '1100',
			name: 'Accounts Receivable',
			type: 'asset',
			subtype: 'current',
			balance: 15000,
			isActive: true,
			createdAt: daysAgo(365),
			updatedAt: daysAgo(1),
		},
		{
			id: '3',
			code: '1200',
			name: 'Inventory',
			type: 'asset',
			subtype: 'current',
			balance: 8000,
			isActive: true,
			createdAt: daysAgo(365),
			updatedAt: daysAgo(1),
		},
		{
			id: '4',
			code: '1500',
			name: 'Equipment',
			type: 'asset',
			subtype: 'fixed',
			balance: 12000,
			isActive: true,
			createdAt: daysAgo(365),
			updatedAt: daysAgo(1),
		},
		{
			id: '5',
			code: '1600',
			name: 'Accumulated Depreciation',
			type: 'asset',
			subtype: 'fixed',
			balance: -2000,
			isActive: true,
			createdAt: daysAgo(365),
			updatedAt: daysAgo(1),
		}
	);

	// Liabilities
	accounts.push(
		{
			id: '6',
			code: '2000',
			name: 'Accounts Payable',
			type: 'liability',
			subtype: 'current',
			balance: 8500,
			isActive: true,
			createdAt: daysAgo(365),
			updatedAt: daysAgo(1),
		},
		{
			id: '7',
			code: '2100',
			name: 'Credit Card',
			type: 'liability',
			subtype: 'current',
			balance: 3200,
			isActive: true,
			createdAt: daysAgo(365),
			updatedAt: daysAgo(1),
		},
		{
			id: '8',
			code: '2500',
			name: 'Long-term Debt',
			type: 'liability',
			subtype: 'long-term',
			balance: 10000,
			isActive: true,
			createdAt: daysAgo(365),
			updatedAt: daysAgo(1),
		}
	);

	// Equity
	accounts.push(
		{
			id: '9',
			code: '3000',
			name: "Owner's Equity",
			type: 'equity',
			subtype: 'equity',
			balance: 50000,
			isActive: true,
			createdAt: daysAgo(365),
			updatedAt: daysAgo(1),
		},
		{
			id: '10',
			code: '3200',
			name: 'Retained Earnings',
			type: 'equity',
			subtype: 'equity',
			balance: 8300,
			isActive: true,
			createdAt: daysAgo(365),
			updatedAt: daysAgo(1),
		}
	);

	// Income
	accounts.push(
		{
			id: '11',
			code: '4000',
			name: 'Service Revenue',
			type: 'income',
			subtype: 'operating',
			balance: 0,
			isActive: true,
			createdAt: daysAgo(365),
			updatedAt: daysAgo(1),
		},
		{
			id: '12',
			code: '4100',
			name: 'Product Sales',
			type: 'income',
			subtype: 'operating',
			balance: 0,
			isActive: true,
			createdAt: daysAgo(365),
			updatedAt: daysAgo(1),
		},
		{
			id: '13',
			code: '4200',
			name: 'Interest Income',
			type: 'income',
			subtype: 'other',
			balance: 0,
			isActive: true,
			createdAt: daysAgo(365),
			updatedAt: daysAgo(1),
		}
	);

	// Expenses
	accounts.push(
		{
			id: '14',
			code: '5000',
			name: 'Office Supplies',
			type: 'expense',
			subtype: 'operating',
			balance: 0,
			isActive: true,
			createdAt: daysAgo(365),
			updatedAt: daysAgo(1),
		},
		{
			id: '15',
			code: '5100',
			name: 'Marketing',
			type: 'expense',
			subtype: 'operating',
			balance: 0,
			isActive: true,
			createdAt: daysAgo(365),
			updatedAt: daysAgo(1),
		},
		{
			id: '16',
			code: '5200',
			name: 'Professional Services',
			type: 'expense',
			subtype: 'operating',
			balance: 0,
			isActive: true,
			createdAt: daysAgo(365),
			updatedAt: daysAgo(1),
		},
		{
			id: '17',
			code: '5300',
			name: 'Rent',
			type: 'expense',
			subtype: 'operating',
			balance: 0,
			isActive: true,
			createdAt: daysAgo(365),
			updatedAt: daysAgo(1),
		},
		{
			id: '18',
			code: '5400',
			name: 'Utilities',
			type: 'expense',
			subtype: 'operating',
			balance: 0,
			isActive: true,
			createdAt: daysAgo(365),
			updatedAt: daysAgo(1),
		},
		{
			id: '19',
			code: '5500',
			name: 'Travel',
			type: 'expense',
			subtype: 'operating',
			balance: 0,
			isActive: true,
			createdAt: daysAgo(365),
			updatedAt: daysAgo(1),
		},
		{
			id: '20',
			code: '5600',
			name: 'Software Subscriptions',
			type: 'expense',
			subtype: 'operating',
			balance: 0,
			isActive: true,
			createdAt: daysAgo(365),
			updatedAt: daysAgo(1),
		}
	);

	return accounts;
};

// Generate contacts
export const generateContacts = (): Contact[] => {
	const contacts: Contact[] = [];

	// Customers
	for (let i = 0; i < 8; i++) {
		contacts.push({
			id: generateId(),
			type: 'customer',
			name: companyNames[i],
			email: `contact@${companyNames[i].toLowerCase().replace(/\s+/g, '')}.com`,
			phone: `(555) ${Math.floor(Math.random() * 900) + 100}-${
				Math.floor(Math.random() * 9000) + 1000
			}`,
			address: {
				line1: `${Math.floor(Math.random() * 9999) + 1} Business St`,
				city: 'San Francisco',
				state: 'CA',
				zip: `9${Math.floor(Math.random() * 9000) + 1000}`,
				country: 'US',
			},
			paymentTerms: ['Net 30', 'Net 15', 'Due on receipt'][
				Math.floor(Math.random() * 3)
			],
			creditLimit: Math.floor(Math.random() * 50000) + 10000,
			isActive: true,
			createdAt: randomDate(daysAgo(365), daysAgo(30)),
			updatedAt: randomDate(daysAgo(30), new Date()),
		});
	}

	// Vendors
	for (let i = 0; i < 8; i++) {
		contacts.push({
			id: generateId(),
			type: 'vendor',
			name: vendorNames[i],
			email: `billing@${vendorNames[i].toLowerCase().replace(/\s+/g, '')}.com`,
			phone: `(555) ${Math.floor(Math.random() * 900) + 100}-${
				Math.floor(Math.random() * 9000) + 1000
			}`,
			address: {
				line1: `${Math.floor(Math.random() * 9999) + 1} Vendor Ave`,
				city: 'Los Angeles',
				state: 'CA',
				zip: `9${Math.floor(Math.random() * 9000) + 1000}`,
				country: 'US',
			},
			paymentTerms: ['Net 30', 'Net 15', 'Net 45'][
				Math.floor(Math.random() * 3)
			],
			isActive: true,
			createdAt: randomDate(daysAgo(365), daysAgo(30)),
			updatedAt: randomDate(daysAgo(30), new Date()),
		});
	}

	return contacts;
};

// Generate transactions
export const generateTransactions = (
	accounts: Account[],
	contacts: Contact[]
): Transaction[] => {
	const transactions: Transaction[] = [];

	for (let i = 0; i < 150; i++) {
		const account = accounts[Math.floor(Math.random() * accounts.length)];
		const contact =
			Math.random() > 0.3
				? contacts[Math.floor(Math.random() * contacts.length)]
				: undefined;
		const amount = Math.floor(Math.random() * 5000) + 100;

		transactions.push({
			id: generateId(),
			date: randomDate(daysAgo(90), new Date()),
			description:
				descriptions[Math.floor(Math.random() * descriptions.length)],
			amount,
			type:
				account.type === 'expense' || account.type === 'asset'
					? 'debit'
					: 'credit',
			accountId: account.id,
			account,
			contactId: contact?.id,
			contact,
			category: account.name,
			status: ['pending', 'cleared', 'reconciled'][
				Math.floor(Math.random() * 3)
			] as any,
			memo:
				Math.random() > 0.7
					? 'Additional notes about this transaction'
					: undefined,
			createdAt: randomDate(daysAgo(90), new Date()),
			updatedAt: randomDate(daysAgo(30), new Date()),
		});
	}

	return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
};

// Generate invoices
export const generateInvoices = (customers: Contact[]): Invoice[] => {
	const invoices: Invoice[] = [];

	for (let i = 0; i < 25; i++) {
		const customer = customers[Math.floor(Math.random() * customers.length)];
		const issueDate = randomDate(daysAgo(60), new Date());
		const dueDate = new Date(issueDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days later

		const lineItems: LineItem[] = [];
		const itemCount = Math.floor(Math.random() * 3) + 1;

		for (let j = 0; j < itemCount; j++) {
			const quantity = Math.floor(Math.random() * 10) + 1;
			const rate = Math.floor(Math.random() * 500) + 50;
			const amount = quantity * rate;

			lineItems.push({
				id: generateId(),
				description: `Service Item ${j + 1}`,
				quantity,
				rate,
				amount,
				taxRate: 8.5,
				taxAmount: amount * 0.085,
			});
		}

		const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
		const taxTotal = lineItems.reduce(
			(sum, item) => sum + (item.taxAmount || 0),
			0
		);
		const total = subtotal + taxTotal;
		const amountPaid =
			Math.random() > 0.3
				? Math.random() > 0.5
					? total
					: Math.floor(total * Math.random())
				: 0;

		let status: Invoice['status'] = 'draft';
		if (amountPaid >= total) {
			status = 'paid';
		} else if (dueDate < new Date() && amountPaid === 0) {
			status = 'overdue';
		} else if (amountPaid > 0) {
			status = 'viewed';
		} else {
			status = ['draft', 'sent', 'viewed'][
				Math.floor(Math.random() * 3)
			] as any;
		}

		invoices.push({
			id: generateId(),
			number: (1000 + i).toString(),
			customerId: customer.id,
			customer,
			issueDate,
			dueDate,
			status,
			lineItems,
			subtotal,
			taxTotal,
			total,
			amountPaid,
			amountDue: total - amountPaid,
			notes: Math.random() > 0.7 ? 'Thank you for your business!' : undefined,
			terms: 'Payment due within 30 days',
			createdAt: issueDate,
			updatedAt: randomDate(issueDate, new Date()),
		});
	}

	return invoices.sort((a, b) => b.issueDate.getTime() - a.issueDate.getTime());
};

// Generate bills
export const generateBills = (vendors: Contact[]): Bill[] => {
	const bills: Bill[] = [];

	for (let i = 0; i < 20; i++) {
		const vendor = vendors[Math.floor(Math.random() * vendors.length)];
		const issueDate = randomDate(daysAgo(60), new Date());
		const dueDate = new Date(issueDate.getTime() + 30 * 24 * 60 * 60 * 1000);

		const lineItems: LineItem[] = [];
		const itemCount = Math.floor(Math.random() * 2) + 1;

		for (let j = 0; j < itemCount; j++) {
			const quantity = Math.floor(Math.random() * 5) + 1;
			const rate = Math.floor(Math.random() * 300) + 100;
			const amount = quantity * rate;

			lineItems.push({
				id: generateId(),
				description: `Expense Item ${j + 1}`,
				quantity,
				rate,
				amount,
				taxRate: 8.5,
				taxAmount: amount * 0.085,
			});
		}

		const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
		const taxTotal = lineItems.reduce(
			(sum, item) => sum + (item.taxAmount || 0),
			0
		);
		const total = subtotal + taxTotal;
		const amountPaid = Math.random() > 0.4 ? total : 0;

		let status: Bill['status'] = 'draft';
		if (amountPaid >= total) {
			status = 'paid';
		} else if (dueDate < new Date()) {
			status = 'overdue';
		} else {
			status = ['draft', 'scheduled'][Math.floor(Math.random() * 2)] as any;
		}

		bills.push({
			id: generateId(),
			number: (2000 + i).toString(),
			vendorId: vendor.id,
			vendor,
			issueDate,
			dueDate,
			status,
			lineItems,
			subtotal,
			taxTotal,
			total,
			amountPaid,
			amountDue: total - amountPaid,
			notes: Math.random() > 0.8 ? 'Approved for payment' : undefined,
			createdAt: issueDate,
			updatedAt: randomDate(issueDate, new Date()),
		});
	}

	return bills.sort((a, b) => b.issueDate.getTime() - a.issueDate.getTime());
};

// Generate bank accounts
export const generateBankAccounts = (): BankAccount[] => {
	return [
		{
			id: generateId(),
			name: 'Business Checking',
			type: 'checking',
			accountNumber: '****1234',
			routingNumber: '123456789',
			institution: 'First National Bank',
			balance: 25000,
			reconciledBalance: 24500,
			lastReconciled: daysAgo(7),
			isActive: true,
			createdAt: daysAgo(365),
			updatedAt: daysAgo(1),
		},
		{
			id: generateId(),
			name: 'Business Savings',
			type: 'savings',
			accountNumber: '****5678',
			routingNumber: '123456789',
			institution: 'First National Bank',
			balance: 50000,
			reconciledBalance: 50000,
			lastReconciled: daysAgo(30),
			isActive: true,
			createdAt: daysAgo(365),
			updatedAt: daysAgo(1),
		},
		{
			id: generateId(),
			name: 'Business Credit Card',
			type: 'credit_card',
			accountNumber: '****9012',
			institution: 'Business Credit Union',
			balance: -3200,
			reconciledBalance: -3000,
			lastReconciled: daysAgo(15),
			isActive: true,
			createdAt: daysAgo(365),
			updatedAt: daysAgo(1),
		},
	];
};

// Generate company
export const generateCompany = (): Company => {
	return {
		id: generateId(),
		name: 'Escape Ramp Solutions',
		address: {
			line1: '123 Business Street',
			line2: 'Suite 100',
			city: 'San Francisco',
			state: 'CA',
			zip: '94105',
			country: 'United States',
		},
		phone: '(555) 123-4567',
		email: 'info@acmebusiness.com',
		website: 'https://acmebusiness.com',
		taxId: '12-3456789',
		fiscalYearStart: 1, // January
		baseCurrency: 'USD',
		dateFormat: 'MM/dd/yyyy',
		timeZone: 'America/Los_Angeles',
	};
};

// Generate tax rates
export const generateTaxRates = (): TaxRate[] => {
	return [
		{
			id: generateId(),
			name: 'Sales Tax',
			rate: 8.5,
			description: 'California State Sales Tax',
			isActive: true,
		},
		{
			id: generateId(),
			name: 'Service Tax',
			rate: 6.0,
			description: 'Service Tax Rate',
			isActive: true,
		},
		{
			id: generateId(),
			name: 'No Tax',
			rate: 0.0,
			description: 'Tax-exempt items',
			isActive: true,
		},
	];
};

// Main seed function
export const generateMockData = () => {
	const accounts = generateAccounts();
	const contacts = generateContacts();
	const customers = contacts.filter((c) => c.type === 'customer');
	const vendors = contacts.filter((c) => c.type === 'vendor');
	const transactions = generateTransactions(accounts, contacts);
	const invoices = generateInvoices(customers);
	const bills = generateBills(vendors);
	const bankAccounts = generateBankAccounts();
	const company = generateCompany();
	const taxRates = generateTaxRates();

	return {
		accounts,
		contacts,
		transactions,
		invoices,
		bills,
		bankAccounts,
		company,
		taxRates,
	};
};
