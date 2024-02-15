import express, { Response } from "express";
import dotenv from "dotenv";
import { routes } from "./routes/routes";

dotenv.config();

const main = () => {
  const app = express();
  app.use(express.json())
  routes(app)
  const PORT = process.env.PORT;

  app.listen(PORT, () =>
    console.log(`Server running at http://localhost:${PORT}/`)
  );

  app.get("/", (_, response: Response) => response.send({ version: "1.0.0" }));
};

main();
