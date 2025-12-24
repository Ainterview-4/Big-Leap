# Port Configuration - Big-Leap

## 🎯 Standard Development Ports

### Frontend
- **Port**: `5173` (fixed, won't change)
- **Configuration**: `frontend/vite.config.ts`
- **Setting**: `strictPort: true` - Vite will fail if port 5173 is busy instead of switching to 5174

### Backend
- **Port**: `5001`
- **API**: http://localhost:5001
- **Swagger**: http://localhost:5001/api-docs

---

## 🔒 CORS Configuration

### Root `.env` (Docker)
```bash
CORS_ORIGIN=http://localhost:5173
```

### Backend `.env` (Local Dev)
```bash
CORS_ORIGIN=http://localhost:5173
```

**Single port only** - No more 5173/5174 conflicts!

---

## 🚀 How to Start Development

### Option 1: Docker (Backend + Database)
```bash
docker compose up -d
```
- Backend: http://localhost:5001
- Database: Internal only

### Option 2: Local (Everything)
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```
- Frontend: http://localhost:5173 (always)
- Backend: http://localhost:5001

---

## ⚠️ Troubleshooting

### "Port 5173 is already in use"
This means another Vite process is running. Find and kill it:
```bash
# Find process using port 5173
lsof -ti:5173

# Kill it
kill -9 $(lsof -ti:5173)

# Or use fuser
fuser -k 5173/tcp
```

### CORS Errors
Make sure:
1. Frontend is running on port 5173 (check browser URL)
2. Backend CORS_ORIGIN includes `http://localhost:5173`
3. Restart backend after changing CORS settings

---

## 📝 Files Updated

1. ✅ `frontend/vite.config.ts` - Added `strictPort: true`
2. ✅ `/.env` - Single port CORS
3. ✅ `/.env.example` - Single port CORS
4. ✅ `/backend/.env.example` - Single port CORS

---

## ✨ Benefits

- ✅ **Consistent**: Always port 5173, never 5174
- ✅ **No CORS conflicts**: Single origin configured
- ✅ **Predictable**: Same port every time you start dev server
- ✅ **Clear errors**: If port is busy, Vite will tell you instead of silently switching
