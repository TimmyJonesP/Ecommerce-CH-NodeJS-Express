import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT;
export const dev_env = process.env.DEV_ENV;
export const githubID = process.env.GB_ID;
export const githubSecret = process.env.GB_SCT;
export const githubURL = process.env.GB_URL;
export const private_key = process.env.PRIVATE_KEY;
export const super_user = process.env.SUPER_USER;
export const super_pass = process.env.SUPER_PASS;
