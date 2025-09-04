import {
  fetchItems,
  fetchItemById,
  addItemByCollectionId,
} from "@/models/items.model";
import { Request, Response, NextFunction } from "express";

export const getItems = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let collectionId: number | null = null;
  const raw = req.query.collection_id;

  if (typeof raw === "string" && raw.trim() !== "") {
    collectionId = Number(raw);
    if (Number.isNaN(collectionId)) {
      return res.status(400).json({ error: "Invalid collection_id" });
    }
  }
  try {
    const items = await fetchItems(collectionId);
    res.status(200).json({ items });
  } catch (error) {
    console.error("Error in /api/items:", error);
    next(error);
  }
};

export const getItemById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id as string;
  try {
    const item = await fetchItemById(id);
    res.status(200).json({ item });
  } catch (error) {
    console.error("Error in /api/item:id", error);
    next(error);
  }
};

export const postItemByCollectionId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const item = await addItemByCollectionId(
      req.body,
      req.query.collection_id as string,
    );
    res.status(201).json({ item });
  } catch (error) {
    console.error("Error in post /api/item:", error);
    next(error);
  }
};
