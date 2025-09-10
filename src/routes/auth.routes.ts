import { Router } from "express";
import { loginUserHandler, registerUserHandler } from "../controllers/auth/auth.controller";

const router = Router();
router.post("/register", registerUserHandler);
router.post("/login", loginUserHandler);
export default router;
