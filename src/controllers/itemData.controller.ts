import { fetchItemData, fetchItemDataById, addItemDataByItemId } from "@/models/itemData.model";
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
  const itemId = Number(req.params.item_id);
  if (Number.isNaN(itemId)) {
    return res.status(400).json({ error: "Invalid item_id" });
  }
  try {
    const item_data = await fetchItemDataById(itemId);
    if (item_data.length === 0) {
      return res.status(404).json({ msg: "Item data not found" });
    }
    res.status(200).json({ item_data });
  } catch (error) {
    console.error("Error in /api/item_data/:item_id", error);
    next(error);
  }
};

export const postItemDataByItemId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Placeholder for adding item data logic
    const item_data = await addItemDataByItemId(req.body, req.query.item_id as string);
    res.status(201).json({ item_data });
    res.status(201).json({ msg: "POST /api/item_data endpoint hit" });
  } catch (error) {
    console.error("Error in post /api/item_data:", error);
    next(error);
  }
};