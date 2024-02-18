import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from './User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const jwtSecret = process.env.JWT_SECRET || 'Batatinah123';

export const createUser = async (req: Request, res: Response) => {
  try {
    const userRepository = getRepository(User);
    const { username, email, password } = req.body;

    // Verifica email existente
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email existente no sistema' });
    }

    // Cripto senha antes do bd
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = userRepository.create({ username, email, password: hashedPassword });
    await userRepository.save(newUser);

    // Gerando um token 
    const token = jwt.sign({ userId: newUser.id }, jwtSecret, { expiresIn: '1h' });

    return res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error('Erro ao criar usuario:', error);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
};