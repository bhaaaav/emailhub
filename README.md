# 📧 EmailHub - AI-Powered Email Management Platform

A full-stack email management application with AI-powered spam detection, email refinement, and comprehensive email analytics.

## 🚀 Features

### Backend Features
- **User Authentication**: JWT-based authentication with secure password hashing
- **Email Management**: Send emails using Nodemailer with Ethereal Mail for testing
- **Spam Detection**: AI-powered spam score calculation using heuristics
- **AI Email Refinement**: OpenAI GPT-4 integration for email improvement
- **Database Integration**: MySQL with connection pooling and proper error handling
- **RESTful API**: Comprehensive API endpoints with validation and rate limiting

### Frontend Features
- **Modern UI**: React with Material-UI components
- **Email Composition**: Rich email composition with real-time spam scoring
- **AI Refinement**: AI-powered email improvement suggestions
- **Email History**: Comprehensive email tracking and analytics
- **Responsive Design**: Mobile-friendly interface
- **Authentication**: Secure login and registration

## 🛠️ Tech Stack

### Backend
- **Node.js** + **TypeScript** + **Express**
- **MySQL** database with **mysql2/promise**
- **JWT** authentication with **bcryptjs**
- **Nodemailer** for email sending
- **OpenAI API** for AI features
- **Joi** for validation
- **Helmet** for security

### Frontend
- **React** + **TypeScript**
- **Material-UI** for components
- **Axios** for API calls
- **React Router** for navigation

## 📦 Installation

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd emailhub
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 3. Database Setup
1. Create a MySQL database named `email_app`
2. Update database credentials in `backend/.env`

### 4. Environment Configuration

#### Backend (.env)
```env
# Database Configuration
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=email_app

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key

# SMTP Configuration (Ethereal Mail for testing)
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=your-ethereal-email@ethereal.email
SMTP_PASS=your-ethereal-password

# OpenAI Configuration (optional)
OPENAI_API_KEY=your-openai-api-key

# Server Configuration
PORT=3000
NODE_ENV=development
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:3000/api
```

### 5. Get Ethereal Mail Credentials
1. Visit [Ethereal Email](https://ethereal.email/)
2. Create a new account
3. Copy the SMTP credentials to your backend `.env` file

## 🚀 Running the Application

### Development Mode
```bash
# Run both backend and frontend
npm run dev

# Or run separately:
# Backend only
npm run backend:dev

# Frontend only
npm run frontend:dev
```

### Production Mode
```bash
# Build both applications
npm run backend:build
npm run frontend:build

# Start backend
npm run backend:start
```

## 🌐 Deployment

### Railway (Backend)
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically

### Vercel (Frontend)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Email Management
- `POST /api/email/send` - Send email
- `GET /api/email` - Get user emails
- `GET /api/email/stats` - Get email statistics
- `POST /api/email/score` - Calculate spam score
- `POST /api/email/refine` - Refine email with AI

### Health Check
- `GET /api/health` - Health check
- `GET /api/test-db` - Database connection test

## 🔧 Configuration

### Database Schema
```sql
-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Emails table
CREATE TABLE emails (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  recipient VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  body TEXT NOT NULL,
  spam_score DECIMAL(3,2) DEFAULT 0.00,
  delivered BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📊 Features Overview

### Spam Detection
- Heuristic-based spam scoring
- Common spam word detection
- Excessive capitalization detection
- Suspicious pattern recognition
- Real-time score visualization

### AI Email Refinement
- OpenAI GPT-4 integration
- Fallback to heuristic rules
- Professional email improvement
- Specific improvement suggestions
- Real-time refinement

### Email Analytics
- Delivery rate tracking
- Spam rate monitoring
- Email history with filtering
- Comprehensive statistics
- Performance metrics

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation with Joi
- SQL injection protection

## 📱 Mobile Responsiveness

- Material-UI responsive design
- Mobile-friendly navigation
- Touch-friendly interface
- Optimized for all screen sizes

## 🚀 Performance Optimizations

- Database connection pooling
- Efficient query optimization
- Frontend code splitting
- Image optimization
- Caching strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the GitHub repository or contact the development team.

## 🔮 Future Enhancements

- Email templates
- Bulk email sending
- Advanced analytics
- Email scheduling
- Integration with external email providers
- Advanced AI features
- Email encryption
- Team collaboration features
