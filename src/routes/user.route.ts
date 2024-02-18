import express from "express";

import { Request, Response } from "express";
import {
  createToken,
  createUser,
  getUserByUsername,
  validateToken,
} from "../controllers/user.controller";

import { auth } from "../middlewares/auth.middleware";
export const userRouter = express();

userRouter
  .route("/signup")
  .post((req: Request, res: Response) => createUser(req, res));

userRouter
  .route("/login")
  .get((req: Request, res: Response) => validateToken(req, res));

userRouter.use(auth)

userRouter
  .route("/user/:username")
  .get((req: Request, res: Response) => getUserByUsername(req, res));

userRouter
  .route("/token")
  .post((req: Request, res: Response) => createToken(req, res));
