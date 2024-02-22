import express from "express";

import { Request, Response } from "express";
import {
  createToken,
  createUser,
  getAll,
  getUserByUsername,
  validateToken,
} from "../controllers/user.controller";

export const userRouter = express();

userRouter
  .route("/users")
  .get((req: Request, res: Response) => getAll(req, res));

userRouter
  .route("/signup")
  .post((req: Request, res: Response) => createUser(req, res));

userRouter
  .route("/login")
  .get((req: Request, res: Response) => validateToken(req, res));

userRouter
  .route("/token")
  .post((req: Request, res: Response) => createToken(req, res));

userRouter
  .route("/user/:username")
  .get((req: Request, res: Response) => getUserByUsername(req, res));
