import { User } from "../validation/user.schema";

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; email?: string };
    }
  }
}

export {};
