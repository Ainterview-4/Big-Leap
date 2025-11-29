import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { Express } from "express";

export function setupSwagger(app: Express) {
  const openapiPath = path.resolve(__dirname, "../../docs/openapi.yaml");

  const swaggerDocument = YAML.load(openapiPath);

  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      explorer: true,
    })
  );

  console.log("📘 Swagger UI running at /api-docs");
}
