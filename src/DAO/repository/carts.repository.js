import Cart from "../schemas/cart.schemas.js";

export default class CartRepository {
  getById = async (id) => {
    return await Cart.findOne({ _id: id }).populate("products.product");
  };

  createCart = async () => {
    return await Cart.create({ products: [] });
  };

  addOne = async (id, product) => {
    return await Cart.updateOne(
      { id: cartId },
      { $push: { products: product } }
    );
  };

  updateCart = async (id, cart) => {
    return await Cart.updateOne({ id: id }, { products: cart });
  };

  emptyCart = async (id, cart) => {
    return await Cart.updateOne({ id: id }, { products: cart });
  };

  deleteCart = async (id) => {
    return await Cart.deleteOne({ id: id });
  };
}
