import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT;
export const dev_env = process.env.DEV_ENV || "development";
