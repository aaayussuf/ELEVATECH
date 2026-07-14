import React, { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { useParams } from 'react-router-dom'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState(null)
  const [error, setError] = useState('')
  const [qty, setQty] = useState(1)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    setLoading(true)
    api
      .productDetail(slug)
      .then((d) => setProduct(d))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [slug])

  const addToCart = async () => {
    try {
      setAdding(true)
      await api.cart.add(product.id, qty)
      // keep it simple: user will go to cart manually
    } catch (e) {
      setError(e.message)
    } finally {
      setAdding(false)
    }
  }

  if (loading) return <div className="text-gray-600">Loading...</div>
  if (error) return <div className="text-red-600">{error}</div>
  if (!product) return <div>Not found</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <div className="aspect-[4/3] rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-gray-400">Image</span>
            )}
          </div>
        </div>
        <div className="md:w-1/2">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="text-gray-600 mt-2">
            {product.currency} {product.price}
          </div>
          <div className="text-sm text-gray-500 mt-1">Stock: {product.stock}</div>

          <p className="mt-4 text-gray-700">{product.description}</p>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                className="rounded border px-3 py-1"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                -
              </button>
              <div className="w-10 text-center">{qty}</div>
              <button
                className="rounded border px-3 py-1"
                onClick={() => setQty((q) => q + 1)}
              >
                +
              </button>
            </div>

            <button
              disabled={adding}
              onClick={addToCart}
              className="rounded bg-gray-900 px-4 py-2 text-white font-semibold hover:bg-black disabled:opacity-60"
            >
              {adding ? 'Adding...' : 'Add to cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

