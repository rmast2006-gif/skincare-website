import { Request, Response } from 'express';
import Product from '../models/Product';
import Joi from 'joi';
import fs from 'fs';
import path from 'path';

const productSchema = Joi.object({
  brand: Joi.string().valid('Topicrem', 'Novexpert').required(),
  category: Joi.string().required(),
  images: Joi.array().items(Joi.string()).min(1).required(),
  price: Joi.number().min(0).required(),
  name: Joi.object({
    en: Joi.string().required(),
    ar: Joi.string().required(),
  }).required(),
  description: Joi.object({
    en: Joi.string().required(),
    ar: Joi.string().required(),
  }).required(),
  howToUse: Joi.object({
    en: Joi.string().required(),
    ar: Joi.string().required(),
  }).required(),
});

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { brand, category } = req.query;
    const filter: any = {};
    if (brand) filter.brand = new RegExp(`^${brand}$`, 'i');
    if (category) filter.category = category;

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = productSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const product = new Product(req.body);
    await product.save();

    console.log('🔥 createProduct API HIT');

    // ✅ ALSO SAVE TO store.json
    const filePath = path.join(__dirname, '../../../frontend/data/store.json');

    const raw = fs.readFileSync(filePath, 'utf-8');
    const store = JSON.parse(raw);

    if (!store.products) {
      store.products = [];
    }

    store.products.push({
      ...req.body,
      id: product._id.toString(),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    });

    fs.writeFileSync(filePath, JSON.stringify(store, null, 2));

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = productSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};