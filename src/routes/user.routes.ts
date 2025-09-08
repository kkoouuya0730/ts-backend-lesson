import { Router } from "express";
import {
  deleteUserHandler,
  getUserHandler,
  getUsersHandler,
  updateUserHandler,
} from "../controllers/user/user.controller";

const router = Router();
router.get("/", getUsersHandler);
router.get("/:id", getUserHandler);
router.put("/:id", updateUserHandler);
router.delete("/:id", deleteUserHandler);
export default router;
