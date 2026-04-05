'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Trash2, ToggleLeft, ToggleRight, Plus, Tag } from 'lucide-react'

interface Product {
  id: string
  name: string | { en: string; ar: string }
  brand: string | { en: string; ar: string }
}

interface Coupon {
  _id: string
  code: string
  discount: number
  appliesToAll: boolean
  products: { _id: string; name: any; brand: any }[]
  isActive: boolean
}

function getField(val: any): string {
  if (!val) return ''
  if (typeof val === 'string') return val
  return val.en || ''
}

export default function CouponsPage() {
  const router = useRouter()
  const locale = useLocale()

  const [globalEnabled, setGlobalEnabled] = useState(false)
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [code, setCode] = useState('')
  const [discount, setDiscount] = useState('')
  const [appliesToAll, setAppliesToAll] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  const token = typeof window !== 'undefined'
    ? localStorage.getItem('adminToken') || ''
    : ''

  const authHeader = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!token) { router.push(`/${locale}/admin`); return }
    fetchAll()
  }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [couponsRes, productsRes] = await Promise.all([
        fetch('/api/coupons', { headers: authHeader }),
        fetch('/api/products'),
      ])
      const couponsData = await couponsRes.json()
      const productsData = await productsRes.json()

      setCoupons(couponsData.coupons || [])
      setGlobalEnabled(couponsData.globalEnabled || false)
      setProducts(Array.isArray(productsData) ? productsData : [])
    } catch (e) {
      console.error('[CouponsPage] fetchAll error:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleGlobal = async () => {
    try {
      const res = await fetch('/api/coupons/toggle-global', {
        method: 'PATCH',
        headers: authHeader,
      })
      const data = await res.json()
      setGlobalEnabled(data.globalEnabled)
    } catch (e) {
      console.error('[toggleGlobal] error:', e)
    }
  }

  const handleToggleProduct = (id: string) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(products.map(p => p.id))
    }
  }

  const handleCreate = async () => {
    setError('')
    setSuccess('')

    if (!code.trim()) return setError('Coupon code is required')
    if (!discount || Number(discount) < 1 || Number(discount) > 100)
      return setError('Discount must be between 1 and 100')
    if (!appliesToAll && selectedProducts.length === 0)
      return setError('Select at least one product or choose All Products')

    setSubmitting(true)
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify({
          code,
          discount: Number(discount),
          appliesToAll,
          products: appliesToAll ? [] : selectedProducts,
        }),
      })
      const data = await res.json()
      if (!res.ok) return setError(data.error || 'Failed to create coupon')

      setSuccess('Coupon created successfully!')
      setCode('')
      setDiscount('')
      setAppliesToAll(false)
      setSelectedProducts([])
      fetchAll()
    } catch (e) {
      setError('Network error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
  if (!confirm('Delete this coupon?')) return
  try {
    await fetch('/api/coupons/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader },
      body: JSON.stringify({ id }),
    })
    fetchAll()
  } catch (e) {
    console.error('[deleteCoupon] error:', e)
  }
}

  const handleToggleCoupon = async (id: string) => {
  try {
    await fetch('/api/coupons/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader },
      body: JSON.stringify({ id }),
    })
    fetchAll()
  } catch (e) {
    console.error('[toggleCoupon] error:', e)
  }
}

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f8f7f4' }}>
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8" style={{ background: '#f8f7f4' }}>
      <div className="max-w-4xl mx-auto space-y-6">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Tag size={22} style={{ color: '#c9a96e' }} />
            <h1 className="text-xl font-bold text-gray-900">Coupon System</h1>
          </div>
          <button
            onClick={() => router.push(`/${locale}/admin/dashboard`)}
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-800">Enable Coupon System</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {globalEnabled
                ? 'Coupons are active across the store'
                : 'All coupons are disabled globally'}
            </p>
          </div>
          <button onClick={handleToggleGlobal}>
            {globalEnabled
              ? <ToggleRight size={40} style={{ color: '#c9a96e' }} />
              : <ToggleLeft size={40} className="text-gray-300" />}
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <h2 className="font-semibold text-gray-700 flex items-center gap-2">
            <Plus size={16} /> Create New Coupon
          </h2>

          {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-lg">{error}</p>}
          {success && <p className="text-green-600 text-sm bg-green-50 px-4 py-2 rounded-lg">{success}</p>}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1">Coupon Code</label>
              <input
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. SAVE20"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-300 font-mono tracking-widest"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1">Discount %</label>
              <input
                type="number"
                value={discount}
                onChange={e => setDiscount(e.target.value)}
                placeholder="e.g. 15"
                min={1}
                max={100}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-300"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium block mb-2">Apply To</label>
            <label className="flex items-center gap-2 mb-3 cursor-pointer w-fit">
              <input
                type="checkbox"
                checked={appliesToAll}
                onChange={e => {
                  setAppliesToAll(e.target.checked)
                  if (e.target.checked) setSelectedProducts([])
                }}
                className="w-4 h-4 accent-amber-500"
              />
              <span className="text-sm font-medium text-gray-700">All Products</span>
            </label>

            {!appliesToAll && (
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-100 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === products.length && products.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 accent-amber-500"
                  />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Select All ({products.length} products)
                  </span>
                </div>
                <div className="max-h-56 overflow-y-auto divide-y divide-gray-50">
                  {products.length === 0 ? (
                    <p className="text-sm text-gray-300 p-4 text-center">No products found</p>
                  ) : (
                    products.map(p => (
                      <label
                        key={p.id}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-amber-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(p.id)}
                          onChange={() => handleToggleProduct(p.id)}
                          className="w-4 h-4 accent-amber-500"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-700 font-medium truncate">{getField(p.name)}</p>
                          <p className="text-xs text-gray-400">{getField(p.brand)}</p>
                        </div>
                      </label>
                    ))
                  )}
                </div>
                {selectedProducts.length > 0 && (
                  <div className="bg-amber-50 px-4 py-2 text-xs font-medium" style={{ color: '#c9a96e' }}>
                    {selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} selected
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleCreate}
            disabled={submitting}
            className="w-full py-2.5 rounded-xl text-white text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: '#c9a96e' }}
          >
            {submitting ? 'Creating...' : '+ Create Coupon'}
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-700">Active Coupons ({coupons.length})</h2>
          </div>
          {coupons.length === 0 ? (
            <div className="p-10 text-center text-gray-300 text-sm">No coupons yet</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {coupons.map(coupon => (
                <div key={coupon._id} className="px-6 py-4 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono font-bold text-gray-900 tracking-widest text-sm">
                        {coupon.code}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          background: coupon.isActive ? '#fef3c7' : '#f3f4f6',
                          color: coupon.isActive ? '#92400e' : '#9ca3af',
                        }}
                      >
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-xs font-bold" style={{ color: '#c9a96e' }}>
                        -{coupon.discount}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Applies to:{' '}
                      {coupon.appliesToAll ? (
                        <span className="font-medium text-gray-600">All Products</span>
                      ) : (
                        <span className="font-medium text-gray-600">
                          {coupon.products.map(p => getField(p.name)).join(', ') || 'No products'}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleCoupon(coupon._id)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600"
                    >
                      {coupon.isActive ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => handleDelete(coupon._id)}
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 border border-red-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
