import {
  fetchItems,
  fetchItemById,
  addItemByCollectionId,
  updateItemById,
  removeItemById
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
        if (item === null) {
      res.status(404).json({ msg: "Item not found" });
    }
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

export const patchItemById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const allowedFields = ["collection_id", "item_name", "icon"];
    const id = req.params.id;
    const propertyNames = allowedFields.filter(
      (field) => req.body[field] !== undefined,
    );
    const propertyValues = propertyNames.map((field) => req.body[field]);
    // If nothing to update, return 400
    const provided = allowedFields.some(
      (field) => req.body[field] !== undefined,
    );

    if (!provided) {
      return res.status(400).json({ msg: "No updatable fields provided" });
    }

    const item = await updateItemById(id, propertyNames, propertyValues);
    res.status(200).json({ item });
  } catch (error) {
    console.error("Error in patch /api/item/:id:", error);
    next(error);
  }
};

export const deleteItemById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id;
  try {
    const item = await removeItemById(id);
    if (!item) {
      res.status(404).json({ msg: "Item not found" });
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    console.error("Error in delete /api/item/:id:", error);
    next(error);
  }
};
