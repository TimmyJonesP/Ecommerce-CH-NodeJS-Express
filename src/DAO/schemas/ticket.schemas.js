import mongoose from "mongoose";

const collectionName = "tickets";

const collectionSchema = mongoose.Schema({
  code: String,
  purchase_datetime: {
    type: Date,
    default: Date.now,
  },
  amount: Number,
  purchaser: String,
  products: [],
});

const Tickets = mongoose.model(collectionName, collectionSchema);

export default Tickets;
