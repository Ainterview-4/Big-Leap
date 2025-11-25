# 🚀 Big-Leap Project — Setup Guide (Backend + Frontend)
This guide explains how to install all required modules for **backend** and **frontend** after cloning the repository.

Node modules are **NOT uploaded to GitHub**, so every developer must install them manually.

---

# 📌 1. Clone the Repository

```bash
git clone <repo-url>
cd Big-Leap
```

Make sure you are on the `dev` branch:

```bash
git checkout dev
```

---

# 🟦 2. Backend Setup (Node.js + TypeScript + Express)

## ✅ Step 1 — Enter the backend folder

```bash
cd backend
```

## ✅ Step 2 — Install backend dependencies

### 📦 Runtime dependencies:
```bash
npm install express cors jsonwebtoken bcryptjs pg redis
```

### 🛠 Development dependencies:
```bash
npm install -D typescript ts-node-dev @types/node @types/express @types/jsonwebtoken @types/cors
```

---

# 🛠 Step 3 — Build & Run Commands

### 🚀 Start development server:
```bash
npm run dev
```

### 🏗 Build TypeScript:
```bash
npm run build
```

### ▶ Start production build:
```bash
npm start
```

---

# 📁 Required backend folder structure

```
backend/
  src/
    controllers/
    middlewares/
    models/
    routes/
    services/
    utils/
    server.ts
  package.json
  tsconfig.json
  .gitignore
```

---

# 🟩 3. Frontend Setup (React + TypeScript + Vite + Material UI)

## ✅ Step 1 — Enter frontend folder

```bash
cd ../frontend
```

## ✅ Step 2 — Install dependencies

### 📦 Install project dependencies:
```bash
npm install
```

### 🎨 Install Material UI:
```bash
npm install @mui/material @emotion/react @emotion/styled
```

### 🖼 Icons (optional but recommended):
```bash
npm install @mui/icons-material
```

---

# ▶ Step 3 — Start the frontend

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# 🟦 4. What is NOT pushed to GitHub (ignored)

### ✔ `node_modules/`  
### ✔ `dist/`  
### ✔ `.env`  
### ✔ build artifacts  
### ✔ log files  

Each module has its own `.gitignore`, so these folders will never be uploaded.

Developers MUST install dependencies manually using:

```
npm install
```

---

# 🎯 5. After Pulling New Code

Whenever you pull the latest changes from GitHub:

```bash
git pull
```

Then run:

### Backend:
```bash
cd backend
npm install
```

### Frontend:
```bash
cd frontend
npm install
```

This ensures you have all new modules your teammates added.

---

# 🎉 Done!

Your backend & frontend are now fully configured.  
If you have any issues, contact the Scrum Master.

