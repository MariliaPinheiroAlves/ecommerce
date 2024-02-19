import express, { Response, Express } from "express";
import dotenv from "dotenv";
import { routes } from "./routes/routes";

dotenv.config();

const main = () => {
  const app: Express = express();
  const PORT = process.env.PORT;

  app.use(express.json());
  app.use("/images", express.static("./images"));
  
  app.listen(PORT, () =>
    console.log(`Server running at http://localhost:${PORT}/`)
  );

  app.get("/", (_, response: Response) => response.send({ version: "1.0.0" }));
  routes(app);
};

main();
