import { orderRouter } from "./order.route";

export function routes(app: any) {

    app.use("/order", orderRouter);
  
}

