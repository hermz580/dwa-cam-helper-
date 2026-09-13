# KinePost 🪑⚡

**Computer Vision & High-Differential Biomechanical Posture Analysis for Developers & Knowledge Workers**

KinePost is an ergonomics and computer vision application designed specifically for coders, remote professionals, and desk workers. It transforms standard laptop or desktop webcams into a calibrated biomechanical diagnostic studio.

---

## 🌟 Key Features

- **Optical "Cam Sense" & Calibration HUD**: 
  - Dual-perspective vector silhouettes (Sagittal 90° profile & Anterior frontal).
  - Real-time digital horizon gauge and lens pitch guidance to eliminate perspective distortion.
  - Interactive Simulated Live Stream mode for instant testing without physical webcam hardware.
  - 3-second settle countdown before capture.

- **Video Progression & Fatigue Analysis**:
  - Multi-frame video sprint capture that visualizes postural degradation over time.
  - Tracks forward cranial drift velocity, slump index, and time-to-fatigue onset.

- **High-Differential Biomechanical Vector Visualizer**:
  - Live Craniovertebral Angle (CVA) measurement and Forward Head Translation (FHT in mm).
  - Hansraj Cervical Torque calculation (measuring effective C7 load from 12 lbs up to 60 lbs).
  - Rapid Upper Limb Assessment (RULA) scoring with customizable alert thresholds.
  - Myofascial strain profile (hypertonic vs. inhibited muscle groups).

- **Height-Calibrated Ergonomic Anthropometrics**:
  - Exact ergonomic chair, desk, and monitor height targets based on individual user height.
  - Specific recommendations for laptop users, external monitors, and sit-stand desks.

- **Step-by-Slide Clinical Presentation Deck**:
  - 6-step guided walkthrough breaking down biomechanical findings into clear, actionable advice.

- **Deep Work Integration**:
  - Ergonomic break intervals synced with Pomodoro deep work blocks.

---

## 🚀 One-Click Deployment to GitHub Pages

This repository is pre-configured with a GitHub Actions workflow (`.github/workflows/deploy.yml`) for automated static deployment to GitHub Pages.

### Step 1: Push to GitHub
If you haven't pushed this repository yet:
```bash
git init
git add .
git commit -m "Initial release of KinePost"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git
git push -u origin main
```

### Step 2: Enable GitHub Pages in Repository Settings
1. On GitHub, navigate to your repository.
2. Click **Settings** (tab at top).
3. In the left navigation sidebar, click **Pages**.
4. Under **Build and deployment** > **Source**, select **GitHub Actions**.
5. That's it! GitHub Actions will automatically run `.github/workflows/deploy.yml` and publish your app.
6. Your live site will be accessible at:
   `https://<YOUR_USERNAME>.github.io/<YOUR_REPO_NAME>/`

---

## 🔒 Public Repository Security & Privacy

This codebase has been verified to be 100% safe for public repositories:

- **No Hardcoded Secrets or API Keys**: No API keys, tokens, or credentials are hardcoded anywhere in the codebase.
- **Hardened `.gitignore`**: Automatically excludes all `.env`, `.env.*`, and `.env.local` files, preventing accidental commits of local secrets.
- **Client-Side Safe**: When hosted on GitHub Pages as a static application, the app operates client-side with built-in biomechanical modeling and simulation engines.
- **Zero Personal Data Exposure**: Camera feeds are processed locally in your browser and are never stored or transmitted without your explicit action.

---

## 💻 Local Development

### Prerequisites
- Node.js 18+ or 20+
- npm (or bun/pnpm/yarn)

### Installation
```bash
# Clone the repository
git clone https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git
cd <YOUR_REPO_NAME>

# Install dependencies
npm install

# Start local full-stack development server (binds to http://localhost:3000)
npm run dev
```

### Optional: Gemini AI Integration
To enable real-time Gemini AI vision analysis locally or on server-side hosting (Cloud Run, Render, Railway, Vercel):
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```
3. Restart the development server. If no key is configured, KinePost automatically falls back to its built-in biomechanical calculation engine.

### Building for GitHub Pages Locally
```bash
npm run build:gh-pages
```
The static files and SPA fallback (`404.html`) will be generated in the `dist/` directory.

---

## 📄 License
MIT
