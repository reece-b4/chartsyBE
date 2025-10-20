import { fetchItemData, fetchItemDataById, addItemDataByItemId, updateItemDataById, removeItemDataById } from "@/models/itemData.model";
import { Request, Response, NextFunction } from "express";

export const getItemData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let itemId: number | null = null;
  const raw = req.query.item_id;
  if (typeof raw === "string" && raw.trim() !== "") {
      itemId = Number(raw);
      if (Number.isNaN(itemId)) {
          return res.status(400).json({ error: "Invalid item_id" });
        }
    }
    try {
    const item_data = await fetchItemData(itemId);
    if (itemId) {
    }
    res.status(200).json({ item_data });
  } catch (error) {
    console.error("Error in /api/item_data:", error);
    next(error);
  }
};

export const getItemDataById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const Id = Number(req.params.id);
  if (Number.isNaN(Id)) {
    return res.status(400).json({ error: "Invalid id" });
  }
  try {
    const item_data = await fetchItemDataById(Id);
    if (item_data === null) {
      return res.status(404).json({ msg: "Item data not found" });
    }
    res.status(200).json({ item_data });
  } catch (error) {
    console.error("Error in /api/item_data/:id", error);
    next(error);
  }
};

export const postItemDataByItemId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item_data = await addItemDataByItemId(req.body, req.query.item_id as string);
    res.status(201).json({ item_data });
  } catch (error) {
    console.error("Error in post /api/item_data:", error);
    next(error);
  }
};


export const patchItemDataById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const allowedFields = ["item_id", "data_type", "data_body"];
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
    const itemData = await updateItemDataById(id, propertyNames, propertyValues);
    res.status(200).json({ item_data: itemData });
  } catch (error) {
    console.error("Error in patch /api/item_data/:id", error);
    next(error);
  }
};

export const deleteItemDataById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id;
  try {
    const itemData = await removeItemDataById(id);
    if (!itemData) {
      res.status(404).json({ msg: "Item data not found" });
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    console.error("Error in delete /api/item_data/:id", error);
    next(error);
  }
};