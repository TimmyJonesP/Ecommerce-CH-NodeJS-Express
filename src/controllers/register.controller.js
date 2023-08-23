import { Router } from "express";
import passport from "passport";
import {
  failRegister,
  getRegister,
  register,
} from "../services/register.services.js";

const router = Router();

router.post(
  "/",
  passport.authenticate("register", {
    failureRedirect: "register/fail-register",
  }),
  register
);

router.get("/", getRegister);

router.get("/fail-register", failRegister);

router.get("/redirect");

export default router;
