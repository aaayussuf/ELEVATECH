import React, { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { Link } from 'react-router-dom'

export default function CategoriesPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({ items: [] })
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .getCategories()
      .then((d) => setData(d))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-gray-600">Loading...</div>
  if (error) return <div className="text-red-600">{error}</div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Categories</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.items.map((c) => (
          <Link
            key={c.id}
            to={`/products?category=${c.slug}`}
            className="rounded-xl border p-4 hover:bg-gray-50 transition"
          >
            <div className="font-semibold">{c.name}</div>
            <div className="text-xs text-gray-500 mt-1">{c.slug}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

