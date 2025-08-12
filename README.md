# Acme Business - Modern Accounting Software

A production-ready accounting and bookkeeping application built with Next.js 14, TypeScript, and shadcn/ui. This is a complete UI-only demo showcasing modern web development practices and elegant design patterns inspired by QuickBooks and Xero.

## 🚀 Features

### Core Functionality

- **Dashboard** - Comprehensive overview with KPIs, charts, and recent activity
- **Transactions** - Full transaction management with advanced filtering and bulk operations
- **Invoices** - Customer invoice creation, tracking, and management
- **Bills** - Vendor bill recording and payment tracking
- **Banking** - Bank account management and reconciliation workflows
- **Reports** - Financial reports including P&L, Balance Sheet, and Cash Flow
- **Contacts** - Customer and vendor relationship management
- **Chart of Accounts** - Hierarchical account structure management
- **Settings** - Company configuration, team management, and preferences

### Technical Features

- **Responsive Design** - Mobile-first approach with excellent tablet/desktop layouts
- **Dark/Light Theme** - System-aware theme switching with persistence
- **Advanced Tables** - Sortable, filterable data tables with pagination and bulk actions
- **Interactive Charts** - Real-time financial data visualization with Recharts
- **Command Palette** - Quick navigation and actions (⌘K)
- **Accessibility** - WCAG AA compliant with keyboard navigation and screen reader support
- **Type Safety** - Strict TypeScript with comprehensive type definitions
- **Mock Data** - Realistic demo data with localStorage persistence

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix primitives)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation
- **Tables**: TanStack Table
- **Date Handling**: date-fns
- **State Management**: React state + custom repositories
- **Theme**: next-themes

## 📦 Installation

1. **Clone and install dependencies**:

   ```bash
   git clone <repository-url>
   cd EscapeRamp
   npm install
   ```

2. **Run the development server**:

   ```bash
   npm run dev
   ```

3. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (dashboard)/       # Dashboard layout group
│   │   ├── page.tsx       # Dashboard home
│   │   ├── transactions/  # Transaction management
│   │   ├── invoices/      # Invoice management
│   │   ├── bills/         # Bill management
│   │   ├── banking/       # Banking & reconciliation
│   │   ├── reports/       # Financial reports
│   │   ├── customers/     # Customer management
│   │   ├── vendors/       # Vendor management
│   │   ├── chart-of-accounts/ # Chart of accounts
│   │   └── settings/      # Application settings
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── navigation/       # Navigation components
│   ├── tables/          # Data table components
│   ├── charts/          # Chart components
│   └── forms/           # Form components
├── lib/
│   ├── mock/            # Mock data and repositories
│   │   ├── types.ts     # TypeScript interfaces
│   │   ├── seed.ts      # Data generation
│   │   ├── repository.ts # Mock API layer
│   │   ├── currency.ts  # Currency formatting
│   │   └── format.ts    # Date/text formatting
│   └── utils.ts         # Utility functions
└── hooks/               # Custom React hooks
```

## 🎨 Design System

### Color Palette

- **CSS Variables**: Consistent theming with CSS custom properties
- **Semantic Colors**: Primary, secondary, accent, muted, destructive
- **Chart Colors**: Coordinated color scheme for data visualization

### Typography

- **Font**: Inter with tabular numbers for financial data
- **Scale**: Responsive typography with proper hierarchy
- **Features**: Tabular numbers, balanced text, tracking adjustments

### Components

- **Consistent Spacing**: 4px grid system
- **Border Radius**: Soft 10px default radius
- **Shadows**: Subtle elevation with three levels
- **Animations**: Smooth transitions with reduced motion support

## 📊 Mock Data

The application includes a comprehensive mock data layer that simulates a real accounting system:

- **Seeded Data**: Realistic business transactions, invoices, bills, and contacts
- **Relationships**: Proper data relationships between entities
- **Persistence**: localStorage integration for demo data persistence
- **Repositories**: Clean API layer for data operations
- **Reset Functionality**: Ability to reset to fresh demo data

## 🔧 Key Features Deep Dive

### Dashboard

- Real-time KPI cards with percentage changes
- Interactive cash flow chart with period selection
- Expense breakdown pie chart
- Recent activity feed with mixed entity types
- Quick action shortcuts

### Transaction Management

- Advanced DataTable with sorting, filtering, and search
- Bulk operations for categorization and status updates
- Inline editing capabilities
- Split transaction support
- Attachment indicators

### Invoicing System

- Complete invoice lifecycle management
- Status tracking (Draft → Sent → Viewed → Paid → Overdue)
- Customer relationship integration
- Payment tracking and partial payments
- PDF preview simulation

### Banking & Reconciliation

- Multiple bank account support
- Transaction reconciliation workflow
- Balance tracking and discrepancy detection
- Institution integration simulation

### Reporting Suite

- Profit & Loss statements
- Balance Sheet reporting
- Cash Flow analysis
- Period comparison functionality
- Export capabilities (simulated)

### Settings & Configuration

- Company profile management
- Theme and appearance customization
- Team member management with role-based permissions
- Tax rate configuration
- Fiscal year and currency settings

## 🎯 Usage Examples

### Navigation

- Use the sidebar to navigate between major sections
- Press `⌘K` (or `Ctrl+K`) to open the command palette
- Click the theme toggle in the top bar to switch themes

### Data Management

- Filter transactions by account, status, or date range
- Use bulk selection to perform operations on multiple items
- Search across all text fields in data tables
- Export data using the export buttons (simulated)

### Creating Records

- Use the "New" button in the top bar for quick record creation
- Navigate to specific sections for detailed form interfaces
- All forms include validation and error handling

## 🚀 Deployment

This is a standard Next.js application and can be deployed to any platform supporting Node.js:

### Vercel (Recommended)

```bash
npm run build
```

Deploy to Vercel with automatic CI/CD integration.

### Other Platforms

- **Netlify**: Build command `npm run build`, publish directory `.next`
- **Railway**: Supports Next.js out of the box
- **DigitalOcean**: App Platform with Node.js buildpack

## 🤝 Contributing

This is a demo application showcasing modern React/Next.js patterns. Key areas for exploration:

1. **Component Architecture**: Study the shadcn/ui integration
2. **State Management**: Examine the mock repository pattern
3. **TypeScript Usage**: Review comprehensive type definitions
4. **Responsive Design**: Analyze mobile-first approach
5. **Accessibility**: Learn WCAG implementation techniques

## 📝 License

This project is for demonstration purposes. The code structure and patterns can be freely studied and adapted for your own projects.

## 🙏 Acknowledgments

- **shadcn/ui** for the excellent component system
- **Radix UI** for accessible primitives
- **Tailwind CSS** for utility-first styling
- **Lucide** for beautiful icons
- **Vercel** for Next.js and deployment platform

---

**Note**: This is a UI-only demonstration. No real financial data is processed, and no external APIs are called. All data is mocked and stored locally for demo purposes.
