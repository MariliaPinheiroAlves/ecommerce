import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Product } from './Product';
import fs from 'fs';
import path from 'path';

export const createProduct = async (req: Request, res: Response) => {
  try {
    const productRepository = getRepository(Product);
    const { name, description, price } = req.body;
    const imageUrl = req.file ? req.file.path : ''; // Caminho da imagem no servidor

    // Verifica se todos os campos obrigatórios foram fornecidos
    if (!name || !description || !price) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Cria um novo produto
    const newProduct = productRepository.create({ name, description, price, imageUrl });
    await productRepository.save(newProduct);

    return res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const productRepository = getRepository(Product);
    const products = await productRepository.find();
    return res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const productRepository = getRepository(Product);
    const { id } = req.params;
    const product = await productRepository.findOne(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
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
      return res.status(404).json({ message: 'Product not found' });
    }
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.updatedAt = new Date();
    await productRepository.save(product);
    return res.status(200).json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productRepository = getRepository(Product);
    const { id } = req.params;
    const product = await productRepository.findOne(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Remove a imagem do servidor, se existir
    if (product.imageUrl) {
      fs.unlinkSync(path.join(__dirname, '..', product.imageUrl));
    }

    await productRepository.remove(product);
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const downloadImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const productRepository = getRepository(Product);
    const product = await productRepository.findOne(id);
    if (!product || !product.imageUrl) {
      return res.status(404).json({ message: 'Product image not found' });
    }
    const imagePath = path.join(__dirname, '..', product.imageUrl);
    return res.status(200).download(imagePath);
  } catch (error) {
    console.error('Error downloading image:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
