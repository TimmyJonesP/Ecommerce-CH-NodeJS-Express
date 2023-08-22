import mongoose from "mongoose";
import { mongoURL } from "../src/config/db.config.js";

const mongoConnect = async () => {
  try {
    await mongoose.connect(mongoURL);
    console.log("Mongoose is successfully connected!");
  } catch (error) {
    console.log(error);
  }
};

export default mongoConnect;
