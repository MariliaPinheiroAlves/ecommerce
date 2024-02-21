import express from "express";

import { Request, Response } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProduct,
  updateProduct,
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
  .get((req: Request, res: Response) => getProductById(req, res))
  .put((req: Request, res: Response) => updateProduct(req, res))
  .delete((req: Request, res: Response) => deleteProduct(req, res));
