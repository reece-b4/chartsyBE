import type { ErrorRequestHandler, Request, Response } from "express";

// typed helper for app-defined errors
export class HttpError extends Error {
  status: number;
  msg: string;
  constructor(status: number, msg: string) {
    super(msg);
    this.status = status;
    this.msg = msg;
  }
}

export const customErrors: ErrorRequestHandler = (err, _req, res, next) => {

  if (err instanceof HttpError) {
    return res.status(err.status).json({ msg: err.msg });
  }

  return next(err);
};

export const sqlErrors: ErrorRequestHandler = (err: any, _req, res, next) => {
  switch (err?.code) {
    case "22P02": 
      return res.status(400).json({ msg: "Invalid input syntax" });
    case "23503":
      return res.status(400).json({ msg: "Foreign key violation" });
    case "23505":
      return res.status(409).json({ msg: "Duplicate key" });
    default:
      return next(err);
  }
};

/** Final catch-all (log once, respond once) */
export const serverErrors: ErrorRequestHandler = (err, req, res, _next) => {
  if (res.headersSent) {
    // nothing else to do safely. and cannot send another header
    return;
  }

  // Centralized logging—do it ONCE here
  // Use your logger instead of console in real code
  console.error("Unhandled error:", {
    method: req.method,
    path: req.originalUrl,
    message: (err as any)?.message,
    stack: (err as any)?.stack,
  });

  return res.status(500).json({ msg: "Internal service error" });
};

export const notFound = (_req: Request, res: Response) => {
  return res.status(404).json({ msg: "path not found" });
};