import express from "express";
import cors from "cors";
import { notAPath } from "@/errorhandling/index";
import { customErrors, sqlErrors, serverErrors } from "@/errorhandling/index";
import {
  getAllCollections,
  getCollectionById,
  postCollection,
  patchCollectionById,
  deleteCollectionById,
  putCollectionById
} from "@/controllers/collections.controller";
import {
  getItems,
  getItemById,
  postItemByCollectionId,
  patchItemById,
  deleteItemById
} from "@/controllers/items.controller";
import { getItemData, 
  getItemDataById, postItemDataByItemId, patchItemDataById,
deleteItemDataById } from "@/controllers/itemData.controller";

const allowlist = [
  "http://localhost:5173",
  "https://dck7gx4ukouvd.cloudfront.net",
];

export const app = express();
app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true); // allow curl/Postman
      cb(null, allowlist.includes(origin));
    },
    credentials: true,
  }),
);
// TODO: look into preflight: Ensure preflight works for every route
app.options("*", cors());
app.use(express.json());

app.get("/api", (_req, res) => {
  res.status(200).json({ msg: "get request received, 200 OK" });
});

// collection routes
app.get("/api/collections", getAllCollections);
app.get("/api/collection/:id", getCollectionById);
app.post("/api/collection", postCollection);
app.patch("/api/collection/:id", patchCollectionById);
app.delete("/api/collection/:id", deleteCollectionById);
app.put("/api/collection/:id", putCollectionById);

// item routes
// getItemsByCollectionId covered in getItems
app.get("/api/items", getItems);
app.get("/api/item/:id", getItemById);
app.post("/api/item", postItemByCollectionId);
app.patch("/api/item/:id", patchItemById);
app.delete("/api/item/:id", deleteItemById);

// item_data routes
// getItemDataByItemId covered in getItemData
app.get("/api/item_data", getItemData);
app.get("/api/item_data/:id",  getItemDataById);
app.post("/api/item_data", postItemDataByItemId);
app.patch("/api/item_data/:id", patchItemDataById);
app.delete("/api/item_data/:id", deleteItemDataById);

// must be after routes as middleware executes in defined order
app.all("/api/*", notAPath);
app.use(customErrors);
app.use(sqlErrors);
app.use(serverErrors);

// cors error handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    const origin = allowlist.includes(req.headers.origin as string)
      ? req.headers.origin
      : "";
    res.set("Access-Control-Allow-Origin", origin);
    res.set("Access-Control-Allow-Credentials", "true");
    res.status(err.status || 500).json({ error: err.message || "Internal" });
  },
);
