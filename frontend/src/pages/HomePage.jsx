import React, { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { Link } from 'react-router-dom'

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({ featured: [], categories: [] })
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    api
      .getHome()
      .then((d) => {
        if (!alive) return
        setData(d)
        setError('')
      })
      .catch((e) => {
        if (!alive) return
        setError(e.message)
      })
      .finally(() => {
        if (!alive) return
        setLoading(false)
      })

    return () => {
      alive = false
    }
  }, [])

  if (loading) return <div className="text-gray-600">Loading...</div>
  if (error) return <div className="text-red-600">{error}</div>

  return (
    <div className="space-y-10">
      <section className="rounded-xl border bg-gray-50 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Electronics for work & play</h1>
            <p className="text-gray-600 mt-1">Band & EXUK laptops • Printers • Scanners • Mobile phones</p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center justify-center rounded bg-gray-900 px-4 py-2 text-white text-sm font-semibold"
          >
            Browse Products
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Featured</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.featured.map((p) => (
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
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {data.categories.map((c) => (
            <Link
              key={c.id}
              to={`/products?category=${c.slug}`}
              className="rounded-full border px-4 py-2 text-sm hover:bg-gray-50"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

