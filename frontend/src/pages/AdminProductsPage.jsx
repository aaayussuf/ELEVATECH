import React, { useState } from 'react'
import { api } from '../lib/api'

export default function AdminProductsPage() {
  const [form, setForm] = useState({ name: '', slug: '', price: '', currency: 'USD', stock: 10, description: '' })
  const [status, setStatus] = useState({ type: null, msg: '' })

  const create = async (e) => {
    e.preventDefault()
    setStatus({ type: null, msg: '' })
    try {
      const token = localStorage.getItem('token')
      await api.adminCreateProduct(token, {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock)
      })
      setStatus({ type: 'ok', msg: 'Product created (if slug is unique).' })
      setForm({ name: '', slug: '', price: '', currency: 'USD', stock: 10, description: '' })
    } catch (err) {
      setStatus({ type: 'err', msg: err.message })
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Admin - Create Product</h1>
      <form onSubmit={create} className="space-y-4 rounded-xl border p-6">
        <div>
          <label className="text-sm text-gray-600">Name</label>
          <input className="mt-1 w-full rounded-lg border px-3 py-2" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        </div>
        <div>
          <label className="text-sm text-gray-600">Slug</label>
          <input className="mt-1 w-full rounded-lg border px-3 py-2" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="e.g. exuk-laptop-14" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Price</label>
            <input className="mt-1 w-full rounded-lg border px-3 py-2" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm text-gray-600">Stock</label>
            <input className="mt-1 w-full rounded-lg border px-3 py-2" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} />
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-600">Description</label>
          <textarea className="mt-1 w-full rounded-lg border px-3 py-2" rows={4} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
        </div>

        {status.msg && (
          <div className={status.type === 'ok' ? 'text-green-700' : 'text-red-700'}>
            {status.msg}
          </div>
        )}

        <button className="rounded bg-gray-900 px-4 py-2 text-white font-semibold hover:bg-black" type="submit">
          Create product
        </button>
      </form>
    </div>
  )
}

