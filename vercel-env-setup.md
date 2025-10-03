# Vercel Environment Variables Setup

## Required Environment Variables for Vercel

Add these in your Vercel project dashboard under Settings > Environment Variables:

### Database Configuration
```
DB_HOST=your-database-host
DB_PORT=3306
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
```

### Alternative MySQL Environment Variables (if using different service)
```
MYSQL_HOST=your-database-host
MYSQL_PORT=3306
MYSQL_USER=your-database-user
MYSQL_PASSWORD=your-database-password
MYSQL_DATABASE=your-database-name
```

### JWT Configuration
```
JWT_SECRET=supersecretjwtkey123456789
```

### SMTP Configuration (Ethereal Mail)
```
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=your-ethereal-email@ethereal.email
SMTP_PASS=your-ethereal-password
```

### OpenAI Configuration (Optional)
```
OPENAI_API_KEY=your-openai-api-key
```

### Server Configuration
```
NODE_ENV=production
```

## Database Options for Vercel

### Option 1: PlanetScale (Recommended)
1. Go to https://planetscale.com/
2. Create a free account
3. Create a new database
4. Get connection details and add to Vercel environment variables

### Option 2: Neon
1. Go to https://neon.tech/
2. Create a free account
3. Create a new database
4. Get connection details and add to Vercel environment variables

### Option 3: Railway MySQL
1. Create a Railway account
2. Add MySQL database
3. Get connection details and add to Vercel environment variables

## Deployment Steps

1. **Connect GitHub repository to Vercel**
2. **Set environment variables** (as shown above)
3. **Deploy automatically**
4. **Test the application**

## Frontend Environment Variables

For the frontend, you don't need to set `REACT_APP_API_URL` as it will use relative paths (`/api`) by default.
