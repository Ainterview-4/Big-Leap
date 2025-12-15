import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/errorHandler";
import { prisma } from "./prisma";

dotenv.config();

const app = express();

/**
 * Config
 */
const PORT = process.env.PORT || 5000;

// İstersen .env'de: CORS_ORIGIN=http://localhost:5173,http://localhost:3000
const corsOriginEnv = process.env.CORS_ORIGIN || "http://localhost:5173";
const corsOrigins = corsOriginEnv.split(",").map((o) => o.trim());

// Middleware
app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
  })
);
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
import authRoutes from "./routes/auth";
app.use("/api/auth", authRoutes);
import apiAuthRoutes from "./routes/apiAuth";
app.use("/api/auth", apiAuthRoutes);

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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📘 Swagger UI at → http://localhost:${PORT}/api-docs`);
});
