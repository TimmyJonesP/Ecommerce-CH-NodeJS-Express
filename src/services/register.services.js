import logger from "../utils/logger.utils.js";

export const register = async (req, res) => {
  try {
    const newUser = req.user;

    logger.info("New user!", newUser);
    res.status(201).json({ status: "success", message: newUser });
  } catch (error) {
    logger.error("Error Creating user", error);
    next(error);
  }
};

export const getRegister = async (req, res, next) => {
  try {
    res.render("register.handlebars");
  } catch (error) {
    logger.error("Error Loading Register page", error);
    next(error);
  }
};

export const failRegister = async (req, res) => {
  logger.error("Failed Register Strategy");
  res.json({ error: "Failed Register" });
};

export const redirect = async (req, res) => {
  res.redirect("/api/register");
};
