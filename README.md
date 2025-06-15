# FoodRescue - Food Donation Management System

A comprehensive web application for managing food donations, connecting donors, volunteers, and recipients to reduce food waste and help those in need.

## 🌟 Features

### Multi-Role System
- **Donors**: Create and manage food donation requests
- **Volunteers**: Accept donations and coordinate deliveries
- **Recipients**: Browse and access available food donations
- **Admins**: Oversee the platform and manage users

### Core Functionality
- **Real-time Donations**: Live updates for donation status changes
- **Location Mapping**: Track donation pickup locations with coordinates
- **Analytics Dashboard**: Comprehensive insights and statistics for each user role
- **Notification System**: Keep users informed about important updates
- **Feedback System**: Rate and review interactions between users
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Security & Authentication
- **Supabase Authentication**: Secure email/password authentication
- **Row Level Security (RLS)**: Database-level security policies
- **Role-based Access Control**: Different permissions for each user type
- **Data Privacy**: Users can only access data they're authorized to see

## 🚀 Local Development Setup

### Prerequisites
- **Node.js 18+** and npm
- **Git** for version control
- **Supabase account** (free tier available)
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

### Step-by-Step Local Setup

#### 1. Clone the Repository
```bash
# Clone the project
git clone <your-repo-url>
cd food-rescue

# Or if you downloaded as ZIP
unzip food-rescue.zip
cd food-rescue
```

#### 2. Install Dependencies
```bash
# Install all required packages
npm install

# This will install:
# - React & Vite for the frontend
# - Supabase client for backend
# - Tailwind CSS for styling
# - Lucide React for icons
# - Other development dependencies
```

#### 3. Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env

# Open .env in your text editor and update with your values
```

**Required Environment Variables:**
```env
# Supabase Configuration (Required)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Google Maps API (Optional - for map functionality)
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

#### 4. Supabase Project Setup

**Create a Supabase Project:**
1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization and enter project details
4. Wait for the project to be created (2-3 minutes)

**Get Your Credentials:**
1. Go to Project Settings → API
2. Copy the "Project URL" and "anon public" key
3. Update your `.env` file with these values

**Configure Authentication:**
1. Go to Authentication → Settings
2. **Disable** "Confirm email" for easier development
3. Add your local URL to "Site URL": `http://localhost:5173`
4. Add to "Redirect URLs": `http://localhost:5173`

#### 5. Database Setup

**Option A: Using Supabase Dashboard (Recommended)**
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste each migration file from `supabase/migrations/` in order:
   - Start with the earliest timestamp file
   - Run each migration one by one
   - Verify no errors occur

**Option B: Using Supabase CLI**
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-id

# Push migrations
supabase db push
```

#### 6. Start Development Server
```bash
# Start the development server
npm run dev

# The app will be available at:
# http://localhost:5173
```

#### 7. Verify Setup
1. Open http://localhost:5173 in your browser
2. You should see the FoodRescue landing page
3. Click "Login" and try creating an account
4. If successful, you'll be redirected to the dashboard

### 🔧 Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run linting
npm run lint

# Install new dependencies
npm install package-name

# Update dependencies
npm update
```

### 📁 Project Structure Overview

```
food-rescue/
├── src/                    # Source code
│   ├── components/         # React components
│   │   ├── Auth/          # Login, signup components
│   │   ├── Dashboard/     # Dashboard-specific components
│   │   ├── Layout/        # Navbar, footer, etc.
│   │   └── Profile/       # User profile components
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   ├── config/            # Configuration files
│   └── types/             # Type definitions
├── supabase/              # Database migrations
├── public/                # Static assets
├── .env                   # Environment variables (create this)
├── .env.example           # Environment template
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

### 🐛 Common Setup Issues & Solutions

**Issue: "Connection failed" error**
```bash
# Solution: Check your environment variables
cat .env
# Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are correct
```

**Issue: "Table does not exist" error**
```bash
# Solution: Run database migrations
# Go to Supabase Dashboard → SQL Editor
# Run each migration file from supabase/migrations/ folder
```

**Issue: "Email not confirmed" error**
```bash
# Solution: Disable email confirmation
# Supabase Dashboard → Authentication → Settings
# Turn OFF "Confirm email"
```

**Issue: CORS errors**
```bash
# Solution: Configure allowed origins
# Supabase Dashboard → Settings → API
# Add http://localhost:5173 to allowed origins
```

**Issue: Port 5173 already in use**
```bash
# Solution: Use a different port
npm run dev -- --port 3000
# Or kill the process using port 5173
```

### 🔄 Making Changes

**Adding New Features:**
1. Create components in appropriate directories
2. Update database schema via Supabase migrations
3. Add new hooks for data management
4. Test thoroughly in development

**Database Changes:**
1. Create new migration file in `supabase/migrations/`
2. Test migration in development
3. Apply to production when ready

**Styling Changes:**
- Use Tailwind CSS classes
- Follow existing component patterns
- Test responsive design on different screen sizes

## 👥 Demo Accounts

### Test Users (Pre-created in database)
- **Donor**: `donor@example.com` / `password123`
- **Volunteer**: `volunteer@example.com` / `password123`
- **Recipient**: `recipient@example.com` / `password123`

### Admin Access
- **Email**: `admin@foodrescue.com`
- **Password**: `admin123`
- **Role**: Administrator with full system access

## 🗄️ Database Schema

### Core Tables
- **users**: User profiles and authentication data
- **donations**: Food donation requests and details
- **volunteer_assignments**: Volunteer-donation relationships
- **feedback**: User ratings and reviews
- **notifications**: System notifications

### Key Relationships
- Users can have multiple donations (1:many)
- Volunteers can be assigned to multiple donations (many:many)
- Each donation can have multiple feedback entries
- Users receive notifications for relevant activities

## 🔒 Security

### Authentication
- Supabase handles user authentication and session management
- Passwords are securely hashed and stored
- JWT tokens for session management

### Authorization
- Row Level Security (RLS) policies enforce data access rules
- Role-based permissions (donor, volunteer, recipient, admin)
- Users can only access data they're authorized to see

### Data Protection
- All API requests require authentication
- Sensitive data is protected by database-level security
- Input validation and sanitization

## 🌐 Deployment

### Netlify (Recommended)
1. Connect your GitHub repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy automatically on git push

### Manual Deployment
1. Build the project: `npm run build`
2. Upload the `dist/` folder to your hosting provider
3. Configure environment variables on your hosting platform

### Environment Variables for Production
```env
VITE_SUPABASE_URL=your-production-supabase-url
VITE_SUPABASE_ANON_KEY=your-production-anon-key
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

## 🔧 Configuration

### Supabase Setup
1. **Create a new Supabase project**
2. **Configure Authentication**:
   - Enable email/password authentication
   - Disable email confirmation for development
   - Set up redirect URLs for your domain
3. **Run Database Migrations**:
   - Execute migration files in the SQL Editor
   - Verify all tables and policies are created
4. **Configure CORS**:
   - Add your domain to allowed origins
   - Include localhost for development

### Google Maps (Optional)
1. Get an API key from Google Cloud Console
2. Enable Maps JavaScript API
3. Add the key to your environment variables

## 📊 Analytics & Monitoring

### Built-in Analytics
- User activity tracking
- Donation statistics by food type
- Volunteer performance metrics
- Community impact measurements

### Monitoring
- Real-time donation status updates
- User engagement metrics
- System health indicators

## 🤝 Contributing

### Getting Started
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Development Guidelines
- Follow existing code style and patterns
- Add tests for new functionality
- Update documentation as needed
- Ensure all tests pass before submitting PR

### Reporting Issues
- Use GitHub Issues for bug reports and feature requests
- Provide detailed reproduction steps for bugs
- Include screenshots for UI-related issues

## 📝 API Documentation

### Authentication Endpoints
- `POST /auth/signup` - Create new user account
- `POST /auth/signin` - Sign in existing user
- `POST /auth/signout` - Sign out current user

### Donations API
- `GET /donations` - List donations (filtered by user role)
- `POST /donations` - Create new donation (donors only)
- `PUT /donations/:id` - Update donation status
- `DELETE /donations/:id` - Delete donation (donors only)

### User Management
- `GET /users/profile` - Get current user profile
- `PUT /users/profile` - Update user profile
- `GET /users/stats` - Get user statistics

## 🐛 Troubleshooting

### Common Issues

**"Connection failed" error**
- Verify Supabase URL and API key in .env file
- Check if Supabase project is active and not paused
- Ensure CORS is configured for your domain

**"Table does not exist" error**
- Run database migrations in Supabase SQL Editor
- Verify all migration files executed successfully
- Check Supabase project permissions

**Authentication issues**
- Disable email confirmation in Supabase Auth settings
- Check redirect URLs configuration
- Verify API keys are correct

**Permission denied errors**
- Check RLS policies in Supabase
- Verify user roles are set correctly
- Ensure user is authenticated

### Getting Help
- Check the [Issues](https://github.com/your-repo/issues) page
- Review Supabase documentation
- Contact the development team

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** for providing the backend infrastructure
- **React** and **Vite** for the frontend framework
- **Tailwind CSS** for styling
- **Lucide React** for beautiful icons
- **Recharts** for data visualization
- All contributors and community members

## 📞 Support

For support and questions:
- 📧 Email: ashokmohanta2405@gmail.com
- 💬 GitHub Discussions: [Link to discussions]
- 📖 Documentation: [Link to docs]
- 🐛 Bug Reports: [Link to issues]

---

**Made with ❤️ to help reduce food waste and fight hunger in our communities.**
