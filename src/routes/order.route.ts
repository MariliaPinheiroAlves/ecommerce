import express from "express";

import { Request, Response } from "express";
import { Order } from '../models/order';
import {
  getAllOrdersByUserID,
  createNewOrder,
  deleteOrder,
} from "../controllers/order.controller";

export const orderRouter = express();

orderRouter
  .route("/get/:userId")
  .get((req: Request<{ userId: string }>, res: Response<any>) => getAllOrdersByUserID(req, res));
  
orderRouter
  .route("/delete/:orderId")
  .delete((req: Request<{ orderId: string }>, res: Response<any>) => deleteOrder(req, res));

orderRouter
  .route("/add")
  .post((req: Request<{}, {}, Order>, res: Response<any>) => createNewOrder(req, res));


