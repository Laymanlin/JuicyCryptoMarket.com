# Deployment Guide for JuicyCryptoMarket.com

This guide covers deploying the full-stack application with MongoDB Atlas, Render (backend), and Netlify (frontend).

## Prerequisites

- MongoDB Atlas account (free tier available at https://www.mongodb.com/cloud/atlas)
- Render account (free tier available at https://render.com)
- Netlify account (free tier available at https://netlify.com)
- GitHub account with access to this repository

## Step 1: Set up MongoDB Atlas

### 1.1 Create a MongoDB Cluster

1. Go to https://www.mongodb.com/cloud/atlas and sign up/login
2. Click "Build a Database"
3. Choose "Free" tier (M0 Sandbox)
4. Select a cloud provider and region (choose closest to your users)
5. Name your cluster (e.g., "juicycrypto-cluster")
6. Click "Create"

### 1.2 Configure Database Access

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and strong password (save these!)
5. Set user privileges to "Read and write to any database"
6. Click "Add User"

### 1.3 Configure Network Access

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0) for development
   - Note: For production, restrict to your server's IP addresses
4. Click "Confirm"

### 1.4 Get Connection String

1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" and version "4.1 or later"
5. Copy the connection string, it will look like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your database user password
7. Add `/juicycrypto` before the `?` to specify the database name:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/juicycrypto?retryWrites=true&w=majority
   ```

## Step 2: Deploy Backend to Render

### 2.1 Prepare Backend for Deployment

The backend is already configured for Render deployment.

### 2.2 Create Render Web Service

1. Go to https://render.com and sign up/login
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `juicycrypto-backend` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your deployment branch)
   - **Root Directory**: Leave empty (or `.` if prompted)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### 2.3 Set Environment Variables on Render

In the "Environment" section, add these variables:

```
NODE_ENV=production
JWT_SECRET=<generate a strong random string, e.g., 64 characters>
JWT_EXPIRES_IN=7d
MONGODB_URI=<your MongoDB Atlas connection string from Step 1.4>
SESSION_SECRET=<generate another strong random string>
ALLOWED_ORIGINS=<your Netlify frontend URL, e.g., https://juicycrypto.netlify.app>
PORT=3001
```

**Important**: Generate strong random secrets for JWT_SECRET and SESSION_SECRET. You can use:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2.4 Deploy

1. Click "Create Web Service"
2. Wait for the build and deployment to complete
3. Your backend will be available at: `https://your-app-name.onrender.com`
4. Test it by visiting: `https://your-app-name.onrender.com/api/health`

## Step 3: Deploy Frontend to Netlify

### 3.1 Configure Frontend for Production

Update the frontend to use the production backend URL.

1. Edit `frontend/src/components/Login.js` and `frontend/src/App.js`
2. Replace all `/api/` URLs with your Render backend URL

**Better approach**: Use environment variables in React:

Create `frontend/.env.production`:
```
REACT_APP_API_URL=https://your-backend.onrender.com
```

Then update API calls to use `process.env.REACT_APP_API_URL + '/api/auth/login'`

### 3.2 Build Frontend

```bash
cd frontend
npm install
npm run build
```

### 3.3 Deploy to Netlify

**Option 1: Drag and Drop (Easiest)**

1. Go to https://netlify.com and sign up/login
2. Go to the "Sites" page
3. Drag and drop the `frontend/build` folder onto the deploy area
4. Your site will be published at: `https://random-name.netlify.app`

**Option 2: Git Integration (Recommended for updates)**

1. Go to https://netlify.com and sign up/login
2. Click "Add new site" > "Import an existing project"
3. Choose "GitHub" and authorize
4. Select your repository
5. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`
6. Add environment variable:
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://your-backend.onrender.com`
7. Click "Deploy site"

### 3.4 Configure Custom Domain (Optional)

1. Go to "Domain settings" in your Netlify site
2. Click "Add custom domain"
3. Follow instructions to configure DNS

## Step 4: Update CORS Configuration

After deploying frontend, update the `ALLOWED_ORIGINS` environment variable on Render:

1. Go to your Render service
2. Go to "Environment"
3. Update `ALLOWED_ORIGINS` with your Netlify URL:
   ```
   ALLOWED_ORIGINS=https://your-site.netlify.app,https://www.your-domain.com
   ```
4. Save changes (Render will automatically redeploy)

## Step 5: Test the Deployment

1. **Test Backend Endpoints**:
   - Visit: `https://your-backend.onrender.com/api/health`
   - Should return: `{"status":"ok","message":"JuicyCryptoMarket API is running"}`

2. **Test MongoDB Connection**:
   - Check Render logs for: "✅ Connected to MongoDB"
   - If connection fails, verify MONGODB_URI is correct

3. **Test Frontend**:
   - Visit: `https://your-site.netlify.app`
   - Should show the login page

4. **Test Registration**:
   - Click "Need an account? Register"
   - Fill in email and password
   - Submit form
   - Should redirect to dashboard

5. **Test Login**:
   - Log out
   - Log in with the same credentials
   - Should redirect to dashboard

6. **Test Demo Account**:
   - Click "Try Demo Account"
   - Should work independently

## Troubleshooting

### MongoDB Connection Issues

- Verify MONGODB_URI is correct and includes database name
- Check MongoDB Atlas Network Access allows connections
- Check Render logs for specific error messages

### CORS Errors

- Verify ALLOWED_ORIGINS includes your Netlify URL
- Check that credentials are being sent with requests
- Verify backend is receiving OPTIONS preflight requests

### Frontend Can't Connect to Backend

- Verify REACT_APP_API_URL is set correctly
- Check Network tab in browser DevTools for failed requests
- Verify Render service is running (check dashboard)

### Rate Limiting Issues

- Check Render logs if authentication fails repeatedly
- Default: 5 attempts per 15 minutes per IP
- May need to adjust in production for legitimate traffic

## Security Checklist

- [ ] Strong JWT_SECRET and SESSION_SECRET (64+ characters)
- [ ] MONGODB_URI not exposed in frontend code
- [ ] ALLOWED_ORIGINS restricted to your domains only
- [ ] MongoDB Network Access restricted (not 0.0.0.0/0 in production)
- [ ] HTTPS enabled on all endpoints (automatic with Render/Netlify)
- [ ] Regular security updates for dependencies

## Monitoring

- **Render**: Check logs and metrics in Render dashboard
- **MongoDB Atlas**: Monitor database operations in Atlas dashboard
- **Netlify**: Check analytics and deploy logs in Netlify dashboard

## Updating the Application

1. Make changes to your code
2. Commit and push to GitHub
3. Render and Netlify will automatically deploy if connected to GitHub
4. Or manually trigger deploys from their dashboards

## Cost Considerations

- **MongoDB Atlas Free Tier**: 512MB storage, shared clusters
- **Render Free Tier**: Service sleeps after 15 minutes of inactivity, 750 hours/month
- **Netlify Free Tier**: 100GB bandwidth, 300 build minutes/month

For production apps with consistent traffic, consider paid tiers for better performance.

## Support

If you encounter issues:
- Check Render logs: `https://dashboard.render.com/`
- Check MongoDB logs: Atlas dashboard
- Check browser console for frontend errors
- Review this deployment guide for missed steps
