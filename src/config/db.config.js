import dotenv from "dotenv";

dotenv.config();

export const mongoURL = process.env.MONGO_URL;
export const mongoSECRET = process.env.MONGO_SECRET;
