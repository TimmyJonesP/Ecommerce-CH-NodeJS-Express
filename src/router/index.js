import productsRouter from "../controllers/products.controller.js";
import swaggerUiExpress from "swagger-ui-express";
import { swaggerSpecs } from "../utils/swagger.utils.js";
import cartController from "../controllers/carts.controller.js";

const router = (app) => {
  app.use("/api/products", productsRouter);
  app.use("/api/carts", cartController);
  app.use(
    "/api/docs",
    swaggerUiExpress.serve,
    swaggerUiExpress.setup(swaggerSpecs)
  );
};

export default router;
