import cartDao from "../DAO/carts.dao.js";
import productsDao from "../DAO/products.dao.js";
import HTTPError from "../DAO/repository/errors.repository.js";
import TicketDao from "../DAO/tickets.dao.js";
import userDao from "../DAO/users.dao.js";
import logger from "../utils/logger.utils.js";
import { v4 as uuidv4 } from "uuid";

export const createCart = async (req, res, next) => {
  try {
    const newCart = await cartDao.createCart();
    logger.info("New cart created", newCart);
    const updatedUser = await userDao.updateUserWithCart(
      req.session.user._id,
      newCart._id
    );

    res.status(200).json({
      message: "Cart created and assigned to user.",
      cartId: newCart._id,
      user: updatedUser,
    });
  } catch (error) {
    logger.error("Error creating the Cart", error);
    res.status(500).json({ message: "An error occurred." });
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

    if (user.role === "premium" && productData.owner !== "premium") {
      return new ErrorRepository("You dont have permission", 401);
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
      res.status(404).send(`Doesn't exist cart: ${cid}`);
      return;
    }
    const array = cart.products;
    let index = array.findIndex((e) => e.product._id == pid);
    if (index == -1) {
      res.status(404).send(`Product id: ${pid} In cart: ${cid} doesn't exists`);
      return;
    }
    array = array.filter((item) => item.product._id != pid);
    cart.products = array;
    await cartDao.updateCart(cid, cart.products);
    logger.info(`Product Eliminated successfully`, cart);
    res
      .status(200)
      .send(`Product with code: ${pid} deleted successfully from cart ${cid}`);
  } catch (error) {
    console.log(error);
    logger.error("Error occurred deleting the product", error);
    next(error);
  }
};

export const updateProductQuantityInCart = async (req, res, next) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const newQuantity = req.body.quantity;

    const cart = await cartDao.getById(cid);
    if (!cart) {
      res.status(404).send(`No cart with ID: ${cid}`);
      return;
    }
    const productIndex = cart.products.findIndex(
      (item) => item._id.toString() === pid
    );

    if (productIndex === -1) {
      res.status(404).send(`Cant find product: ${pid} in the cart: ${cid}`);
      return;
    }

    cart.products[productIndex].quantity = newQuantity;

    await cartDao.updateCart(cart, cart.products);
    const updatedCart = await cartDao.getById(cart._id);

    logger.info(`Product quantity updated successfully`, updatedCart);
    res.status(200).send({
      message: `Quantity of product with code ${pid} updated successfully in cart ${cid}`,
      cart: updatedCart,
    });
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
    const userEmail = req.session.user.email;
    const code = uuidv4();

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
