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

const securityFieldsUser = (response: User): User => {
  const user: User = {
    id_usuario: response.id_usuario,
    username: response.username,
    nome: response.nome,
    email: response.email,
  };

  return user;
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const query = "SELECT * FROM usuarios;";
    const response = await pool.query(query);

    const users = response.rows.map((user) => securityFieldsUser(user));

    res.json([...users]);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
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

    const query = `INSERT INTO usuarios (id_usuario, email, username, nome, senha) VALUES ($1, $2, $3, $4, $5) RETURNING *`;

    const passwordHash: string = await encryptedPassword(password);
    const id: string = uuid();

    // verificar se o user ja existe com esse email
    const emailExists: QueryResult<User> = await pool.query(
      "SELECT * FROM usuarios ua WHERE ua.email = $1;",
      [email]
    );

    if (!!emailExists.rowCount)
      throw new Error("Esse email já está sendo utilizado por uma conta.");

    // verificar se o user ja existe com esse username
    const usernameExists: QueryResult<User> = await pool.query(
      "SELECT * FROM usuarios ua WHERE ua.username = $1;",
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

    const user: User = securityFieldsUser(response.rows[0]);

    res.status(201).json({ ...user });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserByUsername = async (req: Request, res: Response) => {
  try {
    const { username } = req.params as { username: string };

    const query = "SELECT * FROM usuarios u WHERE u.username = $1;";
    const response = await pool.query(query, [username]);

    if (!!!response.rowCount) throw new Error("Usuário não encontrado!");

    const user: User = securityFieldsUser(response.rows[0]);

    res.json({ ...user });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const validateToken = async (req: Request, res: Response) => {
  try {
    const token: string = req.headers.authorization!;

    const decoded: JwtPayload | string = jwt.verify(token, SECRET!);

    const query = "SELECT * FROM usuarios u WHERE u.email = $1;";
    const response = await pool.query(query, [(decoded as JwtPayload).email]);

    if (!!!response.rowCount) throw new Error("Usuário não encontrado!");

    const user: User = securityFieldsUser(response.rows[0]);

    res.status(200).json({ ...user });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const createToken = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    const query = "SELECT * FROM usuarios u WHERE u.email = $1;";
    const response = await pool.query(query, [email]);

    if (!!!response.rowCount) throw new Error("Usuário não encontrado!");

    const userPassword: string = response.rows[0].senha!;

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
        id_usuario: response.rows[0].id_usuario,
      },
      SECRET!,
      {
        expiresIn: "4h",
      }
    );

    res.status(200).json({ token });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
