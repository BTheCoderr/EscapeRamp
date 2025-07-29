# Escape Ramp - QuickBooks Migration Tool

A modern SaaS application helping small businesses migrate off QuickBooks Desktop with AI-powered analysis and guidance.

## 🚀 Features

- **Intelligent Intake Forms**: Collect migration requirements with AI-powered analysis
- **File Upload & Analysis**: Upload QuickBooks files for automated analysis
- **AI-Powered Migration Planning**: Generate personalized migration plans using Claude
- **Progress Tracking**: Real-time migration status and progress monitoring
- **Modern UI/UX**: Clean, responsive interface built with Next.js and Tailwind CSS

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **React Hook Form** - Form handling with validation
- **Lucide React** - Beautiful icons

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Supabase** - PostgreSQL database with real-time features
- **Zod** - Schema validation
- **Anthropic Claude** - AI analysis and migration planning

### Infrastructure
- **Vercel** - Deployment and hosting
- **Supabase** - Database and authentication
- **GitHub Actions** - CI/CD (future)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Anthropic API key (Claude)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd escape-ramp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI Configuration
ANTHROPIC_API_KEY=your_anthropic_api_key

# Optional: Stripe for payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### 4. Database Setup

1. Create a new Supabase project
2. Run the SQL schema in `database-schema.sql` in your Supabase SQL editor
3. Copy your Supabase URL and keys to `.env.local`

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
escape-ramp/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── intake/        # Intake form API
│   │   │   ├── upload/        # File upload API
│   │   │   └── progress/      # Progress tracking API
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Main page
│   ├── components/            # React components
│   │   ├── IntakeForm.tsx     # Migration intake form
│   │   ├── FileUpload.tsx     # File upload component
│   │   ├── ProgressDashboard.tsx # Progress tracking
│   │   └── Navigation.tsx     # Navigation component
│   └── lib/                   # Utility libraries
│       ├── types.ts           # TypeScript types
│       ├── store.ts           # Zustand store
│       ├── supabase.ts        # Supabase client
│       ├── ai-service.ts      # AI service integration
│       └── utils.ts           # Utility functions
├── database-schema.sql        # Database schema
├── package.json
└── README.md
```

## 🔧 API Endpoints

### POST /api/intake
Submit migration intake form and trigger AI analysis.

**Request Body:**
```json
{
  "current_software": "QuickBooks Desktop Pro",
  "target_software": "QuickBooks Online",
  "urgency": "high",
  "data_preservation_requirements": ["Chart of Accounts", "Customer Records"],
  "additional_notes": "Need to preserve custom fields",
  "user_id": "user-uuid"
}
```

### POST /api/upload
Upload files for migration analysis.

**Request Body:**
```json
{
  "migration_id": "migration-uuid",
  "filename": "company.qbb",
  "file_size": 1024000,
  "file_type": ".qbb",
  "file_content": "base64-content"
}
```

### GET /api/progress
Fetch migration progress and status.

**Query Parameters:**
- `migration_id` (optional): Specific migration ID
- `user_id` (optional): User ID to get all migrations

## 🤖 AI Integration

The application uses Anthropic's Claude for:

1. **Intake Analysis**: Analyze user requirements and generate summaries
2. **Migration Planning**: Create detailed migration plans based on requirements
3. **File Analysis**: Analyze uploaded files for migration implications

### AI Prompts

The AI service includes carefully crafted prompts for:
- Intake form analysis
- Migration plan generation
- File content analysis

## 🎨 UI Components

### IntakeForm
- Multi-step form for collecting migration requirements
- Real-time validation with Zod
- Dynamic form fields based on selections

### FileUpload
- Drag-and-drop file upload
- File type validation
- Progress tracking for uploads
- AI analysis integration

### ProgressDashboard
- Real-time migration status
- Progress visualization
- Expandable migration details
- AI analysis results display

## 🔒 Security Features

- **Row Level Security (RLS)** in Supabase
- **Input validation** with Zod schemas
- **File type validation** for uploads
- **User isolation** - users can only access their own data

## 🚀 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_supabase_service_role_key
ANTHROPIC_API_KEY=your_production_anthropic_api_key
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📈 Monitoring & Analytics

- **Error Tracking**: Sentry integration (future)
- **Performance Monitoring**: Vercel Analytics
- **User Analytics**: Supabase Analytics

## 🔄 Future Enhancements

- [ ] **Authentication**: Clerk or Supabase Auth integration
- [ ] **Payments**: Stripe integration for paid plans
- [ ] **Real-time Updates**: WebSocket integration
- [ ] **Advanced AI**: More sophisticated migration analysis
- [ ] **Export Features**: Migration plan export
- [ ] **Team Collaboration**: Multi-user support
- [ ] **API Documentation**: OpenAPI/Swagger docs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@escaperamp.com or create an issue in this repository.

## 🙏 Acknowledgments

- [Anthropic](https://anthropic.com/) for Claude AI
- [Supabase](https://supabase.com/) for the database
- [Vercel](https://vercel.com/) for hosting
- [Tailwind CSS](https://tailwindcss.com/) for styling
