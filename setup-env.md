# Environment Setup Guide

## Backend Environment Variables (.env file in backend/ folder)

Create a file called `.env` in the `backend/` folder with these contents:

```env
# Database Configuration
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=email_app

# JWT Configuration
JWT_SECRET=supersecretjwtkey123456789

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

## Frontend Environment Variables (.env file in frontend/ folder)

Create a file called `.env` in the `frontend/` folder with these contents:

```env
REACT_APP_API_URL=http://localhost:3000/api
```

## Getting Ethereal Mail Credentials

1. Go to https://ethereal.email/
2. Click "Create Ethereal Account"
3. Copy the SMTP credentials to your backend .env file

## Getting OpenAI API Key (Optional)

1. Go to https://platform.openai.com/
2. Sign up or log in
3. Go to API Keys section
4. Create a new API key
5. Copy it to your backend .env file
