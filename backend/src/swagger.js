const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "IoT Application API",
      version: "1.0.0",
      description: "API cho Sensor và Action (Swagger Documentation)",
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
    ],
  },
  apis: [__dirname + "/route/*.js"], // nơi chứa các file route có swagger comment
};

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
