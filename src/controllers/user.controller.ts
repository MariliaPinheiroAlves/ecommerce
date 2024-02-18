import { Request, Response } from "express";
import { pool } from "../config/connection";

import { v4 as uuid } from "uuid";
import { decryptPassword, encryptedPassword } from "../utils/encryption";

import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { QueryResult } from "pg";
import type { User } from "../models/user.model";

dotenv.config();

const SECRET: string = process.env.SECRET as string;

const securityFieldsUser = (response: QueryResult<User>): User => {
  const user: User = {
    user_id: response.rows[0].user_id,
    username: response.rows[0].username,
    name: response.rows[0].name,
    email: response.rows[0].email,
  };

  return user;
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, username, name, password } = req.body as {
      email: string;
      username: string;
      name: string;
      password: string;
    };

    if (!(email && username && password))
      throw new Error(
        "Os campos de email, nome de usuário e senha são obrigatórios."
      );

    const query: string =
      "INSERT INTO user_account (user_id, email, username, name, password) VALUES ($1, $2, $3, $4, $5) RETURNING *";

    const passwordHash: string = await encryptedPassword(password);
    const id: string = uuid();

    // verificar se o user ja existe com esse email
    const emailExists: QueryResult<User> = await pool.query(
      "SELECT * FROM user_account ua WHERE ua.email = $1;",
      [email]
    );

    if (!!emailExists.rowCount)
      throw new Error("Esse email já está sendo utilizado por uma conta.");

    // verificar se o user ja existe com esse username
    const usernameExists: QueryResult<User> = await pool.query(
      "SELECT * FROM user_account ua WHERE ua.username = $1;",
      [username]
    );

    if (!!usernameExists.rowCount)
      throw new Error("Esse username já está sendo utilizado por uma conta.");

    const response: QueryResult<User> = await pool.query(query, [
      id,
      email,
      username,
      name,
      passwordHash,
    ]);

    const user: User = securityFieldsUser(response);

    res.status(201).json({ ...user });
  } catch (error: any) {
    return res.status(500).json({ mensagem: error.message });
  }
};

export const getUserByUsername = async (req: Request, res: Response) => {
  try {
    const { username } = req.params as { username: string };

    const query: string =
      "SELECT * FROM user_account ua WHERE ua.username = $1;";
    const response: QueryResult<User> = await pool.query(query, [username]);

    if (!!!response.rowCount) throw new Error("Usuário não encontrado!");

    const user: User = securityFieldsUser(response);

    res.status(201).json({ ...user });
  } catch (error: any) {
    return res.status(500).json({ mensagem: error.message });
  }
};

export const validateToken = async (req: Request, res: Response) => {
  try {
    const token: string = req.headers.authorization!;

    const decoded: JwtPayload | string = jwt.verify(token, SECRET!);

    const query: string = "SELECT * FROM user_account ua WHERE ua.email = $1;";
    const response: QueryResult<User> = await pool.query(query, [
      (decoded as JwtPayload).email,
    ]);

    if (!!!response.rowCount) throw new Error("Usuário não encontrado!");

    const user: User = securityFieldsUser(response);

    res.status(200).json({ ...user });
  } catch (error: any) {
    return res.status(500).json({ mensagem: error.message });
  }
};

export const createToken = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const query: string = "SELECT * FROM user_account ua WHERE ua.email = $1;";
    const response: QueryResult<User> = await pool.query(query, [email]);

    if (!!!response.rowCount) throw new Error("Usuário não encontrado!");

    const userPassword: string = response.rows[0].password!;

    const validatedPassword: boolean = await decryptPassword(
      password,
      userPassword
    );

    if (!validatedPassword)
      throw new Error("A senha ou login estão incorretos. Tente novamente.");

    const token: string = jwt.sign(
      {
        email: email.toLocaleLowerCase(),
        username: response.rows[0].username,
        user_id: response.rows[0].user_id,
      },
      SECRET!,
      {
        expiresIn: "4h",
      }
    );

    res.status(200).json({ token });
  } catch (error: any) {
    return res.status(500).json({ mensagem: error.message });
  }
};
