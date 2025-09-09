import { Router } from "express";
import { registerUserHandler } from "../controllers/auth/auth.controller";

const router = Router();
router.post("/register", registerUserHandler);
export default router;
