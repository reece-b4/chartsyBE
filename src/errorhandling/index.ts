import { Request, Response } from "express";

export const notAPath = (_req: Request, res: Response) => {
  res.status(404).send({ msg: "path not found" });
}