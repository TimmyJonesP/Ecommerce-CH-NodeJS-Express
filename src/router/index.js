import productsController from "../controllers/products.controller.js";
import swaggerUiExpress from "swagger-ui-express";
import { swaggerSpecs } from "../utils/swagger.utils.js";
import cartController from "../controllers/carts.controller.js";
import loginController from "../controllers/login.controller.js";
import registerController from "../controllers/register.controller.js";
import usersController from "../controllers/users.controller.js";
import { errorHandler } from "../utils/errorHandler.utils.js";

const router = (app) => {
  app.use("/api/products", productsController);
  app.use("/api/carts", cartController);
  app.use(
    "/api/docs",
    swaggerUiExpress.serve,
    swaggerUiExpress.setup(swaggerSpecs)
  );
  app.use("/api/login", loginController);
  app.use("/api/register", registerController);
  app.use("/api/users", usersController);
  app.use(errorHandler);
};

export default router;
