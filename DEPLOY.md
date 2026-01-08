# Deployment Guide (Vercel)

This project is structured as a monorepo with a `frontend` and a `backend`. Here is how to deploy both to Vercel.

## 1. Prepare your GitHub Repository
1. Initialize a git repository in the root folder: `git init`
2. Add all files: `git add .`
3. Commit: `git commit -m "Ready for deployment"`
4. Push to a new GitHub repository.

## 2. Deploy the Backend
1. Go to the [Vercel Dashboard](https://vercel.com/dashboard) and click **"New Project"**.
2. Import your GitHub repository.
3. In the configuration:
   - **Project Name**: `me-api-backend`
   - **Root Directory**: `backend`
   - **Framework Preset**: `Other`
4. Click **Deploy**.
5. Once deployed, copy your backend URL (e.g., `https://me-api-backend.vercel.app`).

## 3. Deploy the Frontend
1. Click **"New Project"** again.
2. Import the same GitHub repository.
3. In the configuration:
   - **Project Name**: `me-api-playground`
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
4. **Environment Variables**:
   - Add a variable: `VITE_API_URL`
   - Value: (The URL of your backend from step 2)
5. Click **Deploy**.

## ⚠️ Important Note on SQLite
Since this project uses **SQLite**, the database is a local file (`dev.db`). 
- On Vercel (which is serverless), the filesystem is **read-only** and data is reset on every request.
- **Result**: You can *Read* the seeded data, but *Create/Update* operations will not persist after the server sleeps.
- **Solution for Production**: To make data persist, you should replace SQLite with a hosted database like **MongoDB Atlas** or **Neon (Postgres)**.

## 4. Final Verification
- Log in to your frontend URL.
- Use the search bar to ensure it fetches data from the deployed backend.
- Check the `/health` endpoint of your backend URL.
