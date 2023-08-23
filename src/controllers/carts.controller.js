import { Router } from "express";
import { userAccess } from "../middlewares/Access.middleware.js";
import {
  addProductToCart,
  buyCart,
  createCart,
  deleteProductFromCart,
  emptyCart,
  getById,
  updateProductQuantityInCart,
} from "../services/carts.services.js";

const router = Router();

// POST / - crea un carrito nuevo
router.post("/", userAccess, createCart);

// GET /:cid - muestra un carrito especifico
router.get("/:cid", userAccess, getById);

// DELETE /:cid - vacia por completo un carrito
router.delete("/:cid", userAccess, emptyCart);

// POST /:cid/product/:pid - agrega un producto a un determinado carrito
router.post("/:cid/products/:pid", userAccess, addProductToCart);

// DELETE /:cid/products/:pid -  elimina un producto determinado de un carrito
router.delete("/:cid/products/:pid", userAccess, deleteProductFromCart);

// PUT /:cid/products/:pid - actualiza la cantidad de un producto dentro de un carrito
router.put("/:cid/products/:pid", userAccess, updateProductQuantityInCart);

// GET /:cid/purchase - Finaliza la compra del carrito
router.get("/:cid/purchase", userAccess, buyCart);

export default router;
