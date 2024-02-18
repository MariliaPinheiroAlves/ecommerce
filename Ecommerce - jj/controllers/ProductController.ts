import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Product } from './Product';
import fs from 'fs';
import path from 'path';

export const createProduct = async (req: Request, res: Response) => {
  try {
    const productRepository = getRepository(Product);
    const { name, description, price } = req.body;
    const imageUrl = req.file ? req.file.path : '';

    
    if (!name || !description || !price) {
      return res.status(400).json({ message: 'Todos os campos nao foram preenchidos' });
    }

    const newProduct = productRepository.create({ name, description, price, imageUrl });
    await productRepository.save(newProduct);

    return res.status(201).json(newProduct);
  } catch (error) {
    console.error('Erro ao criar produto', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const productRepository = getRepository(Product);
    const products = await productRepository.find();
    return res.status(200).json(products);
  } catch (error) {
    console.error('Erro ao obter produto', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const productRepository = getRepository(Product);
    const { id } = req.params;
    const product = await productRepository.findOne(id);
    if (!product) {
      return res.status(404).json({ message: 'Produto nao encontrado' });
    }
    return res.status(200).json(product);
  } catch (error) {
    console.error('Erro ao obter produto', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const productRepository = getRepository(Product);
    const { id } = req.params;
    const { name, description, price } = req.body;
    const product = await productRepository.findOne(id);
    if (!product) {
      return res.status(404).json({ message: 'Produto nao encontrado' });
    }
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.updatedAt = new Date();
    await productRepository.save(product);
    return res.status(200).json(product);
  } catch (error) {
    console.error('Erro ao atualizar produto', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productRepository = getRepository(Product);
    const { id } = req.params;
    const product = await productRepository.findOne(id);
    if (!product) {
      return res.status(404).json({ message: 'Produto nao encontrado' });
    }

    if (product.imageUrl) {
      fs.unlinkSync(path.join(__dirname, '..', product.imageUrl));
    }

    await productRepository.remove(product);
    return res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const downloadImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const productRepository = getRepository(Product);
    const product = await productRepository.findOne(id);
    if (!product || !product.imageUrl) {
      return res.status(404).json({ message: 'Erro, imagem nao encontrada' });
    }
    const imagePath = path.join(__dirname, '..', product.imageUrl);
    return res.status(200).download(imagePath);
  } catch (error) {
    console.error('Erro ao carregar arquivo', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
