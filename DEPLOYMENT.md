# Deployment Guide

Complete guide for deploying the Inventory Management System to Netlify (Frontend) and Railway (Backend).

## 📋 Prerequisites

1. GitHub account with repository
2. Netlify account (free tier available)
3. Railway account (free tier available)

## 🚂 Backend Deployment (Railway)

### Step 1: Prepare Backend

1. Ensure `backend/package.json` has the correct scripts:
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

2. Create `backend/.gitignore`:
```
node_modules/
uploads/
*.db
.env
```

### Step 2: Deploy to Railway

1. Go to [railway.app](https://railway.app) and sign in

2. Click **"New Project"**

3. Select **"Deploy from GitHub repo"**

4. Choose your repository

5. Railway will auto-detect Node.js

6. Add these settings:
   - **Root Directory**: `/backend`
   - **Start Command**: `npm start`
   - **PORT**: Automatically provided by Railway

7. Click **"Deploy"**

8. Wait for deployment to complete (2-3 minutes)

9. Copy your Railway URL (e.g., `https://your-app.up.railway.app`)

### Step 3: Test Backend

Visit: `https://your-app.up.railway.app/api/health`

You should see: `{"status":"ok","timestamp":"..."}`

## 🌐 Frontend Deployment (Netlify)

### Step 1: Update Environment Variables

1. Create `.env.production` in root directory:
```
VITE_API_BASE_URL=https://your-app.up.railway.app/api
```

Replace with your actual Railway URL.

### Step 2: Build and Test Locally

```bash
npm run build
npm run preview
```

Visit `http://localhost:4173` to test the production build.

### Step 3: Deploy to Netlify

**Option A: Via Netlify UI**

1. Go to [netlify.com](https://netlify.com) and sign in

2. Click **"Add new site"** → **"Import an existing project"**

3. Connect to GitHub and select your repository

4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Base directory**: Leave empty (root)

5. Add environment variables:
   - Key: `VITE_API_BASE_URL`
   - Value: `https://your-app.up.railway.app/api`

6. Click **"Deploy site"**

**Option B: Via Netlify CLI**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist

# Follow prompts and select/create site
```

### Step 4: Configure Redirects

Create `public/_redirects`:
```
/* /index.html 200
```

This ensures React Router works correctly.

### Step 5: Test Deployment

Visit your Netlify URL (e.g., `https://your-app.netlify.app`)

Test all features:
- Login
- View products
- Search/filter
- Add/edit/delete
- Import/export CSV
- View history

## 🔧 Environment Variables Summary

### Frontend (.env.production)
```
VITE_API_BASE_URL=https://your-backend-url.up.railway.app/api
```

### Backend (Railway)
```
PORT=<automatically set by Railway>
NODE_ENV=production
```

## 📝 Post-Deployment Checklist

- [ ] Backend health check working
- [ ] Frontend loads without errors
- [ ] Login functionality works
- [ ] API calls successful (check browser console)
- [ ] CORS properly configured
- [ ] CSV import/export working
- [ ] All CRUD operations functional
- [ ] Inventory history loading
- [ ] Mobile responsiveness verified

## 🐛 Common Issues

### CORS Errors
**Problem**: Frontend can't connect to backend

**Solution**: 
1. Check CORS is enabled in backend `server.js`
2. Verify `VITE_API_BASE_URL` in Netlify environment variables
3. Ensure Railway app is running

### 404 on Page Refresh
**Problem**: React Router routes return 404

**Solution**: 
1. Ensure `public/_redirects` file exists
2. File content: `/* /index.html 200`
3. Redeploy to Netlify

### API Endpoint Not Found
**Problem**: Backend routes not working

**Solution**:
1. Check Railway logs for errors
2. Verify backend is running on Railway
3. Test health endpoint: `/api/health`
4. Check start command in Railway settings

### Database Not Persisting
**Problem**: Data lost on Railway restart

**Solution**:
Railway's free tier has ephemeral storage. For production:
1. Upgrade to Railway Pro for persistent storage
2. Or use external database (PostgreSQL, MySQL)

## 📊 Monitoring

### Railway Dashboard
- View logs: Railway Project → Deployments → Logs
- Check metrics: CPU, Memory, Network usage
- Monitor crashes and errors

### Netlify Dashboard
- View deploy logs
- Check build times
- Monitor bandwidth usage
- Review form submissions (if any)

## 🔄 Continuous Deployment

Both Railway and Netlify support automatic deployments:

1. **Push to GitHub** → Triggers automatic deployment
2. **Railway**: Deploys backend automatically
3. **Netlify**: Deploys frontend automatically
4. **Watch logs** in respective dashboards

## 📧 Submission Format

When submitting your project, provide:

```
GitHub Repository: https://github.com/username/repo-name
Live Frontend URL: https://your-app.netlify.app
Live Backend URL: https://your-app.up.railway.app/api
```

## 🎉 Success!

Your Inventory Management System is now live!

Test everything thoroughly before submitting.
