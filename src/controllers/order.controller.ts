import { Request, Response } from 'express';
import { pool } from '../config/connection';
import { Order } from '../models/order';

export const getAllOrdersByUserID = async (req: Request<{ userId: string }>, res: Response<any>) => {
  const userId :string = req.params.userId;

  try {
    if (!userId) {
      return res.status(400).json({ mensagem: 'Você precisa passar o id.'});
    }

    const { rows } = await pool.query<Order>('SELECT * FROM pedidos WHERE id_usuario = $1', [userId]);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const createNewOrder = async (req: Request<{}, {}, Order>, res: Response<any>) => {
  const { user_id, product_id } = req.body;
  const orderDate = new Date().toISOString();

  try {

    if (!user_id || !product_id) {
      return res.status(400).json({mensagem: "Você precisa preencher todos os campos."})
    }

    const { rows } = await pool.query<Order>(
      'INSERT INTO pedidos (id_usuario, id_produto, data_pedido) VALUES ($1, $2, $3) RETURNING *',
      [user_id, product_id, orderDate]
    );

    return res.status(201).json(rows[0]);
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const deleteOrder = async (req: Request<{ orderId: string }>, res: Response<any>) => {
  const orderId: number = Number(req.params.orderId);

  try {

    if (!orderId) {
      return res.status(400).json({ mensagem: 'Você precisa passar o id.'})
    }

    await pool.query('DELETE FROM pedidos WHERE id = $1', [orderId]);
    return res.json({ mensagem: 'Pedido deletado com sucesso.' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
