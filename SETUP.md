# Escape Ramp Setup Guide

## 🚀 Quick Setup Instructions

### 1. Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI Configuration
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### 2. Database Setup

1. **Create Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and API keys

2. **Run Database Schema**:
   - Open your Supabase project dashboard
   - Go to SQL Editor
   - Copy and paste the contents of `database-schema.sql`
   - Execute the SQL script

3. **Update Environment Variables**:
   - Copy your Supabase URL to `NEXT_PUBLIC_SUPABASE_URL`
   - Copy your anon key to `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy your service role key to `SUPABASE_SERVICE_ROLE_KEY`

### 3. AI Configuration

1. **Get Anthropic API Key**:
   - Go to [console.anthropic.com](https://console.anthropic.com)
   - Create an account and get your API key
   - Add it to `ANTHROPIC_API_KEY` in your `.env.local`

### 4. Start the Application

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 🧪 Testing the Application

### 1. Intake Form
- Navigate to the "Intake Form" tab
- Fill out the migration requirements
- Submit the form to trigger AI analysis

### 2. File Upload
- Go to the "File Upload" tab
- Upload QuickBooks files (.qbb, .qbm, .qbo)
- Watch the AI analysis process

### 3. Progress Dashboard
- Check the "Progress" tab to see migration status
- View AI analysis results
- Track migration progress

## 🔧 API Testing

### Test Intake API
```bash
curl -X POST http://localhost:3000/api/intake \
  -H "Content-Type: application/json" \
  -d '{
    "current_software": "QuickBooks Desktop Pro",
    "target_software": "QuickBooks Online",
    "urgency": "high",
    "data_preservation_requirements": ["Chart of Accounts", "Customer Records"],
    "user_id": "demo-user-123"
  }'
```

### Test Progress API
```bash
curl "http://localhost:3000/api/progress?user_id=demo-user-123"
```

## 🐛 Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**:
   - Ensure `.env.local` is in the root directory
   - Restart the development server after adding variables

2. **Database Connection Errors**:
   - Verify Supabase URL and keys are correct
   - Check that the database schema has been executed

3. **AI Analysis Failing**:
   - Verify Anthropic API key is valid
   - Check API key has sufficient credits

4. **File Upload Issues**:
   - Ensure file types are supported
   - Check file size limits (10MB max)

### Development Tips

1. **Check Console Logs**: Open browser dev tools to see any errors
2. **Database Debugging**: Use Supabase dashboard to inspect data
3. **API Testing**: Use tools like Postman or curl for API testing

## 📊 Database Schema Overview

The application uses the following tables:

- **users**: User profiles and authentication
- **migrations**: Migration projects and status
- **files**: Uploaded files and metadata
- **intake_responses**: User intake form responses
- **ai_analyses**: AI-generated analysis and plans
- **migration_progress**: Real-time progress tracking

## 🔒 Security Features

- Row Level Security (RLS) enabled on all tables
- Input validation with Zod schemas
- File type and size validation
- User data isolation

## 🚀 Production Deployment

### Vercel Deployment

1. **Connect Repository**:
   - Push code to GitHub
   - Connect repository to Vercel

2. **Set Environment Variables**:
   - Add all environment variables in Vercel dashboard
   - Use production Supabase and API keys

3. **Deploy**:
   - Vercel will automatically deploy on push to main branch

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_supabase_service_role_key
ANTHROPIC_API_KEY=your_production_anthropic_api_key
```

## 📈 Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Supabase Logs**: Database query monitoring
- **Error Tracking**: Consider adding Sentry for error monitoring

## 🔄 Next Steps

1. **Authentication**: Integrate Clerk or Supabase Auth
2. **Payments**: Add Stripe for subscription plans
3. **Real-time Updates**: Implement WebSocket connections
4. **Advanced AI**: Enhance migration analysis capabilities
5. **Export Features**: Add migration plan export functionality

## 📞 Support

For issues or questions:
- Check the [README.md](README.md) for detailed documentation
- Review the [database-schema.sql](database-schema.sql) for database structure
- Create an issue in the repository for bugs or feature requests 