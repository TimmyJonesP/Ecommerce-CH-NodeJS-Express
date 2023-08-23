import swaggerUiExpress from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { __dirname } from "./path.utils.js";

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "E-commerce Project Documentation",
      description: "CRUD Products and cart handler",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};

export const swaggerSpecs = swaggerJSDoc(swaggerOptions);
