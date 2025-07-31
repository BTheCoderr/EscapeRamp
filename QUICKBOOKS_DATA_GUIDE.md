# QuickBooks Data Migration Guide

## 📊 **QuickBooks Data Formats & Sources**

### **1. QuickBooks Desktop Data Sources**

#### **A. Company File (.QBB, .QBM, .QBW)**
- **.QBB** - QuickBooks Backup file (compressed)
- **.QBM** - QuickBooks Portable file (compressed)
- **.QBW** - QuickBooks Working file (live database)

#### **B. Export Formats**
- **IIF (Intuit Interchange Format)** - Legacy format, still supported
- **CSV Exports** - Customer, Vendor, Item lists
- **Excel (.XLSX)** - Reports exported to Excel
- **PDF Reports** - Financial statements, reports

### **2. Key Data Tables to Extract**

#### **Chart of Accounts**
```csv
Account,AccountType,Description,Balance
1000,Asset,Checking Account,50000.00
1100,Asset,Accounts Receivable,25000.00
2000,Liability,Accounts Payable,15000.00
3000,Equity,Opening Balance Equity,60000.00
```

#### **Customers**
```csv
Customer,CustomerType,CompanyName,FirstName,LastName,Phone,Email,Balance
CUST001,Commercial,ABC Corp,John,Smith,555-0101,john@abc.com,5000.00
CUST002,Individual,,Jane,Doe,555-0102,jane@email.com,2500.00
```

#### **Vendors**
```csv
Vendor,VendorType,CompanyName,FirstName,LastName,Phone,Email,Balance
VEND001,Service,XYZ Services,Bob,Johnson,555-0201,bob@xyz.com,-2000.00
VEND002,Product,Supply Co,,,555-0202,orders@supply.com,-1500.00
```

#### **Items (Products/Services)**
```csv
Item,ItemType,Description,Rate,Cost,QuantityOnHand
ITEM001,Service,Consulting Services,150.00,0.00,0
ITEM002,Inventory,Product A,25.00,15.00,100
ITEM003,Non-inventory,Shipping,10.00,0.00,0
```

#### **Transactions**
```csv
Date,Type,Num,Customer,Vendor,Account,Memo,Amount
2024-01-15,Invoice,1001,CUST001,,1100,Consulting Services,1500.00
2024-01-16,Bill,,VEND001,2000,Office Supplies,-500.00
```

### **3. QuickBooks API Integration**

#### **QuickBooks Online API**
```javascript
// OAuth 2.0 Authentication
const oauth2_token_json = {
  "access_token": "AB1159161192pM4bf6s1zzxn3hUhuTzqyoqtXabPqOWmgL2p",
  "refresh_token": "AB1159161192pM4bf6s1zzxn3hUhuTzqyoqtXabPqOWmgL2p",
  "token_type": "bearer",
  "expires_in": 3600
};

// API Endpoints
const endpoints = {
  customers: 'https://sandbox-accounts.platform.intuit.com/v1/companies/{realmId}/customers',
  vendors: 'https://sandbox-accounts.platform.intuit.com/v1/companies/{realmId}/vendors',
  accounts: 'https://sandbox-accounts.platform.intuit.com/v1/companies/{realmId}/accounts',
  items: 'https://sandbox-accounts.platform.intuit.com/v1/companies/{realmId}/items',
  invoices: 'https://sandbox-accounts.platform.intuit.com/v1/companies/{realmId}/invoices'
};
```

#### **QuickBooks Desktop SDK**
```javascript
// COM Interface (Windows only)
const qbXML = `
<?xml version="1.0" encoding="utf-8"?>
<?qbxml version="13.0"?>
<QBXML>
  <QBXMLMsgsRq onError="stopOnError">
    <CustomerQueryRq>
      <MaxReturned>100</MaxReturned>
    </CustomerQueryRq>
  </QBXMLMsgsRq>
</QBXML>
`;
```

### **4. Data Validation & Cleanup**

#### **Common Issues to Handle**
```javascript
const dataCleanupRules = {
  // Remove special characters from account numbers
  accountNumbers: (value) => value.replace(/[^A-Za-z0-9\-_]/g, ''),
  
  // Standardize phone numbers
  phoneNumbers: (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6)}`;
    }
    return value;
  },
  
  // Validate email addresses
  emailAddresses: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? value : null;
  },
  
  // Handle currency formatting
  currency: (value) => {
    return parseFloat(value.toString().replace(/[$,]/g, ''));
  }
};
```

### **5. Migration Mapping**

#### **Account Type Mapping**
```javascript
const accountTypeMapping = {
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
};
```

#### **Item Type Mapping**
```javascript
const itemTypeMapping = {
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
};
```

### **6. Demo Data Preparation**

#### **Sample Company Profiles**
```javascript
const demoCompanies = {
  smallBusiness: {
    name: "Joe's Plumbing",
    type: "Service Business",
    employees: 5,
    annualRevenue: 250000,
    dataSize: "15MB",
    complexity: "Low"
  },
  mediumBusiness: {
    name: "ABC Manufacturing",
    type: "Product Business",
    employees: 25,
    annualRevenue: 1200000,
    dataSize: "85MB",
    complexity: "Medium"
  },
  largeBusiness: {
    name: "XYZ Corporation",
    type: "Multi-location",
    employees: 100,
    annualRevenue: 5000000,
    dataSize: "250MB",
    complexity: "High"
  }
};
```

### **7. Real Migration Process**

#### **Phase 1: Assessment**
1. **Data Audit**
   - Review company file size and complexity
   - Identify custom fields and reports
   - Check for data integrity issues

2. **Compatibility Check**
   - Verify QuickBooks version
   - Check for third-party integrations
   - Review custom templates

#### **Phase 2: Preparation**
1. **Data Cleanup**
   - Remove duplicate records
   - Fix data formatting issues
   - Archive old transactions

2. **Backup Creation**
   - Create multiple backups
   - Test backup restoration
   - Document current state

#### **Phase 3: Migration**
1. **Data Export**
   - Export master data (customers, vendors, items)
   - Export chart of accounts
   - Export recent transactions

2. **Data Transformation**
   - Map account types
   - Clean and validate data
   - Handle special cases

3. **Data Import**
   - Import to target system
   - Verify data accuracy
   - Test functionality

### **8. Demo Setup Instructions**

#### **For Live Demos**
1. **Prepare Sample Data**
   ```bash
   # Create demo company files
   - Small business (5-10 customers, 3-5 vendors)
   - Medium business (25-50 customers, 10-15 vendors)
   - Large business (100+ customers, 25+ vendors)
   ```

2. **Set Up Test Environment**
   ```bash
   # QuickBooks Online sandbox accounts
   - Create test companies
   - Import sample data
   - Set up user permissions
   ```

3. **Prepare Migration Scripts**
   ```bash
   # Automated migration tools
   - Data validation scripts
   - Error handling procedures
   - Rollback procedures
   ```

### **9. Common Migration Challenges**

#### **Data Issues**
- **Duplicate Records**: Handle multiple customer/vendor entries
- **Invalid Data**: Clean up malformed phone numbers, emails
- **Missing Required Fields**: Add default values where appropriate

#### **Mapping Issues**
- **Custom Account Types**: Map to standard QuickBooks Online types
- **Custom Fields**: Preserve important custom data
- **Complex Relationships**: Handle parent-child account relationships

#### **Timing Issues**
- **Transaction Dates**: Ensure proper date formatting
- **Fiscal Year**: Handle different fiscal year settings
- **Historical Data**: Decide on data retention policies

### **10. Success Metrics**

#### **Data Accuracy**
- 99%+ data integrity
- Zero data loss
- Proper account mapping

#### **Performance**
- Migration time < 4 hours for most companies
- Minimal downtime
- Quick validation process

#### **User Experience**
- Intuitive migration process
- Clear progress indicators
- Comprehensive error reporting

## 🚀 **Next Steps for Real Demos**

1. **Set up QuickBooks Developer Account**
2. **Create sandbox environments**
3. **Prepare sample company files**
4. **Build data validation tools**
5. **Test with real customer data**
6. **Document migration procedures**

This guide will help you prepare for real migrations and create compelling demos that showcase the full power of Escape Ramp! 