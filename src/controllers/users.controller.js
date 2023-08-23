import Router from "express";
import { adminAccess } from "../middlewares/Access.middleware.js";
import {
  changeRole,
  deleteById,
  deleteByTime,
  getUsers,
} from "../services/users.services.js";

const router = Router();

router.get("/", getUsers);

router.put("/change-role/:uid", adminAccess, changeRole);

router.delete("/deleteUser/:uid", adminAccess, deleteById);

router.delete("/", deleteByTime);

export default router;
