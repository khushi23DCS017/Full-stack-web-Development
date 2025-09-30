# 🚀 Render Deployment Checklist

## ✅ Pre-deployment Setup

### 1. MongoDB Atlas Setup
- [ ] Create account at [mongodb.com/atlas](https://mongodb.com/atlas)
- [ ] Create new project "Taskify"
- [ ] Create free M0 cluster
- [ ] Create database user (username/password)
- [ ] Whitelist IP `0.0.0.0/0`
- [ ] Get connection string
- [ ] Replace `<password>` in connection string

### 2. GitHub Repository
- [ ] Push your code to GitHub
- [ ] Make sure `backend` folder is in root directory

## 🚀 Render Deployment Steps

### 1. Create Account
- [ ] Go to [render.com](https://render.com)
- [ ] Sign up with GitHub account

### 2. Create Web Service
- [ ] Click "New" → "Web Service"
- [ ] Connect GitHub repository
- [ ] Select your repository

### 3. Configure Service
- [ ] **Name**: `taskify-backend`
- [ ] **Root Directory**: `backend`
- [ ] **Environment**: `Node`
- [ ] **Build Command**: `npm install`
- [ ] **Start Command**: `npm start`
- [ ] **Plan**: Free

### 4. Environment Variables
Add these in "Advanced" section:
- [ ] `MONGO_URI` = `mongodb+srv://username:password@cluster.mongodb.net/taskify?retryWrites=true&w=majority`
- [ ] `JWT_SECRET` = `your-super-secret-jwt-key-here-make-it-very-long-and-random-12345`
- [ ] `NODE_ENV` = `production`

### 5. Deploy
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (2-3 minutes)
- [ ] Copy your backend URL (e.g., `https://taskify-backend-xxxx.onrender.com`)

## 🔗 After Deployment

### 1. Update Frontend
- [ ] Create `frontend/.env` file:
  ```
  REACT_APP_API_URL=https://your-backend-url.onrender.com
  ```
- [ ] Rebuild and redeploy frontend:
  ```bash
  cd frontend
  npm run build
  cd ..
  firebase deploy --only hosting
  ```

### 2. Test Full Stack
- [ ] Visit frontend: https://practical11-c4e74.web.app
- [ ] Test registration/login
- [ ] Test creating tasks/projects
- [ ] Check backend logs in Render dashboard

## 🆘 Troubleshooting

### Common Issues:
- **Build fails**: Check that `backend` is set as root directory
- **Database connection fails**: Verify MONGO_URI is correct
- **CORS errors**: Backend already configured for your frontend domain
- **Service crashes**: Check logs in Render dashboard

### Getting Help:
- Check Render logs in dashboard
- Verify environment variables are set correctly
- Test backend URL directly in browser
