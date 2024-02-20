import express, { Response, Express } from "express"
import cors from "cors"

import { CustomCors } from "./middlewares/customCors"
import { routes } from "./routes/routes"

import dotenv from "dotenv"

dotenv.config()

const main = () => {
    const app: Express = express()
    const PORT = process.env.PORT

    app.use(express.json())
    app.use(cors())
    app.use(CustomCors)
    app.use("/images", express.static("./images"))

    app.listen(PORT, () =>
        console.log(`Server running at http://localhost:${PORT}/`)
    )

    app.get("/", (_, response: Response) => response.send({ version: "1.0.0" }))
    routes(app)
}

main()
