import dotenv from "dotenv";
dotenv.config();
console.log("JWT_SECRET loaded?", !!process.env.JWT_SECRET);


import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import userRoutes from "./routes/user";
import interviewsRouter from "./routes/interviews";

import { errorHandler } from "./middlewares/errorHandler";
import { prisma } from "./prisma";
import { authGuard } from "./middlewares/authGuard";
import authRoutes from "./routes/auth";
import apiAuthRoutes from "./routes/apiAuth";
import { corsMiddleware } from "./middlewares/corsMiddleware";

const app = express();



/**
 * Config
 */
// Force 5001 if PORT is 5000 (common conflict) or undefined
const PORT = 5001;

// İstersen .env'de: CORS_ORIGIN=http://localhost:5173,http://localhost:3000
const corsOriginEnv = process.env.CORS_ORIGIN || "http://localhost:5173";
const corsOrigins = corsOriginEnv.split(",").map((o) => o.trim());

// Middleware
app.use(corsMiddleware);
app.use(express.json());

/**
 * Swagger
 */
const openapiPath = path.join(__dirname, "..", "docs", "openapi.yaml");

if (!fs.existsSync(openapiPath)) {
  console.error("❌ ERROR: openapi.yaml not found at:", openapiPath);
} else {
  console.log("✔ Swagger file loaded from:", openapiPath);
}

const swaggerDocument = YAML.load(openapiPath);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, { explorer: true })
);

/**
 * Routes
 * Swagger request URL'in /api/... olduğu için prefix'i /api yaptık
 */

app.get("/api/me", authGuard, (req, res) => {
  res.json({ success: true, user: req.user });
});

// Legacy Auth (Mock / In-memory)
app.use("/auth", authRoutes);

// New API v1 Auth (DB-backed)
app.use("/api/auth", apiAuthRoutes);

// New API v1 User
app.use("/api/user", userRoutes);

// New API v1 Interviews
app.use("/api/interviews", interviewsRouter);


app.use(corsMiddleware);
// Health & debug routes (istersen bunları da /api altına alalım)
app.get("/api/health/db", async (_req, res) => {
  try {
    await prisma.$connect();
    res.json({ status: "ok", message: "Database connection successful" });
  } catch (error) {
    console.error("DB Connection Error:", error);
    res.status(500).json({ status: "error", message: "Database connection failed", error });
  }
});

app.get("/api/users", async (_req, res) => {
  const users = await prisma.user.findMany();
  res.json({ success: true, users });
});

// Root Endpoint
app.get("/", (_req, res) => {
  res.json({ message: "Backend API is running!" });
});

// Error handler
app.use(errorHandler);

// Error handler
app.use(errorHandler);

/**
 * DEBUG: registered routes
 */
console.log(
  "ROUTES:",
  (app as any)._router?.stack
    ?.filter((r: any) => r.route)
    ?.map((r: any) => ({
      path: r.route.path,
      methods: Object.keys(r.route.methods),
    }))
);
// Start server 
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📘 Swagger UI at → http://localhost:${PORT}/api-docs`);
});

