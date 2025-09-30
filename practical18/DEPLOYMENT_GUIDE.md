# 🚀 Full Stack Deployment Guide

## ✅ Frontend (Already Deployed!)
Your React frontend is live at: **https://practical11-c4e74.web.app**

## 🔧 Backend Deployment Options

### Option 1: Railway (Recommended - Free Tier Available)

1. **Sign up at Railway**: Go to [railway.app](https://railway.app) and sign up with GitHub
2. **Create New Project**: Click "New Project" → "Deploy from GitHub repo"
3. **Select your repository** and choose the `backend` folder
4. **Set Environment Variables**:
   - `MONGO_URI`: Your MongoDB connection string (use MongoDB Atlas for production)
   - `JWT_SECRET`: A strong secret key for JWT tokens
   - `PORT`: Railway will set this automatically

5. **Deploy**: Railway will automatically build and deploy your backend

### Option 2: Render (Alternative - Free Tier Available)

1. **Sign up at Render**: Go to [render.com](https://render.com)
2. **Create New Web Service**: Connect your GitHub repository
3. **Configure**:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Environment: Node
4. **Set Environment Variables** (same as Railway)
5. **Deploy**

### Option 3: Heroku (Paid after free tier)

1. **Install Heroku CLI**: Download from [heroku.com](https://heroku.com)
2. **Login**: `heroku login`
3. **Create App**: `heroku create your-app-name`
4. **Set Environment Variables**: `heroku config:set MONGO_URI=your-mongodb-uri`
5. **Deploy**: `git push heroku main`

## 🗄️ Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Account**: Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. **Create Cluster**: Choose free tier (M0)
3. **Get Connection String**: 
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
4. **Whitelist IP**: Add `0.0.0.0/0` for all IPs (or your hosting provider's IPs)

## 🔗 Update Frontend API URLs

After deploying your backend, update your frontend to use the new API URL:

1. **Find your backend URL** (e.g., `https://your-app.railway.app`)
2. **Create environment file**:
   ```bash
   # In frontend directory
   echo "REACT_APP_API_URL=https://your-backend.railway.app" > .env
   ```
3. **Rebuild and redeploy frontend**:
   ```bash
   cd frontend
   npm run build
   cd ..
   firebase deploy --only hosting
   ```

**Alternative**: You can also set the environment variable directly in Firebase Hosting:
- Go to Firebase Console → Hosting → Your site
- Add environment variable: `REACT_APP_API_URL=https://your-backend.railway.app`

## 🧪 Testing Your Deployment

1. **Test Backend**: Visit your backend URL (should show API message)
2. **Test Frontend**: Visit your Firebase hosting URL
3. **Test Full Flow**: Try registering, logging in, and creating tasks

## 📝 Environment Variables Summary

### Backend (.env)
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taskify
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
```

### Frontend (if needed)
```
REACT_APP_API_URL=https://your-backend-url.railway.app
```

## 🎯 Quick Start Commands

```bash
# Deploy frontend (already done)
firebase deploy --only hosting

# For Railway deployment
# 1. Push code to GitHub
# 2. Connect Railway to your repo
# 3. Set environment variables
# 4. Deploy automatically

# For Render deployment
# 1. Connect GitHub repo
# 2. Set build/start commands
# 3. Set environment variables
# 4. Deploy
```

## 🔍 Troubleshooting

- **CORS Issues**: Make sure your backend allows your frontend domain
- **Database Connection**: Verify MongoDB Atlas connection string
- **Environment Variables**: Double-check all required variables are set
- **Build Errors**: Check logs in your hosting platform

## 📊 Monitoring

- **Firebase Console**: Monitor frontend hosting
- **Railway/Render Dashboard**: Monitor backend logs and performance
- **MongoDB Atlas**: Monitor database usage and performance
