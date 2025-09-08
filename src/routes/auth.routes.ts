import { Router } from "express";
import { createUserHandler } from "../controllers/auth/auth.controller";

const router = Router();
router.post("/register", createUserHandler);
export default router;
