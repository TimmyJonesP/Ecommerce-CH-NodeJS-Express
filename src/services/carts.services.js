import cartDao from "../DAO/carts.dao.js";
import productsDao from "../DAO/products.dao.js";
import HTTPError from "../DAO/repository/errors.repository.js";
import TicketDao from "../DAO/tickets.dao.js";
import logger from "../utils/logger.utils.js";
import uuid from "uuid";

export const createCart = async (req, res, next) => {
  try {
    const newCart = await cartDao.createCart({});
    logger.info("New cart created", newCart);
    res.status(200).json(newCart);
  } catch (error) {
    logger.error("Error creating the Cart");
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const cid = req.params.cid;
    const data = await cartDao.getById(cid);

    if (!data) {
      res.status(404).send(`There is no cart ${cid}`);
      return;
    }
    logger.info(`Showed cart id: ${cid}`);
    res.status(200).json(data);
  } catch (error) {
    logger.error(`Error during loading cart`, error);
    console.log(error);
    next(new HTTPError(`Error showing cart`, 400));
  }
};

export const addProductToCart = async (req, res, next) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const cartData = await cartDao.getById(cid);
    const productData = await productsDao.getById(pid);
    const user = req.session.user;

    if (user.role === "premium" && product.owner !== "premium") {
      return new ErrorRepository(
        "No tienes permiso para agregar este producto",
        401
      );
    }

    await cartDao.updateCart(cartData, productData);

    logger.info("Successfully agregated");
    res.status(200).json("Product added successfully");
  } catch (error) {
    logger.error("Error while adding the product", error);
    next(error);
  }
};

export const deleteProductFromCart = async (req, res, next) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const cart = await cartDao.getById(cid);
    if (!cart) {
      res.status(404).send(`No existe el carrito con id ${cid}`);
      return;
    }
    const array = cart.products;
    let index = array.findIndex((e) => e.product._id == pid);
    if (index == -1) {
      res
        .status(404)
        .send(
          `No existe el producto de codigo ${pid} en el carrito de id ${cid}`
        );
      return;
    }
    array = array.filter((item) => item.product._id != pid);
    cart.products = array;
    await cartDao.updateCart(cid, cart.products);
    logger.info(`Product Eliminated successfully`, cart);
    res
      .status(200)
      .send(
        `Product with code: ${pid} eliminated successfully from cart ${cid}`
      );
  } catch (error) {
    console.log(error);
    logger.error("Error occurred eliminating the product", error);
    next(error);
  }
};

export const updateProductQuantityInCart = async (req, res, next) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const newQuantity = req.body.quantity; // Se espera que el cuerpo de la solicitud contenga la nueva cantidad

    const cart = await cartDao.getById(cid);
    if (!cart) {
      res.status(404).send(`No existe el carrito con id ${cid}`);
      return;
    }

    const productIndex = cart.products.findIndex(
      (item) => item.product._id.toString() === pid
    );

    if (productIndex === -1) {
      res
        .status(404)
        .send(
          `No existe el producto de codigo ${pid} en el carrito de id ${cid}`
        );
      return;
    }

    cart.products[productIndex].quantity = newQuantity;

    await cartDao.updateCart(cart);

    logger.info(`Product quantity updated successfully`, cart);
    res
      .status(200)
      .send(
        `Quantity of product with code ${pid} updated successfully in cart ${cid}`,
        cart
      );
  } catch (error) {
    logger.error("Error occurred updating product quantity", error);
    next(error);
  }
};

export const emptyCart = async (req, res, next) => {
  try {
    const cid = req.params.cid;
    const cart = await cartDao.getById(cid);
    cart.products = [];
    await cartDao.emptyCart(cid, cart.products);
    logger.info(`Products of cart ${cid} are now empty`, cart);
    res
      .status(200)
      .json({ message: `Products of cart ${cid} are now empty`, cart });
  } catch (error) {
    logger.error(
      `Error occurred while eliminating the products from the cart`,
      error
    );
    next(error);
  }
};

export const buyCart = async (req, res, next) => {
  try {
    const cid = req.params.cid;
    const cart = await cartDao.getById(cid);
    const userEmail = req.user.email;
    const code = uuid.v4();

    const purchaseData = await TicketDao.processDataTicket(
      code,
      userEmail,
      cart
    );

    const ticket = (await purchaseData).ticket;
    const unprocessedProducts = (await purchaseData).unprocessedProducts;

    if (unprocessedProducts.length > 0) {
      res.json({
        message: `Products without stock= ${unprocessedProducts}, here's your Purchase: ${ticket}`,
        unprocessedProducts,
        ticket,
      });
    } else {
      res.json({
        message: `Thank you for trusting, here's your ticket.`,
        ticket,
      });
    }
  } catch (error) {
    logger.error(
      "Error processing your buy. Check the data you are sending us",
      error
    );
    next(error);
  }
};
