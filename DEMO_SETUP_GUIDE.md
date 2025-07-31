# Demo Setup Guide for Real QuickBooks Migrations

## 🎯 **Demo Preparation Checklist**

### **1. QuickBooks Developer Account Setup**

#### **A. QuickBooks Online Developer Account**
1. **Sign up at**: https://developer.intuit.com/
2. **Create a new app**:
   - App Name: `Escape Ramp Migration Tool`
   - App Type: `Web App`
   - Environment: `Sandbox` (for demos)
3. **Get your credentials**:
   - Client ID
   - Client Secret
   - Redirect URI: `https://your-domain.com/auth/callback`

#### **B. QuickBooks Desktop SDK** (Optional)
1. **Download SDK**: https://developer.intuit.com/app/developer/qbdesktop/docs/get-started
2. **Install on Windows machine**
3. **Get sample company files**

### **2. Sample Data Preparation**

#### **A. Demo Company Files**
We've created sample data files in `demo-data/`:
- `sample-accounts.csv` - Chart of accounts
- `sample-customers.csv` - Customer list
- `sample-vendors.csv` - Vendor list
- `sample-items.csv` - Products/services

#### **B. Real Company Files** (For Live Demos)
1. **Small Business** (5-10 customers, 3-5 vendors)
   - Service business (consulting, real estate)
   - Simple chart of accounts
   - Recent transactions only

2. **Medium Business** (25-50 customers, 10-15 vendors)
   - Product business (manufacturing, retail)
   - Complex inventory
   - Multiple locations

3. **Large Business** (100+ customers, 25+ vendors)
   - Multi-location business
   - Complex account structure
   - Historical data

### **3. Environment Setup**

#### **A. Local Development**
```bash
# Clone the repository
git clone https://github.com/your-org/escape-ramp.git
cd escape-ramp

# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local
# Edit .env.local with your QuickBooks credentials

# Start development server
npm run dev
```

#### **B. Production Demo Environment**
```bash
# Deploy to Vercel/Netlify
npm run build
npm run start

# Set production environment variables
# - QUICKBOOKS_CLIENT_ID
# - QUICKBOOKS_CLIENT_SECRET
# - QUICKBOOKS_REDIRECT_URI
```

### **4. Demo Scenarios**

#### **Scenario 1: Small Service Business**
**Company**: Joe's Plumbing
**Data Size**: 15MB
**Complexity**: Low
**Migration Time**: 30-45 minutes

**Demo Flow**:
1. Upload company file (.QBB)
2. Show data analysis
3. Review mapping
4. Execute migration
5. Verify results

#### **Scenario 2: Medium Manufacturing Business**
**Company**: ABC Manufacturing
**Data Size**: 85MB
**Complexity**: Medium
**Migration Time**: 1-2 hours

**Demo Flow**:
1. Upload company file
2. Show data validation
3. Handle mapping issues
4. Execute migration
5. Show progress tracking
6. Verify results

#### **Scenario 3: Large Multi-location Business**
**Company**: XYZ Corporation
**Data Size**: 250MB
**Complexity**: High
**Migration Time**: 2-4 hours

**Demo Flow**:
1. Upload company file
2. Show data analysis
3. Handle complex mappings
4. Execute migration
5. Show real-time progress
6. Handle errors
7. Verify results

### **5. Demo Script**

#### **Opening (2 minutes)**
"Welcome to Escape Ramp! Today I'll show you how we can migrate your QuickBooks Desktop data to the cloud in just a few hours, not weeks."

#### **Problem Statement (3 minutes)**
"QuickBooks Desktop users face several challenges:
- Cluttered interface with too many options
- Steep learning curve for new users
- Limited data tracking and reporting
- High costs with annual price increases
- No cloud access or collaboration"

#### **Solution Overview (2 minutes)**
"Escape Ramp solves these problems by:
- Providing a clean, intuitive interface
- Offering AI-powered guidance
- Real-time migration tracking
- Cost-effective cloud solutions
- 24/7 support throughout the process"

#### **Live Demo (15-20 minutes)**

**Step 1: Upload & Analysis (3 minutes)**
- Upload sample company file
- Show data analysis results
- Highlight data quality issues
- Display migration complexity assessment

**Step 2: Data Mapping (5 minutes)**
- Show account type mapping
- Review customer/vendor data
- Handle any mapping issues
- Explain the mapping process

**Step 3: Migration Execution (5 minutes)**
- Start the migration
- Show real-time progress
- Handle any errors that occur
- Display progress indicators

**Step 4: Results Verification (3 minutes)**
- Show migrated data in target system
- Verify data accuracy
- Display migration report
- Show time and cost savings

**Step 5: Support Portal (2 minutes)**
- Demonstrate help ticket system
- Show live chat functionality
- Display migration status tracking
- Highlight 24/7 support availability

#### **Closing (3 minutes)**
"Escape Ramp makes QuickBooks migration simple, fast, and reliable. Our AI-powered platform handles the complexity while you focus on your business."

### **6. Technical Setup**

#### **A. QuickBooks API Integration**
```javascript
// Add to your .env.local
QUICKBOOKS_CLIENT_ID=your_client_id
QUICKBOOKS_CLIENT_SECRET=your_client_secret
QUICKBOOKS_REDIRECT_URI=https://your-domain.com/auth/callback
QUICKBOOKS_ENVIRONMENT=sandbox
```

#### **B. Database Setup**
```sql
-- Run these in your Supabase SQL Editor
-- 1. supabase-schema.sql
-- 2. supabase-schema-documents.sql
-- 3. supabase-schema-history.sql
-- 4. supabase-schema-support.sql
```

#### **C. File Upload Configuration**
```javascript
// Configure file upload limits
const uploadConfig = {
  maxFileSize: 100 * 1024 * 1024, // 100MB
  allowedTypes: ['.qbb', '.qbm', '.qbw', '.csv', '.xlsx'],
  maxFiles: 10
};
```

### **7. Demo Best Practices**

#### **A. Preparation**
- Test all scenarios beforehand
- Have backup data ready
- Prepare for common questions
- Set up multiple demo environments

#### **B. During Demo**
- Keep it interactive
- Ask for audience input
- Handle errors gracefully
- Show real-time progress
- Highlight key benefits

#### **C. Follow-up**
- Collect feedback
- Address questions
- Provide next steps
- Share contact information

### **8. Common Demo Questions**

#### **Q: How long does migration take?**
A: Most migrations complete in 1-4 hours depending on data size and complexity.

#### **Q: Is my data safe?**
A: Yes, we use enterprise-grade security and never store sensitive data permanently.

#### **Q: What if something goes wrong?**
A: Our 24/7 support team is available throughout the process, and we have rollback procedures.

#### **Q: Can I customize the migration?**
A: Yes, our AI assistant helps you customize mappings and handle special cases.

#### **Q: What about historical data?**
A: We can migrate as much or as little historical data as you need.

### **9. Demo Success Metrics**

#### **Technical Metrics**
- Migration completion rate: 95%+
- Data accuracy: 99%+
- Error resolution time: < 30 minutes
- Support response time: < 5 minutes

#### **Business Metrics**
- Demo to conversion rate: 25%+
- Average deal size: $5,000+
- Customer satisfaction: 4.8/5
- Time to value: < 1 week

### **10. Troubleshooting**

#### **Common Issues**
1. **File upload fails**: Check file size and format
2. **API errors**: Verify QuickBooks credentials
3. **Mapping issues**: Use AI assistant for guidance
4. **Slow performance**: Check internet connection

#### **Emergency Procedures**
1. **Demo fails**: Use backup data
2. **System down**: Show recorded demo
3. **Data issues**: Use sample data
4. **Support needed**: Contact team immediately

## 🚀 **Ready for Your Demo!**

With this setup, you'll be able to:
- Show real QuickBooks data migration
- Handle live customer scenarios
- Demonstrate the full platform capabilities
- Convert prospects into customers

Good luck with your demos! 🎉 