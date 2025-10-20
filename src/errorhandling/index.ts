import { Request, Response, NextFunction } from "express";
import { AppError } from "chartsy-types";

export const notFound = (_req: Request, res: Response) => {
  return res.status(404).send({ msg: "path not found" });
};

export const customErrors = (
  err: AppError,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.status) {
    return res.status(err.status).json({ msg: err.msg });
  } else {
    return next(err);
  }
};

export const sqlErrors = (
  err: AppError,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
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

export const serverErrors = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
    if (res.headersSent) {
    // nothing else to do safely. and cannot send another header
    return;
  }
  console.error(err);
  return res.status(500).json({ msg: "internal service error" });
};
