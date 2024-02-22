import { Request, Response } from "express";
import { pool } from "../config/connection";
import { Order } from "../models/order";

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    // const result = await pool.query("SELECT * FROM pedidos p ORDER BY p.id");
    const result =
      await pool.query(`SELECT p.id AS id_pedido, p2.id_produto, u.id_usuario, u.nome AS nome_usuario, 
                                      u.email AS email_usuario, p.data_pedido, p2.nome AS nome_produto, p2.imagem AS imagem_produto,
                                      p2.descricao AS descricao_produto, p2.preco AS preco_produto, p2.imagem AS imagem_produto 
                                    FROM pedidos p
                                    JOIN produtos p2 ON p2.id_produto = p.id_produto 
                                    JOIN usuarios u ON u.id_usuario = p.id_usuario 
                                    ORDER BY p.id;`);
    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllOrdersByUserID = async (
  req: Request<{ userId: string }>,
  res: Response<any>
) => {
  const userId: string = req.params.userId;

  try {
    if (!userId) {
      return res.status(400).json({ message: "Você precisa passar o id." });
    }

    const { rows } = await pool.query<Order>(
      "SELECT * FROM pedidos WHERE id_usuario = $1",
      [userId]
    );
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const createNewOrder = async (
  req: Request<{}, {}, Order>,
  res: Response<any>
) => {
  const { user_id, product_id } = req.body;
  const orderDate = new Date().toISOString();

  try {
    if (!user_id || !product_id) {
      return res
        .status(400)
        .json({ message: "Você precisa preencher todos os campos." });
    }

    const { rows } = await pool.query<Order>(
      "INSERT INTO pedidos (id_usuario, id_produto, data_pedido) VALUES ($1, $2, $3) RETURNING *",
      [user_id, product_id, orderDate]
    );

    return res.status(201).json(rows[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const deleteOrder = async (
  req: Request<{ orderId: string }>,
  res: Response<any>
) => {
  const orderId: number = Number(req.params.orderId);

  try {
    if (!orderId) {
      return res.status(400).json({ message: "Você precisa passar o id." });
    }

    await pool.query("DELETE FROM pedidos WHERE id = $1", [orderId]);
    return res.json({ message: "Pedido deletado com sucesso." });
  } catch (error) {
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};
