import { Router } from "express";
import {
  deleteMeHandler,
  deleteUserHandler,
  getMeHandler,
  getUserHandler,
  getUsersHandler,
  updateMeHandler,
  updateUserHandler,
} from "../controllers/user/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// 認証不要
router.get("/", getUsersHandler);
router.get("/:id", getUserHandler);

// 認証必須(自分専用)
router.get("/me", authMiddleware, getMeHandler);
router.put("/me", authMiddleware, updateMeHandler);
router.delete("/me", authMiddleware, deleteMeHandler);

// 任意のユーザー操作（管理者用など）
router.put("/:id", updateUserHandler);
router.delete("/:id", deleteUserHandler);
export default router;
