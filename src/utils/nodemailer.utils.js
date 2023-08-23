import nodemailer from "nodemailer";
import { nodemailer_pass, nodemailer_user } from "../config/mailer.config.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: nodemailer_user,
    pass: nodemailer_pass,
  },
});

export default transporter;
