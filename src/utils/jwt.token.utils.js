import jwt from "jsonwebtoken";
import { private_key } from "../config/main.config.js";

export const generateToken = (email) => {
  const token = jwt.sign({ email }, private_key, { expiresIn: "24h " });
  return token;
};

export const verifyToken = (token) => {
  const verifiedToken = jwt.verify(token, private_key);
  return verifiedToken;
};
