# Escape Ramp

<!-- repo-intro:start -->
**Project snapshot:** Escape Ramp is the full SaaS product concept for guiding small businesses through QuickBooks Desktop migration with AI-assisted intake, document handling, progress tracking, and cloud-ready workflows.

**What it demonstrates:** Next.js · TypeScript · Supabase · AI integration · SaaS workflow architecture.
<!-- repo-intro:end -->

A modern SaaS platform helping small businesses migrate from QuickBooks Desktop to cloud-based solutions.

## 🚀 **Tech Stack**

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-2.39.0-green?style=for-the-badge&logo=supabase)
![Anthropic](https://img.shields.io/badge/Anthropic_Claude-3.5-orange?style=for-the-badge)

## 📋 **Quick Links**

• [Live Demo](https://escaperamp.netlify.app) • [Frontend Repo](https://github.com/BTheCoderr/escape-ramp-frontend) • [Backend Repo](https://github.com/BTheCoderr/escape-ramp-backend)

---

## 🎯 **Overview**

Escape Ramp is a comprehensive SaaS platform that helps small businesses migrate from QuickBooks Desktop to cloud-based solutions. Built with modern web technologies, it provides an intuitive interface for AI-powered migration assistance, document processing, and real-time progress tracking.

## ✨ **Key Features**

- 🤖 **AI-Powered Intake Assistant** - Conversational onboarding flow
- 📁 **Document Upload & Processing** - Drag-and-drop file handling
- 📊 **Historical Data Tracker** - Complete audit trail and analytics
- 🎧 **Support Portal** - Integrated help desk and live chat
- 📈 **Real-time Dashboard** - Migration progress and analytics
- 🔒 **Secure Authentication** - Supabase Auth integration

## 🏗️ **Architecture**

This repository contains the original monorepo structure. For production use, we recommend using our split repositories:

- **[Frontend Repository](https://github.com/BTheCoderr/escape-ramp-frontend)** - Next.js UI components and pages
- **[Backend Repository](https://github.com/BTheCoderr/escape-ramp-backend)** - API routes and Python microservices

## 🛠️ **Getting Started**

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Anthropic API key

### Installation

```bash
# Clone the repository
git clone https://github.com/BTheCoderr/escape-ramp.git
cd escape-ramp

# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔧 **Environment Variables**

Create a `.env.local` file with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI Services
ANTHROPIC_API_KEY=your_anthropic_api_key
OPENAI_API_KEY=your_openai_api_key

# QuickBooks Integration
QUICKBOOKS_CLIENT_ID=your_quickbooks_client_id
QUICKBOOKS_CLIENT_SECRET=your_quickbooks_client_secret
QUICKBOOKS_REDIRECT_URI=your_redirect_uri

# Email Service
RESEND_API_KEY=your_resend_api_key

# Payment Processing
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## 📁 **Project Structure**

```
escape-ramp/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── intake/        # Intake form API
│   │   │   ├── upload/        # File upload API
│   │   │   ├── progress/      # Progress tracking API
│   │   │   ├── transactions/  # Transaction CRUD
│   │   │   ├── audit/         # Audit trail
│   │   │   └── support/       # Support portal APIs
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Main page
│   ├── components/            # React components
│   │   ├── Dashboard.tsx      # Main dashboard
│   │   ├── AIAssistant.tsx    # AI-powered intake
│   │   ├── DocumentUpload.tsx # File upload
│   │   ├── HistoricalDataTracker.tsx # Data tracking
│   │   ├── SupportPortal.tsx  # Support system
│   │   └── Navigation.tsx     # Sidebar navigation
│   └── lib/                   # Utility libraries
│       ├── types.ts           # TypeScript types
│       ├── store.ts           # Zustand store
│       ├── supabase.ts        # Supabase client
│       ├── ai-service.ts      # AI service integration
│       ├── quickbooks-parser.ts # QB data parsing
│       └── utils.ts           # Utility functions
├── python-service/            # Python microservices
│   ├── invoice_parser.py      # Invoice parsing service
│   ├── requirements.txt       # Python dependencies
│   └── README.md              # Python service docs
├── demo-data/                 # Sample QuickBooks data
├── *.sql                      # Database schemas
└── README.md
```

## 🧪 **Development**

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
```

### Python Service Development

```bash
cd python-service
pip install -r requirements.txt
uvicorn invoice_parser:app --reload --port 8000
```

## 📚 **API Endpoints**

### Intake Processing
- `POST /api/intake` - Process intake forms
- `GET /api/intake` - Retrieve intake data

### File Upload
- `POST /api/upload` - Upload and process files
- `GET /api/upload` - Retrieve file metadata

### Migration Progress
- `GET /api/progress` - Get migration status
- `PUT /api/progress` - Update progress

### Transactions
- `GET /api/transactions` - List transactions
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Support Portal
- `GET /api/support/tickets` - List support tickets
- `POST /api/support/tickets` - Create ticket
- `PUT /api/support/tickets/:id` - Update ticket
- `GET /api/support/messages` - Get messages
- `POST /api/support/messages` - Send message

### Python Service
- `POST /parse-invoice` - Parse invoice with AI
- `POST /parse-document` - Parse any document
- `GET /health` - Health check

## 🗄️ **Database Schema**

### Core Tables
- `intake_form` - User intake data
- `migration_status` - Migration progress
- `documents` - File metadata
- `parsed_invoices` - Extracted invoice data

### Historical Data
- `transactions` - Financial transactions
- `transaction_changes` - Change tracking
- `audit_events` - System audit trail
- `data_snapshots` - Data versioning

### Support System
- `support_tickets` - Help tickets
- `support_messages` - Ticket messages
- `support_attachments` - File attachments
- `support_knowledge_base` - Help articles

## 🤖 **AI Integration**

### Anthropic Claude
- Intake form analysis
- Migration planning
- Customer support

### OpenAI GPT-4
- Invoice parsing
- Document processing
- Data validation

### QuickBooks Parser
- CSV/IIF file parsing
- Data validation
- Migration mapping

## 🚀 **Deployment**

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main

### Netlify
1. Import your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `.next`

### Python Service (Railway/Render)
```bash
cd python-service
railway login
railway init
railway up
```

## 🔒 **Security**

### Authentication
- Supabase Auth integration
- JWT token validation
- Role-based access control

### Data Protection
- Row Level Security (RLS)
- Encrypted data storage
- Secure file uploads

### API Security
- Rate limiting
- Input validation
- CORS configuration

## 🐛 **Troubleshooting**

### Common Issues

1. **Build Errors**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules .next
   npm install
   npm run build
   ```

2. **Environment Variables**
   - Ensure all required variables are set
   - Check for typos in variable names
   - Restart development server after changes

3. **Supabase Connection**
   - Verify URL and keys are correct
   - Check network connectivity
   - Review Supabase dashboard for errors

## 📄 **License**

This project is proprietary software. All rights reserved.

## 🤝 **Contributing**

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## 👥 **Team**

- **Baheem** - Project Lead & Full Stack
- **Dante** - Frontend UI/UX
- **Thomas** - Backend API/Database
- **Pio** - DevOps & Infrastructure
- **Sean** - AI/ML Integration
- **Adrian** - Testing & Quality Assurance

---

**Built with ❤️ by the Escape Ramp Team**
