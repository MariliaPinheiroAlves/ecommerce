import express from "express";

import { Request, Response } from "express";
import {
  getAllProducts,
  createProduct,
  deleteProduct,
} from "../controllers/product.controller";
import { uploadImage } from "../utils/multer";

export const productRouter = express();

productRouter
  .route("/products")
  .get((req: Request, res: Response) => getAllProducts(req, res));

productRouter
  .route("/product")
  .post(uploadImage, (req: Request, res: Response) => createProduct(req, res));

productRouter
  .route("/product/:id")
  .delete((req: Request, res: Response) => deleteProduct(req, res));
