# Big-Leap

AI-powered interview preparation platform with CV analysis and mock interview sessions.

## 🏗️ Architecture

**Monorepo Structure:**
- `backend/` - Express.js + TypeScript + Prisma + PostgreSQL
- `frontend/` - React + TypeScript + Vite
- `docker-compose.yml` - Local development & production deployment

**Deployment Stack:**
- **Backend**: DigitalOcean Droplet (Docker + Docker Compose)
- **Frontend**: Cloudflare Pages
- **Database**: PostgreSQL (Docker container with persistent volume)
- **Storage**: Cloudflare R2 (S3-compatible)

---

## 🚀 Quick Start (Docker)

### Prerequisites
- Docker & Docker Compose installed
- Node.js 20+ (for local development without Docker)

### 1. Clone & Setup Environment

```bash
# Clone the repository
git clone <your-repo-url>
cd Big-Leap

# Copy environment file
cp .env.example .env

# Edit .env and set your values (especially JWT_SECRET and POSTGRES_PASSWORD)
nano .env
```

### 2. Start with Docker Compose

```bash
# Start backend + database (recommended for production)
docker-compose up -d

# OR start with frontend included (for local testing)
docker-compose --profile full-stack up -d
```

### 3. Run Database Migrations

Migrations run automatically on backend startup, but you can run manually:

```bash
docker-compose exec backend npx prisma migrate deploy
```

### 4. Verify Services

```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f postgres

# Test backend health
curl http://localhost:5001/
curl http://localhost:5001/api/health/db
```

---

## 🛠️ Development

### Local Development (Without Docker)

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your local database URL
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5001/api
npm run dev
```

### Docker Development

```bash
# Rebuild after code changes
docker-compose up -d --build

# View real-time logs
docker-compose logs -f backend

# Execute commands in containers
docker-compose exec backend npm run db:migrate
docker-compose exec backend npx prisma studio

# Stop services
docker-compose down

# Stop and remove volumes (⚠️ deletes database data)
docker-compose down -v
```

---

## 📦 Production Deployment

### Phase 1: Setup DigitalOcean Droplet

```bash
# SSH into your droplet
ssh root@your-droplet-ip

# Install Docker & Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Clone your repository
git clone <your-repo-url>
cd Big-Leap

# Create production .env file
cp .env.example .env
nano .env
```

**Required environment variables:**
```bash
POSTGRES_PASSWORD=<strong-password>
JWT_SECRET=<generate-with: openssl rand -base64 32>
CORS_ORIGIN=https://yourdomain.pages.dev
S3_REGION=auto
S3_BUCKET=<your-r2-bucket>
S3_ACCESS_KEY_ID=<your-r2-key>
S3_SECRET_ACCESS_KEY=<your-r2-secret>
S3_PUBLIC_BASE_URL=<your-r2-url>
```

### Phase 2: Deploy Backend

```bash
# Start services
docker-compose up -d

# Check logs
docker-compose logs -f

# Verify backend is running
curl http://localhost:5001/api/health/db
```

### Phase 3: Setup Nginx Reverse Proxy (Optional)

For production, set up Nginx on the droplet to handle SSL:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Then setup SSL with Cloudflare or Let's Encrypt.

### Phase 4: Deploy Frontend to Cloudflare Pages

1. Go to Cloudflare Pages dashboard
2. Connect your GitHub repository
3. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `frontend`
4. Add environment variable:
   - `VITE_API_URL=https://api.yourdomain.com/api`
5. Deploy!

---

## 🗄️ Database Management

### Migrations

```bash
# Development: Create and apply migration
cd backend
npm run db:migrate

# Production: Apply migrations only
docker-compose exec backend npx prisma migrate deploy
```

### Prisma Studio (Database GUI)

```bash
# Local
cd backend
npx prisma studio

# Docker
docker-compose exec backend npx prisma studio
# Then access at http://localhost:5555
```

### Backup & Restore

```bash
# Backup
docker-compose exec postgres pg_dump -U bigleap_user bigleap > backup.sql

# Restore
docker-compose exec -T postgres psql -U bigleap_user bigleap < backup.sql
```

---

## 🔧 Troubleshooting

### Backend can't connect to database

```bash
# Check postgres is running
docker-compose ps postgres

# Check logs
docker-compose logs postgres

# Verify DATABASE_URL in .env uses 'postgres' as hostname
# DATABASE_URL=postgresql://bigleap_user:password@postgres:5432/bigleap?schema=public
```

### CORS errors

Make sure `CORS_ORIGIN` in backend `.env` includes your frontend URL:
```bash
CORS_ORIGIN=http://localhost:5173,https://yourdomain.pages.dev
```

### Prisma errors

```bash
# Regenerate Prisma client
docker-compose exec backend npx prisma generate

# Reset database (⚠️ deletes all data)
docker-compose exec backend npx prisma migrate reset
```

---

## 📚 API Documentation

Swagger UI available at: `http://localhost:5001/api-docs`

---

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

---

## 📝 Environment Variables Reference

### Root `.env` (for docker-compose)
- `POSTGRES_PASSWORD` - Database password
- `NODE_ENV` - Environment (production/development)
- `JWT_SECRET` - JWT signing secret (min 32 chars)
- `CORS_ORIGIN` - Allowed frontend origins
- `S3_*` - Cloudflare R2 credentials
- `VITE_API_URL` - Frontend API URL

### Backend `.env`
See `backend/.env.example` and `backend/.env.production.example`

### Frontend `.env`
See `frontend/.env.example` and `frontend/.env.production.example`

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

---

## 📄 License

[Your License Here]