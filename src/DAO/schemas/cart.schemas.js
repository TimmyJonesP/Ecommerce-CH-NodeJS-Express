import mongoose from "mongoose";

const collectionName = "carts";

const collectionSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});

const Cart = mongoose.model(collectionName, collectionSchema);

export default Cart;
