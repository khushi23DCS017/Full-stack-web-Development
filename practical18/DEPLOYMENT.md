# 🚀 Deployment Guide - Taskify

This guide will walk you through deploying your Taskify application to Firebase Hosting and setting up a production environment.

## 📋 Prerequisites

- Node.js (v14 or higher)
- Firebase CLI installed
- MongoDB Atlas account (recommended for production)
- GitHub account

## 🔧 Step 1: Firebase Setup

### 1.1 Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 1.2 Login to Firebase
```bash
firebase login
```

### 1.3 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `taskify-app`
4. Enable Google Analytics (optional)
5. Click "Create project"

### 1.4 Initialize Firebase in Your Project
```bash
firebase init hosting
```

Select your Firebase project and configure:
- Public directory: `frontend/build`
- Single-page app: `Yes`
- Overwrite index.html: `No`

## 🗄️ Step 2: Database Setup

### 2.1 MongoDB Atlas (Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Create a database user
5. Whitelist your IP address
6. Get your connection string

### 2.2 Update Environment Variables
Create `.env` file in backend directory:
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taskify?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-for-production
NODE_ENV=production
```

## 🌐 Step 3: Backend Deployment

### Option A: Heroku (Recommended)
1. Create account at [Heroku](https://heroku.com)
2. Install Heroku CLI
3. Create new app:
```bash
heroku create taskify-backend
```
4. Set environment variables:
```bash
heroku config:set MONGO_URI=your-mongodb-connection-string
heroku config:set JWT_SECRET=your-jwt-secret
heroku config:set NODE_ENV=production
```
5. Deploy:
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Option B: Railway
1. Go to [Railway](https://railway.app)
2. Connect your GitHub repository
3. Set environment variables in Railway dashboard
4. Deploy automatically

### Option C: Render
1. Go to [Render](https://render.com)
2. Create new Web Service
3. Connect your GitHub repository
4. Set environment variables
5. Deploy

## 🎨 Step 4: Frontend Deployment

### 4.1 Update API URLs
Update `frontend/src/context/AuthContext.js`:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-backend-url.herokuapp.com';
```

### 4.2 Build the Frontend
```bash
cd frontend
npm run build
```

### 4.3 Deploy to Firebase
```bash
firebase deploy
```

## 🔗 Step 5: GitHub Repository Setup

### 5.1 Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial commit: Taskify MERN app"
```

### 5.2 Create GitHub Repository
1. Go to [GitHub](https://github.com)
2. Click "New repository"
3. Name: `taskify`
4. Description: "Modern task management app built with MERN stack"
5. Make it public
6. Don't initialize with README (we already have one)

### 5.3 Push to GitHub
```bash
git remote add origin https://github.com/yourusername/taskify.git
git branch -M main
git push -u origin main
```

## 🔧 Step 6: Environment Configuration

### 6.1 Frontend Environment Variables
Create `frontend/.env`:
```env
REACT_APP_API_URL=https://your-backend-url.herokuapp.com
```

### 6.2 Update Firebase Configuration
Update `.firebaserc`:
```json
{
  "projects": {
    "default": "your-firebase-project-id"
  }
}
```

## 🚀 Step 7: Final Deployment

### 7.1 Deploy Backend
```bash
cd backend
git add .
git commit -m "Deploy backend"
git push heroku main
```

### 7.2 Deploy Frontend
```bash
cd frontend
npm run build
firebase deploy
```

## 🔍 Step 8: Testing & Verification

### 8.1 Test Backend
```bash
curl https://your-backend-url.herokuapp.com/
```

### 8.2 Test Frontend
Visit your Firebase hosting URL and test:
- User registration
- User login
- Task creation
- Task management
- Project creation

## 📱 Step 9: Mobile Optimization

### 9.1 PWA Configuration
Add to `frontend/public/manifest.json`:
```json
{
  "short_name": "Taskify",
  "name": "Taskify - Task Management App",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#667eea",
  "background_color": "#ffffff"
}
```

## 🔒 Step 10: Security & Performance

### 10.1 Security Headers
Add to `firebase.json`:
```json
{
  "hosting": {
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "X-Frame-Options",
            "value": "DENY"
          },
          {
            "key": "X-XSS-Protection",
            "value": "1; mode=block"
          }
        ]
      }
    ]
  }
}
```

### 10.2 Performance Optimization
- Enable gzip compression
- Optimize images
- Use CDN for static assets
- Implement caching strategies

## 📊 Step 11: Monitoring & Analytics

### 11.1 Firebase Analytics
1. Enable Firebase Analytics in your project
2. Add tracking code to your app
3. Monitor user engagement and performance

### 11.2 Error Monitoring
Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for user behavior

## 🎉 Step 12: Launch Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Database connected and working
- [ ] User authentication working
- [ ] All features tested
- [ ] Mobile responsiveness verified
- [ ] Performance optimized
- [ ] Security headers configured
- [ ] Analytics configured
- [ ] GitHub repository updated
- [ ] README.md updated with live URLs

## 🔗 Live URLs

After deployment, your app will be available at:
- **Frontend**: `https://your-project-id.web.app`
- **Backend**: `https://your-backend-url.herokuapp.com`
- **GitHub**: `https://github.com/yourusername/taskify`

## 🆘 Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure your backend allows requests from your frontend domain
2. **Database Connection**: Verify MongoDB connection string and network access
3. **Build Failures**: Check for TypeScript errors and missing dependencies
4. **Environment Variables**: Ensure all required variables are set in production

### Getting Help:
- Check Firebase Console for hosting logs
- Check Heroku logs: `heroku logs --tail`
- Check MongoDB Atlas for connection issues
- Review browser console for frontend errors

## 🎯 Next Steps

1. Set up custom domain (optional)
2. Implement CI/CD pipeline
3. Add automated testing
4. Set up monitoring and alerts
5. Plan for scaling

---

**Congratulations! 🎉 Your Taskify app is now live and ready to boost productivity!**
