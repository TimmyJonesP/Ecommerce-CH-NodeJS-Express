import { Router } from "express";
import {
  getAllProducts,
  getOneProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  createMockingProducts,
} from "../services/products.services.js";
import {
  adminAccess,
  privateAccess,
  userAccess,
} from "../middlewares/Access.middleware.js";

const router = Router();

router.get("/", privateAccess, getAllProducts);

// GET /:pid - devuelve un producto especifico
router.get("/:pid", privateAccess, getOneProduct);

// POST / - agrega un producto
router.post("/", adminAccess, addProduct);

// PUT /:pid - actualiza un producto
router.put("/:pid", adminAccess, updateProduct);

// DELETE /:pid - elimina un producto
router.delete("/:pid", adminAccess, deleteProduct);

// POST /mockingproducts - agrega productos ficticios a la DB
router.post("/mockingproducts", userAccess, createMockingProducts);

export default router;
