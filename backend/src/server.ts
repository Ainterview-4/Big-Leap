import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",

  credentials: true
}));
app.use(express.json());

// Absolute path for OpenAPI file (fix for macOS)
const openapiPath = path.join(__dirname, "..", "docs", "openapi.yaml");

if (!fs.existsSync(openapiPath)) {
  console.error("❌ ERROR: openapi.yaml not found at:", openapiPath);
} else {
  console.log("✔ Swagger file loaded from:", openapiPath);
}

const swaggerDocument = YAML.load(openapiPath);

// Swagger UI Route
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, { explorer: true })
);

// Auth Routes
import authRoutes from "./routes/auth";
app.use("/auth", authRoutes);

// Root Endpoint
app.get("/", (req, res) => {
  res.json({ message: "Backend API is running!" });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📘 Swagger UI at → http://localhost:${PORT}/api-docs`);
});
