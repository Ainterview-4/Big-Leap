import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import fs from "fs";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

import { prisma } from "./prisma";
import { errorHandler } from "./middlewares/errorHandler";
import { authGuard } from "./middlewares/authGuard";
import { corsMiddleware } from "./middlewares/corsMiddleware";

import userRoutes from "./routes/user";
import authRoutes from "./routes/auth";
import cvRoutes from "./modules/cv/cv.routes";
import interviewRoutes from "./modules/interview/interview.routes";

console.log("JWT_SECRET loaded?", !!process.env.JWT_SECRET);

const app = express();

/**
 * Config
 */
const PORT = Number(process.env.PORT) || 5001;

/**
 * Middleware
 */
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
 */
app.get("/api/me", authGuard, (req, res) => {
  res.json({ success: true, user: req.user });
});

// ✅ Auth (single source of truth)
app.use("/api/auth", authRoutes);

// ✅ User
app.use("/api/user", userRoutes);

// ✅ CV
app.use("/api/cv", cvRoutes);

// ✅ Interview (plural to match frontend)
app.use("/api/interviews", interviewRoutes);

// Health & debug routes
app.get("/api/health/db", async (_req, res) => {
  try {
    await prisma.$connect();
    res.json({ status: "ok", message: "Database connection successful" });
  } catch (error) {
    console.error("DB Connection Error:", error);
    res.status(500).json({
      status: "error",
      message: "Database connection failed",
      error,
    });
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

// Error handler (✅ only once)
app.use(errorHandler);

/**
 * DEBUG: registered routes
 */
const getRoutes = (app: any) => {
  const routes: any[] = [];

  app._router?.stack?.forEach((layer: any) => {
    if (layer.route) {
      // Direct route
      routes.push({
        path: layer.route.path,
        methods: Object.keys(layer.route.methods)
      });
    } else if (layer.name === 'router' && layer.handle.stack) {
      // Router middleware - extract base path from regex
      const basePath = layer.regexp.source
        .replace('\\/?', '')
        .replace('(?=\\/|$)', '')
        .replace(/\\\//g, '/')
        .replace(/\^/g, '');

      layer.handle.stack.forEach((subLayer: any) => {
        if (subLayer.route) {
          routes.push({
            path: basePath + subLayer.route.path,
            methods: Object.keys(subLayer.route.methods)
          });
        }
      });
    }
  });

  return routes;
};

console.log("ROUTES:", getRoutes(app));

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📘 Swagger UI at → http://localhost:${PORT}/api-docs`);
});
