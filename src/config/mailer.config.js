import dotenv from "dotenv";

dotenv.config();

export const nodemailer_user = process.env.MAILER_USER;
export const nodemailer_pass = process.env.MAILER_PASS;
