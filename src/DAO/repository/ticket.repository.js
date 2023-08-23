import Tickets from "../schemas/ticket.schemas.js";
import HTTPError from "./errors.repository.js";
import logger from "../../utils/logger.utils.js";
import cartDao from "../carts.dao.js";
import productsDao from "../products.dao.js";

class TicketRepository {
  async processDataTicket(code, userEmail, cart) {
    try {
      const processedProducts = [];
      const unprocessedProducts = [];
      let totalAmount = 0;

      for (let i = 0; i < cart.products.length; i++) {
        const item = cart.products[i];

        const product = await this.processItem(
          item,
          processedProducts,
          unprocessedProducts
        );
        if (product) {
          const productQuantity = item.quantity;
          const productTotalPrice = product.price * productQuantity;
          totalAmount += productTotalPrice;
        } else {
          throw new HTTPError("Cannot find any products", 404);
        }
      }
      cart.products = cart.products.filter(
        (item) =>
          !processedProducts.some(
            (processedItem) =>
              processedItem._id.toString() === item.product._id.toString()
          )
      );
      await cartDao.updateCart(cart);

      const ticket = await Tickets.create({
        code: code,
        purchase_datetime: new Date(),
        amount: totalAmount,
        purchaser: userEmail,
        products: processedProducts,
      });

      logger.info("Ticket with processed items", ticket);

      return {
        ticket: ticket,
        unprocessedProducts: unprocessedProducts,
      };
    } catch (error) {
      logger.error("Error processing purchase", error);
      throw new HTTPError("Error processing your purchase", 500);
    }
  }
  async processItem(item, processedProducts, unprocessedProducts) {
    const pid = item.product._id;
    const productQuantity = item.quantity;

    try {
      const product = await productsDao.getById(pid);

      if (productQuantity <= product.stock) {
        product.stock -= productQuantity;
        await productsDao.updateById(pid, product);
        processedProducts.push(product);
        return product;
      } else {
        unprocessedProducts.push(product);
      }
    } catch (error) {
      logger.error("Error processing the products", error);
      throw new HTTPError("Error processing the products", 500);
    }
  }
}

export default TicketRepository;
