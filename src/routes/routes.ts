import { orderRouter } from "./order.route";
import { userRouter } from "./user.route";

import { Express } from "express";

export function routes(app: Express) {
  app.use("/order", orderRouter);
  app.use("/", userRouter);
}
