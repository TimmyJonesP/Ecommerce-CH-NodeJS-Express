import Cart from "../schemas/cart.schemas.js";

export default class CartRepository {
  getById = async (id) => {
    return await Cart.findById(id);
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

  updateCart = async (cart, updatedProducts) => {
    return await Cart.updateOne(
      { _id: cart._id },
      { $set: { products: updatedProducts } }
    );
  };

  emptyCart = async (id, cart) => {
    return await Cart.updateOne({ id: id }, { products: cart });
  };

  deleteCart = async (id) => {
    return await Cart.deleteOne({ id: id });
  };
}
