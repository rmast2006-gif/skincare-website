'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, ShoppingCart, MessageSquare, Package, TrendingUp, LogOut, LayoutDashboard, Plus, Pencil, Trash2, X, Eye, Tag } from 'lucide-react';
import { getCategoriesForBrand } from '@/lib/categories';
import { BRAND_CATEGORIES } from '@/lib/categories'

interface Analytics {
  totalVisitors: number;
  totalOrders: number;
  totalProducts: number;
  totalMessages: number;
  pendingOrders: number;
  visitorTrends: { date: string; visitors: number }[];
  pageVisits: Record<string, number>;
  recentOrders: Order[];
}

interface Order {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  notes?: string;
  items: { productName: string; brand: string; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'confirmed' | 'delivered';
  createdAt: string;
}

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

interface Product {
  id: string;
  name: string | { en: string; ar: string };
  brand: string | { en: string; ar: string };
  type?: string;
  category?: string;
  description?: string | { en: string; ar: string };
  howToUse?: string | { en: string; ar: string };
  benefits?: string | { en: string; ar: string };
  ingredients?: string | { en: string; ar: string };
  price: number;
  texture?: string;
  skinType?: string;
  images?: string[];
}

function getField(val: string | { en: string; ar: string } | undefined, lang = 'en'): string {
  if (!val) return '';
  if (typeof val === 'string') return val;
  return lang === 'ar' ? val.ar : val.en;
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('analytics');
  const [lang, setLang] = useState<'en' | 'ar'>('en');

  // Edit product state
  const [allCategories, setAllCategories] = useState<Record<string, string[]>>({
  Topicrem: [],
  Novexpert: []
})
  const [newCategoryInput, setNewCategoryInput] = useState('')
  const [newCategoryBrand, setNewCategoryBrand] = useState('')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});
  const [editImages, setEditImages] = useState<string[]>([]);
  const editFileInputRef = useRef<HTMLInputElement>(null);


  // Add product state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addFormData, setAddFormData] = useState<any>({
    nameEn: '', nameAr: '', brand: '', category: '', type: '',
    descriptionEn: '', howToUseEn: '', benefitsEn: '',
    ingredientsEn: '', price: '', texture: '', skinType: '',
  });
  const [addImages, setAddImages] = useState<string[]>([]);
  const addFileInputRef = useRef<HTMLInputElement>(null);

  // Order view state
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  // Delete confirm state
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  const addCategories = allCategories[addFormData.brand] || getCategoriesForBrand(addFormData.brand || '')
  const editCategories = allCategories[editFormData.brand] || getCategoriesForBrand(editFormData.brand || '')

  const router = useRouter();
  const locale = useLocale();
  const isRTL = lang === 'ar';

  const t = {
    analytics: lang === 'ar' ? 'التحليلات' : 'Analytics',
    orders: lang === 'ar' ? 'الطلبات' : 'Orders',
    products: lang === 'ar' ? 'المنتجات' : 'Products',
    messages: lang === 'ar' ? 'الرسائل' : 'Messages',
    totalVisitors: lang === 'ar' ? 'إجمالي الزوار' : 'Total Visitors',
    totalOrders: lang === 'ar' ? 'إجمالي الطلبات' : 'Total Orders',
    totalProducts: lang === 'ar' ? 'إجمالي المنتجات' : 'Total Products',
    totalMessages: lang === 'ar' ? 'إجمالي الرسائل' : 'Total Messages',
    pendingOrders: lang === 'ar' ? 'طلبات معلقة' : 'Pending Orders',
    visitorTrends: lang === 'ar' ? 'اتجاهات الزوار' : 'Visitor Trends',
    addProduct: lang === 'ar' ? 'إضافة منتج' : 'Add Product',
    edit: lang === 'ar' ? 'تعديل' : 'Edit',
    delete: lang === 'ar' ? 'حذف' : 'Delete',
    save: lang === 'ar' ? 'حفظ' : 'Save',
    cancel: lang === 'ar' ? 'إلغاء' : 'Cancel',
    logout: lang === 'ar' ? 'تسجيل الخروج' : 'Logout',
    search: lang === 'ar' ? 'بحث...' : 'Search...',
    pending: lang === 'ar' ? 'قيد الانتظار' : 'Pending',
    confirmed: lang === 'ar' ? 'مؤكد' : 'Confirmed',
    delivered: lang === 'ar' ? 'تم التوصيل' : 'Delivered',
    noData: lang === 'ar' ? 'لا توجد بيانات' : 'No data yet',
    dragDrop: lang === 'ar' ? 'اسحب وأفلت الصور هنا أو انقر للاختيار' : 'Drag & drop images here or click to select',
    adminDashboard: lang === 'ar' ? 'لوحة الإدارة' : 'Admin Dashboard',
    name: lang === 'ar' ? 'الاسم' : 'Name',
    phone: lang === 'ar' ? 'الهاتف' : 'Phone',
    email: lang === 'ar' ? 'البريد الإلكتروني' : 'Email',
    address: lang === 'ar' ? 'العنوان' : 'Address',
    date: lang === 'ar' ? 'التاريخ' : 'Date',
    status: lang === 'ar' ? 'الحالة' : 'Status',
    price: lang === 'ar' ? 'السعر' : 'Price',
    brand: lang === 'ar' ? 'العلامة التجارية' : 'Brand',
    description: lang === 'ar' ? 'الوصف' : 'Description',
    ingredients: lang === 'ar' ? 'المكونات' : 'Ingredients',
    howToUse: lang === 'ar' ? 'طريقة الاستخدام' : 'How to Use',
    benefits: lang === 'ar' ? 'الفوائد' : 'Benefits',
    skinType: lang === 'ar' ? 'نوع البشرة' : 'Skin Type',
    texture: lang === 'ar' ? 'القوام' : 'Texture',
    view: lang === 'ar' ? 'عرض' : 'View',
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    console.log('Dashboard token check:', token)
    if (!token) {
      console.log('No token, redirecting to login')
      router.push(`/${locale}/admin`);
      return;
    }
    console.log('Token found, fetching data')
    fetchAllData();
  }, [router, locale]);
  const fetchAllData = async () => {
  try {
    const [analyticsRes, ordersRes, messagesRes, productsRes, categoriesRes] = await Promise.all([
      fetch('/api/analytics'),
      fetch('/api/orders'),
      fetch('/api/messages'),
      fetch('/api/products'),
      fetch('/api/categories'),
    ]);

    const [analyticsData, ordersData, messagesData, productsData, categoriesData] = await Promise.all([
      analyticsRes.ok ? analyticsRes.json() : null,
      ordersRes.ok ? ordersRes.json() : [],
      messagesRes.ok ? messagesRes.json() : [],
      productsRes.ok ? productsRes.json() : [],
      categoriesRes.ok ? categoriesRes.json() : { Topicrem: [], Novexpert: [] },
    ]);

    setAnalytics(analyticsData);
    setOrders(Array.isArray(ordersData) ? ordersData : []);
    setMessages(Array.isArray(messagesData) ? messagesData : []);
    setProducts(Array.isArray(productsData) ? productsData : []);
    setFilteredOrders(Array.isArray(ordersData) ? ordersData : []);
    setAllCategories(categoriesData);
  } catch (err) {
    console.error('Fetch error:', err);
  }
};
  const chartData = analytics?.visitorTrends?.map(v => ({
    date: v.date,
    visits: v.visitors,
  })) || [];

  useEffect(() => {
    const filtered = orders.filter(o =>
      o.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  const handleEditDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    readFiles(files, setEditImages);
  };

  const handleEditFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    readFiles(files, setEditImages);
  };

  const handleAddDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    readFiles(files, setAddImages);
  };

  const handleAddFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    readFiles(files, setAddImages);
  };

  const readFiles = async (files: File[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
  try {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    const res = await fetch('/api/upload/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (data.urls) {
      setter(prev => [...prev, ...data.urls]);
    }
  } catch (err) {
    console.error('Upload error:', err);
    alert('Image upload failed');
  }
};

  const removeEditImage = (index: number) => setEditImages(prev => prev.filter((_, i) => i !== index));
  const removeAddImage = (index: number) => setAddImages(prev => prev.filter((_, i) => i !== index));

 const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setEditFormData({
      nameEn: getField(product.name, 'en'),
      nameAr: getField(product.name, 'ar'),
      brand: getField(product.brand, 'en'),
      category: product.category || '',
      type: product.type || '',
      descriptionEn: getField(product.description, 'en'),
      howToUseEn: getField(product.howToUse, 'en'),
      benefitsEn: getField(product.benefits, 'en'),
      ingredientsEn: getField(product.ingredients, 'en'),
      price: product.price || '',
      texture: product.texture || '',
      skinType: product.skinType || '',
    });
    setEditImages(product.images || []);
    setIsEditModalOpen(true);
  };

const handleSaveEdit = async () => {
  console.log("PRODUCT OBJECT:", editingProduct);

  const productId = editingProduct?.id; // ✅ ONLY id

  if (!productId) {
    console.error('handleSaveEdit: No product ID provided', editingProduct);
    alert('Product ID missing');
    return;
  }

  const token = localStorage.getItem('adminToken');
  if (!token) {
    console.error('handleSaveEdit: No auth token in localStorage');
    alert('You are not logged in');
    return;
  }

  try {
    console.log('category being saved:', editFormData.category, 'fallback:', editingProduct?.category)
    const payload = {
      name: { en: editFormData.nameEn, ar: editFormData.nameAr },
      brand: editFormData.brand,
      category: editFormData.category || editingProduct?.category || null,
      description: { en: editFormData.descriptionEn, ar: editFormData.descriptionEn },
      howToUse: { en: editFormData.howToUseEn, ar: editFormData.howToUseEn },
      benefits: { en: editFormData.benefitsEn, ar: editFormData.benefitsEn },
      ingredients: { en: editFormData.ingredientsEn, ar: editFormData.ingredientsEn },
      price: Number(editFormData.price) || 0,
      texture: editFormData.texture,
      skinType: editFormData.skinType,
      images: editImages,
    };

    const res = await fetch(`/api/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('handleSaveEdit error:', errorText);
      alert(`Failed to update: ${errorText}`);
      return;
    }

    alert('Updated ✅');
    setIsEditModalOpen(false);
    setEditingProduct(null);
    fetchAllData();

  } catch (err) {
    console.error('handleSaveEdit exception:', err);
    alert('Edit failed');
  }
};
  const handleAddProduct = async () => {
  const token = localStorage.getItem('adminToken');

  if (!token) {
    console.error('handleAddProduct: No auth token in localStorage');
    alert('You are not logged in');
    return;
  }

  if (!addFormData.brand) {
    console.error('handleAddProduct: Brand not selected');
    alert('Select brand first');
    return;
  }

  try {
    const payload = {
  name: { en: addFormData.nameEn, ar: addFormData.nameAr },
  brand: addFormData.brand,
  category: addFormData.category || null,
  description: { en: addFormData.descriptionEn, ar: addFormData.descriptionEn },
  howToUse: { en: addFormData.howToUseEn, ar: addFormData.howToUseEn },
  benefits: { en: addFormData.benefitsEn, ar: addFormData.benefitsEn },
  ingredients: { en: addFormData.ingredientsEn, ar: addFormData.ingredientsEn },
  price: Number(addFormData.price) || 0,
  texture: addFormData.texture,
  skinType: addFormData.skinType,
  images: addImages,
};

    console.log('handleAddProduct: Sending payload', payload);

    const res = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    console.log('handleAddProduct: Response status', res.status);

    if (!res.ok) {
      let errorMsg = 'Unknown error';
      try {
        const bodyText = await res.text();
        try {
          const errorData = JSON.parse(bodyText);
          errorMsg = errorData.message || errorData.error || JSON.stringify(errorData);
        } catch {
          errorMsg = bodyText || 'Server error';
        }
      } catch (e) {
        console.error('Failed to parse error response:', e);
      }
      console.error('handleAddProduct: Error response', errorMsg);
      alert(`Failed to add product: ${errorMsg}`);
      return;
    }

    const bodyText = await res.text();
    const data = bodyText ? JSON.parse(bodyText) : { success: true };
    console.log('handleAddProduct: Success', data);
    alert('Product added ✅');
    setIsAddModalOpen(false);
    setAddFormData({
      nameEn: '', nameAr: '', brand: '', category: '', type: '',
      descriptionEn: '', howToUseEn: '', benefitsEn: '',
      ingredientsEn: '', price: '', texture: '', skinType: '',
    });
    setAddImages([]);
    fetchAllData();

  } catch (err) {
    console.error('handleAddProduct: Exception caught', err instanceof Error ? err.message : err);
    alert('Add product failed: Network or server error');
  }
};
 const handleDeleteProduct = async (id: string | null) => {
  if (!id) {
    alert('Product ID is required');
    return;
  }

  const token = localStorage.getItem('adminToken');

  if (!token) {
    alert('You are not logged in');
    return;
  }

  try {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      alert(`Delete failed: ${errorText}`);
      return;
    }

    alert('Deleted ✅');
    setDeletingProductId(null);
    fetchAllData();

  } catch (err) {
    alert('Delete failed');
  }
};
 
const handleCompleteOrder = async (id: string) => {
  if (!confirm('Mark this order as completed and remove it?')) return
  const token = localStorage.getItem('adminToken')
  try {
    const res = await fetch('/api/orders/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id }),
    })
    if (!res.ok) { alert('Failed to complete order'); return }
    setViewingOrder(null)
    fetchAllData()
  } catch (err) {
    alert('Something went wrong')
  }
}

const handleDeleteMessage = async (id: string) => {
  if (!confirm('Delete this message?')) return
  const token = localStorage.getItem('adminToken')
  try {
    const res = await fetch('/api/messages/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id }),
    })
    if (!res.ok) { alert('Failed to delete message'); return }
    fetchAllData()
  } catch (err) {
    alert('Something went wrong')
  }
}

  

  const navItems = [
    { id: 'analytics', label: t.analytics, icon: <LayoutDashboard size={18} /> },
    { id: 'orders', label: t.orders, icon: <ShoppingCart size={18} /> },
    { id: 'products', label: t.products, icon: <Package size={18} /> },
    { id: 'messages', label: t.messages, icon: <MessageSquare size={18} /> },
  ];

  const ImageUploadZone = ({
    images, onDrop, onFileInput, onRemove, fileInputRef, inputId
  }: {
    images: string[];
    onDrop: (e: React.DragEvent) => void;
    onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: (i: number) => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    inputId: string;
  }) => (
    <div>
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-amber-300 rounded-xl p-6 text-center cursor-pointer hover:border-amber-500 hover:bg-amber-50 transition-all"
      >
        <p className="text-sm text-gray-400">{t.dragDrop}</p>
        <input
          id={inputId}
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          onChange={onFileInput}
          style={{ display: 'none' }}
        />
      </div>
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {images.map((img, i) => (
            <div key={i} className="relative w-20 h-20">
              <img src={img} alt="" className="w-full h-full object-cover rounded-lg border" />
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const handleAddCategory = async () => {
    if (!newCategoryBrand || !newCategoryInput.trim()) return
    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: newCategoryBrand,
          category: newCategoryInput.trim().toUpperCase()
        })
      })
      setNewCategoryInput('')
      const res = await fetch('/api/categories')
      if (res.ok) setAllCategories(await res.json())
    } catch (e) {
      console.error('Add category error:', e)
    }
  }

  return (
    <div className="flex min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* SIDEBAR */}
      <aside className="w-60 min-h-screen flex flex-col justify-between py-6 px-4" style={{ background: '#0a0a0a' }}>
        <div>
          <div className="mb-8 px-2">
            <span className="text-white font-semibold text-base leading-tight">Topicrem <span style={{ color: '#c9a96e' }}>•</span> Novexpert</span>
          </div>
          <nav className="space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
                style={{
                  background: activeTab === item.id ? '#1a1a1a' : 'transparent',
                  color: activeTab === item.id ? '#ffffff' : '#71717a',
                  borderLeft: activeTab === item.id ? '3px solid #c9a96e' : '3px solid transparent',
                }}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <button
          onClick={() => router.push(`/${locale}/admin/coupons`)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all mt-1"
          style={{
            background: 'transparent',
            color: '#71717a',
            borderLeft: '3px solid transparent',
          }}
        >
          <Tag size={18} />
          Coupons
        </button>
        <div className="space-y-3 px-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: '#c9a96e', color: '#0a0a0a' }}>A</div>
            <span className="text-xs text-gray-400">Admin</span>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('adminToken');
              router.push(`/${locale}/admin`);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-950 transition-all"
          >
            <LogOut size={16} />
            {t.logout}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-h-screen" style={{ background: '#f8f7f4' }}>

        {/* TOP HEADER */}
        <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200">
          <h1 className="text-xl font-bold" style={{ color: '#09090b' }}>
            {navItems.find(n => n.id === activeTab)?.label}
          </h1>
          <button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="px-4 py-1.5 rounded-lg text-sm font-medium border transition-all"
            style={{ borderColor: '#c9a96e', color: '#c9a96e' }}
          >
            {lang === 'en' ? 'العربية' : 'English'}
          </button>
        </header>

        <div className="flex-1 p-8">

         {/* ANALYTICS TAB */}
{activeTab === 'analytics' && (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[
        { label: t.totalVisitors, value: analytics?.totalVisitors || 0, icon: <Users size={20} /> },
        { label: t.totalOrders, value: analytics?.totalOrders || 0, icon: <ShoppingCart size={20} /> },
        { label: t.totalProducts, value: analytics?.totalProducts || 0, icon: <Package size={20} /> },
        { label: t.totalMessages, value: analytics?.totalMessages || 0, icon: <MessageSquare size={20} /> },
      ].map((kpi, i) => (
        <div key={i} className="bg-white rounded-xl p-5 border border-gray-200" style={{ borderTop: '3px solid #c9a96e' }}>
          <div className="flex justify-between items-start">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{kpi.label}</p>
            <span className="text-gray-300">{kpi.icon}</span>
          </div>
          <p className="text-3xl font-bold mt-2" style={{ color: '#09090b' }}>{kpi.value}</p>
        </div>
      ))}
    </div>

    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-sm font-semibold text-gray-600 mb-4">{t.visitorTrends}</h2>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line type="monotone" dataKey="visits" stroke="#c9a96e" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-60 flex items-center justify-center text-gray-300 text-sm">{t.noData}</div>
      )}
    </div>

    {/* Page Visits Breakdown */}
    {analytics?.pageVisits && Object.keys(analytics.pageVisits).length > 0 && (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-600 mb-4">
          {lang === 'ar' ? 'الصفحات الأكثر زيارة' : 'Most Visited Pages'}
        </h2>
        <div className="space-y-3">
          {Object.entries(analytics.pageVisits)
            .sort(([, a], [, b]) => b - a)
            .map(([page, count]) => {
              const total = Object.values(analytics.pageVisits).reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={page}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600 font-medium truncate max-w-xs">{page}</span>
                    <span className="text-xs font-bold text-gray-800 ml-2">
                      {count} <span className="text-gray-400 font-normal">
                        {lang === 'ar' ? 'زيارة' : 'visits'}
                      </span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{ width: `${percentage}%`, background: '#c9a96e' }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    )}

  </div>
)}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h2 className="font-semibold text-gray-700">{t.orders}</h2>
                <Input
                  placeholder={t.search}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-60 h-8 text-sm"
                />
              </div>
              {filteredOrders.length === 0 ? (
                <div className="p-10 text-center text-gray-300 text-sm">{t.noData}</div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-400 text-xs uppercase">
                      <th className="px-5 py-3 text-left">{t.name}</th>
                      <th className="px-5 py-3 text-left">{t.email}</th>
                      <th className="px-5 py-3 text-left">{t.date}</th>
                      <th className="px-5 py-3 text-left">{t.price}</th>
                      <th className="px-5 py-3 text-left">{t.status}</th>
                      <th className="px-5 py-3 text-left"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order, i) => (
                      <tr key={order.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-5 py-3 font-medium">{order.customerName}</td>
                        <td className="px-5 py-3 text-gray-400">{order.email}</td>
                        <td className="px-5 py-3 text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="px-5 py-3 font-medium" style={{ color: '#c9a96e' }}>{order.total} JOD</td>
                        <td className="px-5 py-3">
                          <button
                            onClick={() => setViewingOrder(order)}
                            className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50"
                          >
                            <Eye size={12} /> {t.view}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-5">
                <h2 className="font-semibold text-gray-700">{t.products}</h2>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
                  style={{ background: '#c9a96e' }}
                >
                  <Plus size={16} /> {t.addProduct}
                </button>
              </div>
              {/* Manage Categories */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">
                  {lang === 'ar' ? 'إدارة الفئات' : 'Manage Categories'}
                </h3>
                <div className="flex gap-2 flex-wrap mb-4">
                  <select
                    value={newCategoryBrand}
                    onChange={e => setNewCategoryBrand(e.target.value)}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none bg-white"
                  >
                    <option value="">{lang === 'ar' ? 'اختر العلامة' : 'Select Brand'}</option>
                    <option value="Topicrem">Topicrem</option>
                    <option value="Novexpert">Novexpert</option>
                  </select>
                  <input
                    type="text"
                    value={newCategoryInput}
                    onChange={e => setNewCategoryInput(e.target.value)}
                    placeholder={lang === 'ar' ? 'اسم الفئة الجديدة' : 'New category name'}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none flex-1 min-w-40"
                    onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
                  />
                  <button
                    onClick={handleAddCategory}
                    className="px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-all"
                    style={{ background: '#c9a96e' }}
                  >
                    + {lang === 'ar' ? 'إضافة' : 'Add'}
                  </button>
                </div>
                {['Topicrem', 'Novexpert'].map(brand => {
                  const all = allCategories[brand] || []
                  const defaults = BRAND_CATEGORIES[brand] || []
                  const custom = all.filter(c => !defaults.includes(c))
                  if (custom.length === 0) return null
                  return (
                    <div key={brand} className="mb-3">
                      <p className="text-xs text-gray-400 mb-2 font-medium">
                        {brand} — {lang === 'ar' ? 'مخصص' : 'custom'}:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {custom.map(cat => (
                          <span
                            key={cat}
                            className="flex items-center gap-1 text-xs px-3 py-1 rounded-full border border-gray-200 text-gray-600"
                          >
                            {cat}
                            <button
                              onClick={async () => {
                                await fetch('/api/categories', {
                                  method: 'DELETE',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ brand, category: cat })
                                })
                                const res = await fetch('/api/categories')
                                if (res.ok) setAllCategories(await res.json())
                              }}
                              className="text-red-400 hover:text-red-600 ml-1 font-bold"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
              {products.length === 0 ? (
                <div className="p-10 text-center text-gray-300 text-sm bg-white rounded-xl border border-gray-200">{t.noData}</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {products.map(product => (
                    <div key={product.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      {product.images && product.images[0] ? (
                        <img src={product.images[0]} alt="" className="w-full h-44 object-cover" />
                      ) : (
                        <div className="w-full h-44 bg-gray-100 flex items-center justify-center text-gray-300 text-xs">No image</div>
                      )}
                      <div className="p-4">
                        <p className="font-semibold text-sm text-gray-800">{getField(product.name)}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{getField(product.brand)}</p>
                        {product.category && (
                          <p className="text-xs text-gray-500 mt-0.5">{product.category}</p>
                        )}
                        <p className="text-sm font-bold mt-1" style={{ color: '#c9a96e' }}>{product.price} JOD</p>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="flex-1 flex items-center justify-center gap-1 text-xs py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
                          >
                            <Pencil size={12} /> {t.edit}
                          </button>
                          <button
                            onClick={() => setDeletingProductId(product.id)}
                            className="flex-1 flex items-center justify-center gap-1 text-xs py-1.5 rounded-lg text-red-400 border border-red-100 hover:bg-red-50"
                          >
                            <Trash2 size={12} /> {t.delete}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MESSAGES TAB */}
          {activeTab === 'messages' && (
            <div className="space-y-3">
              {messages.length === 0 ? (
                <div className="p-10 text-center text-gray-300 text-sm bg-white rounded-xl border border-gray-200">{t.noData}</div>
              ) : (
                messages.map(msg => {
                  const today = new Date().toDateString();
                  const msgDate = new Date(msg.createdAt).toDateString();
                  const isToday = today === msgDate;
                  return (
                    <div
                      key={msg.id}
                      className="bg-white rounded-xl border border-gray-200 p-5"
                      style={isToday ? { borderLeft: '3px solid #c9a96e' } : {}}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-sm text-gray-800">{msg.name}</p>
                          <p className="text-xs text-gray-400">{msg.email}</p>
                        </div>
                        <p className="text-xs text-gray-300">{new Date(msg.createdAt).toLocaleString()}</p>
                      </div>
                      <p className="text-sm text-gray-600">{msg.message}</p>
                      <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                       className="text-xs px-3 py-1.5 rounded-lg text-red-400 border border-red-100 hover:bg-red-50"
  >
                        Delete
                      </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </main>

      {/* ORDER VIEW MODAL */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setViewingOrder(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>
            <h2 className="font-bold text-lg mb-4">Order Details</h2>
            <div className="space-y-1 text-sm text-gray-700">
              <p className="font-semibold">Customer Information:</p>
              <p>{t.name}: {viewingOrder.customerName}</p>
              <p>{t.phone}: {viewingOrder.phone}</p>
              <p>{t.email}: {viewingOrder.email}</p>
              <p>{t.address}: {viewingOrder.address}</p>
              <br />
              <p className="font-semibold">Order Details:</p>
              {viewingOrder.items?.map((item, i) => (
                <div key={i} className="ml-2">
                  <p>{i + 1}. {item.productName}</p>
                  <p className="ml-3">Brand: {item.brand}</p>
                  <p className="ml-3">Quantity: {item.quantity}</p>
                  <p className="ml-3">Price: {item.price} JOD</p>
                </div>
              ))}
              <br />
              <p className="font-bold">Total: {viewingOrder.total} JOD</p>
              <p>Notes: {viewingOrder.notes || '—'}</p>
            </div>
            <div className="mt-5">
              <button
                onClick={() => handleCompleteOrder(viewingOrder.id)}
                className="w-full py-2.5 rounded-xl text-white text-sm font-medium"
                style={{ background: '#c9a96e' }}
              >
                ✓ Order Completed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deletingProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4">
            <h2 className="font-bold text-lg mb-2">Delete Product</h2>
            <p className="text-sm text-gray-500 mb-5">Are you sure you want to delete this product? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeletingProductId(null)} className="flex-1 py-2 rounded-lg border border-gray-200 text-sm">{t.cancel}</button>
              <button onClick={() => handleDeleteProduct(deletingProductId)} className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsEditModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>
            <h2 className="font-bold text-lg mb-5">{t.edit} Product</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-xs">Name (EN)</Label><Input value={editFormData.nameEn || ''} onChange={e => setEditFormData({ ...editFormData, nameEn: e.target.value })} /></div>
              <div><Label className="text-xs">Name (AR)</Label><Input value={editFormData.nameAr || ''} onChange={e => setEditFormData({ ...editFormData, nameAr: e.target.value })} /></div>

              {/* BRAND DROPDOWN - edit modal */}
              <div>
                <Label className="text-xs">{t.brand}</Label>
                <Select 
                  value={editFormData.brand || ''} 
                  onValueChange={val => setEditFormData({ ...editFormData, brand: val, category: '' })}
                >
                  <SelectTrigger><SelectValue placeholder="Select brand" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Topicrem">Topicrem</SelectItem>
                    <SelectItem value="Novexpert">Novexpert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* CATEGORY DROPDOWN - edit modal */}
              <div>
                <Label className="text-xs">Category</Label>
                <Select 
                  value={editFormData.category || ''} 
                  onValueChange={val => setEditFormData({ ...editFormData, category: val })}
                  disabled={!editFormData.brand}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={editFormData.brand ? 'Select category' : 'Select brand first'} />
                  </SelectTrigger>
                  <SelectContent>
                    {editCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div><Label className="text-xs">{t.price} (JOD)</Label><Input type="number" value={editFormData.price || ''} onChange={e => setEditFormData({ ...editFormData, price: e.target.value })} /></div>
              <div><Label className="text-xs">{t.skinType}</Label><Input value={editFormData.skinType || ''} onChange={e => setEditFormData({ ...editFormData, skinType: e.target.value })} /></div>
             <div className="col-span-2"><Label className="text-xs">{t.description}</Label><Textarea value={editFormData.descriptionEn || ''} onChange={e => setEditFormData({ ...editFormData, descriptionEn: e.target.value })} /></div>
              <div className="col-span-2"><Label className="text-xs">{t.howToUse}</Label><Textarea value={editFormData.howToUseEn || ''} onChange={e => setEditFormData({ ...editFormData, howToUseEn: e.target.value })} /></div>
              <div className="col-span-2"><Label className="text-xs">{t.benefits}</Label><Textarea value={editFormData.benefitsEn || ''} onChange={e => setEditFormData({ ...editFormData, benefitsEn: e.target.value })} /></div>
              <div className="col-span-2"><Label className="text-xs">{t.ingredients}</Label><Textarea value={editFormData.ingredientsEn || ''} onChange={e => setEditFormData({ ...editFormData, ingredientsEn: e.target.value })} /></div>
              <div className="col-span-2">
                <Label className="text-xs mb-2 block">Images</Label>
                <ImageUploadZone
                  images={editImages}
                  onDrop={handleEditDrop}
                  onFileInput={handleEditFileInput}
                  onRemove={removeEditImage}
                  fileInputRef={editFileInputRef}
                  inputId="edit-file-input"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setIsEditModalOpen(false)} className="flex-1 py-2 rounded-lg border border-gray-200 text-sm">{t.cancel}</button>
              <button onClick={handleSaveEdit} className="flex-1 py-2 rounded-lg text-white text-sm font-medium" style={{ background: '#c9a96e' }}>{t.save}</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD PRODUCT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsAddModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>
            <h2 className="font-bold text-lg mb-5">{t.addProduct}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-xs">Name (EN)</Label><Input value={addFormData.nameEn} onChange={e => setAddFormData({ ...addFormData, nameEn: e.target.value })} /></div>
              <div><Label className="text-xs">Name (AR)</Label><Input value={addFormData.nameAr} onChange={e => setAddFormData({ ...addFormData, nameAr: e.target.value })} /></div>

              {/* BRAND DROPDOWN - add modal */}
              <div>
                <Label className="text-xs">{t.brand}</Label>
                <Select 
                  value={addFormData.brand} 
                  onValueChange={val => setAddFormData({ ...addFormData, brand: val, category: '' })}
                >
                  <SelectTrigger><SelectValue placeholder="Select brand" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Topicrem">Topicrem</SelectItem>
                    <SelectItem value="Novexpert">Novexpert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* CATEGORY DROPDOWN - add modal */}
              <div>
                <Label className="text-xs">Category</Label>
                <Select 
                  value={addFormData.category} 
                  onValueChange={val => setAddFormData({ ...addFormData, category: val })}
                  disabled={!addFormData.brand}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={addFormData.brand ? 'Select category' : 'Select brand first'} />
                  </SelectTrigger>
                  <SelectContent>
                    {addCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div><Label className="text-xs">{t.price} (JOD)</Label><Input type="number" value={addFormData.price} onChange={e => setAddFormData({ ...addFormData, price: e.target.value })} /></div>
              <div><Label className="text-xs">{t.skinType}</Label><Input value={addFormData.skinType} onChange={e => setAddFormData({ ...addFormData, skinType: e.target.value })} /></div>
              <div className="col-span-2"><Label className="text-xs">{t.description}</Label><Textarea value={addFormData.descriptionEn} onChange={e => setAddFormData({ ...addFormData, descriptionEn: e.target.value })} /></div>
              <div className="col-span-2"><Label className="text-xs">{t.howToUse}</Label><Textarea value={addFormData.howToUseEn} onChange={e => setAddFormData({ ...addFormData, howToUseEn: e.target.value })} /></div>
              <div className="col-span-2"><Label className="text-xs">{t.benefits}</Label><Textarea value={addFormData.benefitsEn} onChange={e => setAddFormData({ ...addFormData, benefitsEn: e.target.value })} /></div>
              <div className="col-span-2"><Label className="text-xs">{t.ingredients}</Label><Textarea value={addFormData.ingredientsEn} onChange={e => setAddFormData({ ...addFormData, ingredientsEn: e.target.value })} /></div>
              <div className="col-span-2">
                <Label className="text-xs mb-2 block">Images</Label>
                <ImageUploadZone
                  images={addImages}
                  onDrop={handleAddDrop}
                  onFileInput={handleAddFileInput}
                  onRemove={removeAddImage}
                  fileInputRef={addFileInputRef}
                  inputId="add-file-input"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setIsAddModalOpen(false)} className="flex-1 py-2 rounded-lg border border-gray-200 text-sm">{t.cancel}</button>
              <button onClick={handleAddProduct} className="flex-1 py-2 rounded-lg text-white text-sm font-medium" style={{ background: '#c9a96e' }}>{t.save}</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
