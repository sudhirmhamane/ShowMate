# ShowMate Backend Deployment Guide

This guide covers deploying the ShowMate backend to various platforms including Vercel, Heroku, and AWS.

## 🚀 Prerequisites

- Node.js 18+ installed
- Git repository set up
- Environment variables configured
- Database connection ready

## 📋 Environment Setup

### Required Environment Variables

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/showmate

# TMDB API Configuration
TMDB_API_KEY=your_tmdb_api_key_here

# Clerk Authentication Configuration
CLERK_SECRET_KEY=your_clerk_secret_key_here
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here

# Payment Gateway Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Optional Environment Variables

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Logging Configuration
LOG_LEVEL=info
LOG_FILE=logs/app.log
```

## 🎯 Deployment Options

### 1. Vercel (Recommended)

Vercel is the easiest platform for deploying Node.js applications.

#### Setup Steps:

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd server
   vercel
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add MONGODB_URI
   vercel env add TMDB_API_KEY
   vercel env add CLERK_SECRET_KEY
   # ... add all required variables
   ```

5. **Redeploy with Environment Variables**
   ```bash
   vercel --prod
   ```

#### Vercel Configuration

The `vercel.json` file is already configured for optimal deployment:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ]
}
```

### 2. Heroku

#### Setup Steps:

1. **Install Heroku CLI**
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku
   
   # Windows
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   heroku create your-showmate-app
   ```

4. **Add MongoDB Add-on**
   ```bash
   heroku addons:create mongolab:sandbox
   ```

5. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set TMDB_API_KEY=your_key
   heroku config:set CLERK_SECRET_KEY=your_key
   # ... set all required variables
   ```

6. **Deploy**
   ```bash
   git push heroku main
   ```

#### Heroku Configuration

Create a `Procfile` in the server directory:
```
web: node server.js
```

### 3. AWS (EC2)

#### Setup Steps:

1. **Launch EC2 Instance**
   - Choose Ubuntu 20.04 LTS
   - t3.micro for testing, t3.small+ for production
   - Configure security groups (open ports 22, 80, 443, 3000)

2. **Connect to Instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   ```

3. **Install Dependencies**
   ```bash
   sudo apt update
   sudo apt install -y nodejs npm nginx
   sudo npm install -g pm2
   ```

4. **Clone Repository**
   ```bash
   git clone https://github.com/your-username/showmate.git
   cd showmate/server
   npm install
   ```

5. **Set Environment Variables**
   ```bash
   cp config.env.example .env
   nano .env
   # Edit with your values
   ```

6. **Start Application with PM2**
   ```bash
   pm2 start server.js --name "showmate-backend"
   pm2 startup
   pm2 save
   ```

7. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/showmate
   ```

   Add this configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable the site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/showmate /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### 4. Docker Deployment

#### Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

#### Create docker-compose.yml

```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/showmate
      - TMDB_API_KEY=${TMDB_API_KEY}
      - CLERK_SECRET_KEY=${CLERK_SECRET_KEY}
    depends_on:
      - mongo
    restart: unless-stopped

  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    restart: unless-stopped

volumes:
  mongo_data:
```

#### Deploy with Docker

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

## 🔒 Security Considerations

### 1. Environment Variables
- Never commit `.env` files to version control
- Use platform-specific secret management
- Rotate API keys regularly

### 2. CORS Configuration
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

### 3. Rate Limiting
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
```

### 4. Helmet Security
```javascript
import helmet from 'helmet';

app.use(helmet());
```

## 📊 Monitoring & Logging

### 1. PM2 Monitoring (for EC2)
```bash
pm2 monit
pm2 logs showmate-backend
```

### 2. Application Logging
```javascript
import morgan from 'morgan';

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}
```

### 3. Health Checks
```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

## 🚨 Troubleshooting

### Common Issues:

1. **Port Already in Use**
   ```bash
   lsof -i :3000
   kill -9 <PID>
   ```

2. **MongoDB Connection Issues**
   - Check connection string
   - Verify network access
   - Check authentication credentials

3. **Environment Variables Not Loading**
   - Verify `.env` file exists
   - Check variable names
   - Restart application after changes

4. **CORS Errors**
   - Verify frontend URL in CORS configuration
   - Check if credentials are enabled

### Debug Commands:

```bash
# Check application status
pm2 status

# View application logs
pm2 logs

# Restart application
pm2 restart showmate-backend

# Check environment variables
node -e "console.log(process.env)"
```

## 📈 Performance Optimization

### 1. Database Indexing
```javascript
// Add indexes to frequently queried fields
await Show.createIndexes({ movie: 1, showDateTime: 1 });
await Booking.createIndexes({ user: 1, createdAt: -1 });
```

### 2. Caching
```javascript
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Cache movie data
app.get('/movies/:id', async (req, res) => {
  const cacheKey = `movie:${req.params.id}`;
  let movie = await redis.get(cacheKey);
  
  if (!movie) {
    movie = await Movie.findById(req.params.id);
    await redis.setex(cacheKey, 3600, JSON.stringify(movie)); // 1 hour
  } else {
    movie = JSON.parse(movie);
  }
  
  res.json({ success: true, movie });
});
```

### 3. Compression
```javascript
import compression from 'compression';

app.use(compression());
```

## 🔄 Updates & Maintenance

### 1. Update Dependencies
```bash
npm update
npm audit fix
```

### 2. Database Migrations
```bash
# Backup database before major updates
mongodump --uri="your_connection_string"

# Restore if needed
mongorestore --uri="your_connection_string" dump/
```

### 3. Zero-Downtime Deployment
```bash
# Blue-green deployment with PM2
pm2 start server.js --name "showmate-backend-new"
pm2 reload showmate-backend-new
pm2 stop showmate-backend
pm2 delete showmate-backend
pm2 rename showmate-backend-new showmate-backend
```

## 📞 Support

For deployment issues:
1. Check application logs
2. Verify environment variables
3. Test database connectivity
4. Review platform-specific documentation
5. Create an issue in the repository

## 🎯 Next Steps

After successful deployment:
1. Set up monitoring and alerting
2. Configure SSL certificates
3. Set up automated backups
4. Implement CI/CD pipeline
5. Set up performance monitoring
6. Configure error tracking (Sentry, etc.)
