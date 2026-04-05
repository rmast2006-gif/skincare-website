'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
  _id: string;
  brand: string;
  category: string;
  images: string[];
  price: number;
  name: { en: string; ar: string };
  description: { en: string; ar: string };
  howToUse: { en: string; ar: string };
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin');
      return;
    }

    fetch('http://localhost:5000/api/products', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setProducts);
  }, [router]);

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('adminToken');
    await fetch(`http://localhost:5000/api/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setProducts(products.filter(p => p._id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-6">Product Management</h1>
      <button onClick={() => setShowForm(!showForm)} className="bg-green-500 text-white px-4 py-2 rounded mb-4">
        {showForm ? 'Cancel' : 'Add Product'}
      </button>
      {showForm && <ProductForm onSave={() => { setShowForm(false); window.location.reload(); }} />}
      <table className="w-full border">
        <thead>
          <tr>
            <th>Name (EN)</th>
            <th>Brand</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id}>
              <td>{product.name.en}</td>
              <td>{product.brand}</td>
              <td>{product.price} JOD</td>
              <td>
                <button onClick={() => handleDelete(product._id)} className="bg-red-500 text-white px-2 py-1">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProductForm({ onSave }: { onSave: () => void }) {
  const [form, setForm] = useState({
    brand: 'Topicrem',
    category: '',
    images: [] as string[],
    price: 0,
    name: { en: '', ar: '' },
    description: { en: '', ar: '' },
    howToUse: { en: '', ar: '' },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded mb-4">
      {/* Add form fields for all properties */}
      <input type="text" placeholder="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} required />
      <input type="number" placeholder="Price" value={form.price} onChange={e => setForm({...form, price: +e.target.value})} required />
      <input type="text" placeholder="Name EN" value={form.name.en} onChange={e => setForm({...form, name: {...form.name, en: e.target.value}})} required />
      <input type="text" placeholder="Name AR" value={form.name.ar} onChange={e => setForm({...form, name: {...form.name, ar: e.target.value}})} required />
      {/* Add more fields */}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2">Save</button>
    </form>
  );
}