import { fetchAllCollections, fetchCollectionById, addCollection } from "@/models/collections.model";
import { Request, Response, NextFunction } from "express";

export const getAllCollections = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const collections = await fetchAllCollections();
    res.status(200).json({ collections });
  } catch (error) {
    console.error("Error in /api/collections:", error);
    next(error);
  }
};

export const getCollectionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  try {
    const result = await fetchCollectionById(id);
    console.log("result", result);
    if (result === null) {
      console.log("result is null");
      res.status(404).json({ msg: "Collection not found" });
    }
    res.status(200).json({ task: result });
  } catch (error) {
    console.error("Error in /api/collection:id", error);
    next(error);
  }
};

export const postCollection = async (req: Request,
    res: Response,
    next: NextFunction) => {
  try {
    const task = await addCollection(req.body)
    res.status(201).json({ task });
  } catch (error) {
    console.error("Error in post /api/task:", error);
    next(error);
  }
}
