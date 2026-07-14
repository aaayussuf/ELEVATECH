import React, { useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import { Link, useLocation } from 'react-router-dom'

function useQuery() {
  const { search } = useLocation()
  return useMemo(() => new URLSearchParams(search), [search])
}

export default function ProductsPage() {
  const query = useQuery()
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  const category = query.get('category') || ''
  const [searchTerm, setSearchTerm] = useState(query.get('q') || '')

  useEffect(() => {
    setLoading(true)
    api
      .listProducts({ category: category || undefined, q: searchTerm || undefined })
      .then((d) => setItems(d.items || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [category, searchTerm])

  if (loading) return <div className="text-gray-600">Loading...</div>
  if (error) return <div className="text-red-600">{error}</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <div className="text-sm text-gray-600 mt-1">
            {category ? `Category: ${category}` : 'All categories'}
          </div>
        </div>

        <div className="w-full md:w-80">
          <label className="text-sm text-gray-600">Search</label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search product name..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((p) => (
          <Link
            key={p.id}
            to={`/products/${p.slug}`}
            className="group rounded-xl border p-4 hover:shadow transition"
          >
            <div className="aspect-[4/3] rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
              {p.imageUrl ? (
                <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover rounded-lg" />
              ) : (
                <span>Image</span>
              )}
            </div>
            <div className="mt-3 font-semibold text-sm group-hover:text-gray-900">{p.name}</div>
            <div className="text-sm text-gray-600 mt-1">
              {p.currency} {p.price}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

