import HTTPError from "../DAO/repository/errors.repository.js";
import PasswordRepository from "../DAO/repository/password.repository.js";
import userDao from "../DAO/users.dao.js";
import logger from "../utils/logger.utils.js";

export const getLogin = async (req, res, next) => {
  try {
    res.render("login");
  } catch (error) {
    next(error);
  }
};

export const getForgot = async (req, res, next) => {
  try {
    res.render("forgotPassword.handlebars");
  } catch (error) {
    next(error);
  }
};

export const getEmail = async (req, res, next) => {
  try {
    const email = req.params.email;

    res.render("resetPassword.handlebars", { email });
  } catch (error) {
    next(error);
  }
};

export const sendToken = async (req, res, next) => {
  try {
    const email = req.body.email;

    const session = await userDao.findByEmail({ email: email });

    if (!session) {
      throw new HTTPError("No user finded. Try a new email.", 404);
    }
    const reset = new PasswordRepository();
    const createToken = await reset.createToken(email, res);

    res.json({ message: "Token sent", token: createToken });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  const newPassword = req.body.newPassword;
  const token = req.cookies.resetToken;
  const email = req.params.email;

  try {
    const reset = new PasswordRepository();
    await reset.resetPassword(newPassword, token, email);

    res.status(200).json({ message: "Password restored!" });
  } catch (error) {
    logger.error("Error", error);
  }
};
export const localLogin = async (req, res) => {
  try {
    if (!req.user) {
      throw new HTTPError("Incorrect user or password", 404);
    }

    req.session.user = req.user;

    const now = new Date();
    await userDao.findByIdAndUpdate(req.session.user._id, {
      last_connection: now,
    });
    req.session.save();
    logger.info("Session initialized", req.session.user);
    res.status(200).json({ status: "success", message: "session established" });
  } catch (error) {
    console.log(error);
    logger.error("Error occurred while login", error);
    next(error);
  }
};

export const logOut = async (req, res, next) => {
  try {
    const now = new Date();
    await userDao.findByIdAndUpdate(req.user._id, { last_connection: now });

    req.session.destroy((error) => {
      if (error) {
        logger.error("Error at Logout", error);
        return next(error);
      }
      res.redirect("/api/login");
    });
  } catch (error) {
    logger.error("Error at Logout (CATCH)", error);
    console.log(error);
  }
};

export const github = async (req, res) => {};

export const gitHubCallBack = async (req, res) => {
  try {
    const now = new Date();
    await userDao.findByIdAndUpdate(req.user._id, { last_connection: now });

    req.session.user = req.user;
    req.session.save();
    res.redirect("/api/products");
  } catch (error) {
    logger.error("Error at GithubCallBack", error);
    console.log(error);
  }
};

export const failLogin = async (req, res, next) => {
  logger.error("Error Logging, please verify your credentials");
  throw new HTTPError("Error Logging, please verify your credentials", 500);
};
