export class AppError extends Error {
  constructor(public statusCode: number, public message: string, public details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.details = details;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
