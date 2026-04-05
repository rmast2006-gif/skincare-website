import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product';
import connectDB from './config/database';

dotenv.config();

const addSampleProducts = async () => {
  try {
    await connectDB();

    const sampleProducts = [
      {
        brand: 'Topicrem',
        category: 'Moisturizers',
        images: ['https://via.placeholder.com/400x400?text=Topicrem+Cream'],
        price: 75,
        name: { en: 'Hydrating Cream', ar: 'كريم مرطب' },
        description: { en: 'Deep hydration for sensitive skin', ar: 'ترطيب عميق للبشرة الحساسة' },
        howToUse: { en: 'Apply daily on clean skin', ar: 'يستخدم يومياً على البشرة النظيفة' }
      },
      {
        brand: 'Novexpert',
        category: 'Serums',
        images: ['https://via.placeholder.com/400x400?text=Novexpert+Serum'],
        price: 92,
        name: { en: 'Repair Serum', ar: 'سيروم الإصلاح' },
        description: { en: 'Advanced repair formula', ar: 'تركيبة إصلاح متقدمة' },
        howToUse: { en: 'Apply morning and evening', ar: 'يستخدم صباحاً ومساءً' }
      }
    ];

    for (const productData of sampleProducts) {
      const existing = await Product.findOne({ 'name.en': productData.name.en });
      if (!existing) {
        const product = new Product(productData);
        await product.save();
        console.log(`Added product: ${productData.name.en}`);
      }
    }

    console.log('Sample products added successfully');
  } catch (error) {
    console.error('Error adding sample products:', error);
  } finally {
    mongoose.connection.close();
  }
};

addSampleProducts();