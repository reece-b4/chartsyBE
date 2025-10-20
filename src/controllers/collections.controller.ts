import {
  fetchAllCollections,
  fetchCollectionById,
  addCollection,
  updateCollectionById,
  removeCollectionById,
  replaceCollectionById,
} from "@/models/collections.model";
import { Request, Response, NextFunction } from "express";

export const getAllCollections = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const collections = await fetchAllCollections();
    return res.status(200).json({ collections });
  } catch (error) {
    console.error("Error in /api/collections:", error);
    return next(error);
  }
};

export const getCollectionById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id;
  try {
    const result = await fetchCollectionById(id);
    if (result === null) {
      return res.status(404).json({ msg: "Collection not found" });
    }
    return res.status(200).json({ collection: result });
  } catch (error) {
    console.error("Error in /api/collection:id", error);
    return next(error);
  }
};

export const postCollection = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const collection = await addCollection(req.body);
    return res.status(201).json({ collection });
  } catch (error) {
    console.error("Error in post /api/collection:", error);
    next(error);
  }
};

export const patchCollectionById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const allowedFields = ["collection_name", "icon"];
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

    const collection = await updateCollectionById(
      id,
      propertyNames,
      propertyValues,
    );
    return res.status(200).json({ collection });
  } catch (error) {
    console.error("Error in patch /api/collection/:id:", error);
    next(error);
  }
};

export const deleteCollectionById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id;
  try {
    const collection = await removeCollectionById(id);
    if (!collection) {
      return res.status(404).json({ msg: "Collection not found" });
    } else {
      return res.sendStatus(204);
    }
  } catch (error) {
    console.error("Error in delete /api/collection/:id:", error);
    next(error);
  }
};

export const putCollectionById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // require all mutable fields to be present
  // do not allow for non whitelisted fields to be present even if they are ignored
  // 404 when id not found
  // id and created at not mutable
  //  will return body as will want to test new resource

  try {
    const allowedFields = ["collection_name", "icon"];
    const id = req.params.id;
    const propertyNames = allowedFields.filter(
      (field) => req.body[field] !== undefined,
    );
    const propertyValues = propertyNames.map((field) => req.body[field]);
    // If nothing to update, return 400
    const provided = allowedFields.every(
      (field) => req.body[field] !== undefined,
    );

    if (!provided) {
      return res.status(400).json({ msg: "All fields must be provided" });
    }

    const nonAllowed = Object.keys(req.body).some(
      (field) => !allowedFields.includes(field),
    );

    if (nonAllowed) {
      return res
        .status(400)
        .json({ msg: "Only allowed fields must be present" });
    }

    const collection = await replaceCollectionById(
      id,
      propertyNames,
      propertyValues,
    );

    if (!collection) {
      return res.status(404).json({ msg: "Collection not found" });
    }

    res.status(200).json({ collection });
  } catch (error) {
    console.error("Error in put /api/collection/:id:", error);
    next(error);
  }
};
