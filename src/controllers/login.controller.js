import { Router } from "express";
import passport from "passport";
import {
  failLogin,
  getEmail,
  getForgot,
  getLogin,
  gitHubCallBack,
  github,
  localLogin,
  logOut,
  resetPassword,
  sendToken,
} from "../services/login.services.js";

const router = Router();

//Pantalla de inicio
router.get("/", getLogin);

//pantalla de Recuperacion de contraseña
router.get("/forgot-password", getForgot);

//Captura de Email
router.get("/forgot-password/:email", getEmail);

//Envío de token
router.post("/forgot-password", sendToken);

//Reseteo de contraseña
router.post("/reset-password/:email", resetPassword);

router.post("/", localLogin);

router.get("/logout", logOut);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user: email"] }),
  github
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "login/fail-login" }),
  gitHubCallBack
);

router.get("/fail-login", failLogin);

export default router;
