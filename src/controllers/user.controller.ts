import { Request, Response } from "express";
import { pool } from "../config/connection";

import { v4 as uuid } from "uuid";
import { decryptPassword, encryptedPassword } from "../utils/encryption";

import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.SECRET;

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, username, name, password } = req.body;

    if (!(email || username || password))
      throw new Error("Todos os campos são obrigatórios.");

    const query = `INSERT INTO users (user_id, email, username, name, password) VALUES ($1, $2, $3, $4, $5) RETURNING *`;

    const passwordHash = await encryptedPassword(password);
    const id = uuid();

    const user = await pool.query(query, [
      id,
      email,
      username,
      name,
      passwordHash,
    ]);

    res.status(201).json({ ...user });
  } catch (error: any) {
    return res.status(500).json({ mensagem: error.message });
  }
};

export const getUserByUsername = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    const query = "SELECT * FROM users u WHERE u.username = $1;";
    const user = await pool.query(query, [username]);

    if (user.rowCount == 0) throw new Error("Usuário não encontrado!");

    res.status(201).json({ ...user });
  } catch (error: any) {
    return res.status(500).json({ mensagem: error.message });
  }
};

export const validateToken = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization!;

    const decoded = jwt.verify(token, SECRET!);

    const query = "SELECT * FROM users u WHERE u.email = $1;";
    const user = await pool.query(query, [(decoded as JwtPayload).email]);

    if (user.rowCount == 0) throw new Error("Usuário não encontrado!");

    res.status(200).json({ ...user });
  } catch (error: any) {
    return res.status(500).json({ mensagem: error.message });
  }
};

export const createToken = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const query = "SELECT * FROM users u WHERE u.email = $1;";
    const user = await pool.query(query, [email]);

    if (user.rowCount == 0) throw new Error("Usuário não encontrado!");

    const validatedPassword = await decryptPassword(
      password,
      user.rows[0].password
    );

    if (!validatedPassword)
      throw new Error("A senha ou login estão incorretos. Tente novamente.");

    const token = jwt.sign(
      {
        email: email.toLocaleLowerCase(),
        username: user.rows[0].username,
        user_id: user.rows[0].user_id,
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
