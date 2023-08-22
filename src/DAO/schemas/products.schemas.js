import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collectionName = "products";

const collectionSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  stock: Number,
  code: String,
  category: String,
  status: {
    type: Boolean,
    default: true,
  },
  thumbnail: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/8676/8676496.png",
  },
  owner: {
    type: String,
    default: "admin",
  },
});

collectionSchema.plugin(mongoosePaginate);

const Products = mongoose.model(collectionName, collectionSchema);

export default Products;
