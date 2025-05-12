import { Request, Response, NextFunction } from "express";
import { AppError } from "@/types";

export const notAPath = (_req: Request, res: Response) => {
  res.status(404).send({ msg: "path not found" });
};

export const customErrors = (
  err: AppError,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

export const sqlErrors = (
  err: AppError,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }
};

export const serverErrors = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err);
  res.status(500).send({ msg: "internal service error" });
};
