import express from "express";
import cors from "cors";
import path from "path";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Load OpenAPI (swagger) file
const openapiPath = path.resolve(__dirname, "../docs/openapi.yaml");
const swaggerDocument = YAML.load(openapiPath);

// Swagger UI Route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  explorer: true,
}));

// Root Endpoint
app.get("/", (req, res) => {
  res.json({ message: "Backend API is running!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📘 Swagger UI available at http://localhost:${PORT}/api-docs`);
});


