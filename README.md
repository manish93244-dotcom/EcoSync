# EcoSync Grid Diagnostics Hub

A high-fidelity grid diagnostics dashboard and telemetry ledger designed to monitor smart meters, solar panel generation, load draws, and historical energy analytics.

## ⚡ Deployment on Vercel

This project is fully optimized and configured for seamless deployment on **Vercel**. 

### ⚙️ Vercel Project Configuration

When importing this project into Vercel, use the following settings:

*   **Framework Preset:** `Vite` (Vercel highlights this automatically)
*   **Root Directory:** `./` (Leave as default)
*   **Build Command:** `npm run build`
*   **Output Directory:** `dist`

> [!CAUTION]
> **Fixing the "No Output Directory named 'public' found" error:**
> If Vercel displays this error during your deployment, it means Vercel's project configuration fell back to the generic "Other" framework configuration (which mistakenly expects the output directory to be `public` instead of `dist`).
>
> To resolve this quickly:
> 1. Open your Vercel project in the [Vercel Dashboard](https://vercel.com/dashboard).
> 2. Go to the **Settings** tab at the top.
> 3. Click **Build & Development** on the left menu.
> 4. Under **Framework Preset**, select **Vite** (or keep "Other").
> 5. Find the **Output Directory** section, turn **Override** ON, and change the value from `public` to `dist`.
> 6. Click **Save**.
> 7. Re-deploy the latest deployment (or push a small commit to GitHub to trigger a fresh auto-build).

### 🛠️ Configuration Files Included
*   **`vercel.json`**: Fixed routing paths. In a Single Page Application (React/Vite), navigating directly to nested routes can cause `404` errors on refresh. The included `vercel.json` file ensures all incoming requests are gently rewritten back to the index page (`index.html`) so React router remains in control.
*   **`index.css`**: Configured `@import` order to guarantee warning-free production CSS compilation.

---

## 🔄 Autofetch & Auto-deploy with Git (Continuous Integration)

Vercel makes auto-fetching and deploying code changes incredibly simple. Every time you push code modifications to your repository (e.g., standard GitHub branch push), Vercel automatically detects the update, pulls the fresh code, compiles it, and deploys it live.

Here is the step-by-step continuous deployment setup:

### Step 1: Create a GitHub Repository
1. Go to your [GitHub Dashboard](https://github.com) and click **New** to create a repository.
2. Initialize it **without** a README or .gitignore (since this project already contains them).
3. Push your existing code to the repository using your terminal:
   ```bash
   git init
   git add .
   git commit -m "Initialize project: EcoSync Hub"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

### Step 2: Connect Vercel to GitHub
1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** and select **Project**.
3. Under **Import Git Repository**, find your newly created GitHub repository and click **Import**.
4. Confirm standard compilation parameters (Vite is automatically detected).
5. Click **Deploy**.

---

## 🚀 True Auto-Fetch (Dynamic Git Sync)
From this point onwards:
*   Any time you edit a file on your computer and run `git push origin main`, **Vercel will immediately detect the push**.
*   A new live preview build starts automatically.
*   Once finished, your live website is updated instantly with the changes!
