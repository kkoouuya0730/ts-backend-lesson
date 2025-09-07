import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { ZodError } from "zod";
import axios from "axios";

export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error(err);

  axios
    .post(process.env.SLACK_WEBHOOK_URL!, {
      text: `❌ Error: ${err.message}\nPath: ${req.path}\nStack: ${err.stack}`,
    })
    .catch(() => {});

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.statusCode,
        message: err.message,
        details: err.details ?? null,
      },
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: 400,
        message: "Validation Error",
        details: err.issues.map((issue) => ({
          path: issue.path,
          message: issue.message,
        })),
      },
    });
  }

  const message = err.message || "Internal Server Error";

  res.status(500).json({ error: { code: 500, message } });
};
