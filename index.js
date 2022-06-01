const { append } = require("express/lib/response");
const express = require("./config/express");
const { logger } = require("./config/winston");
// const { swaggerUi, specs } = require("./modules/swagger");

const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output");
// const YAML = require("yamljs");
// const path = require("path");

const port = 3000;
const app = express();
app.listen(port);
logger.info(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);

// swagger
// /api-docs라는 path로 등록
// const swaggerSpec = YAML.load(path.join(__dirname, "./modules/swagger.yaml"));
// app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
