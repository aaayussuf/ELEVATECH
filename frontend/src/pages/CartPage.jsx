import React, { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function CartPage() {
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState({ items: [], total: '0' })
  const [error, setError] = useState('')

  const refresh = () => {
    setLoading(true)
    api.cart
      .get()
      .then((d) => setCart(d))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    refresh()
  }, [])

  const updateQty = (productId, quantity) => {
    api.cart
      .update(productId, quantity)
      .then((d) => setCart(d))
      .catch((e) => setError(e.message))
  }

  const clear = () => {
    api.cart
      .clear()
      .then((d) => setCart(d))
      .catch((e) => setError(e.message))
  }

  if (loading) return <div className="text-gray-600">Loading...</div>
  if (error) return <div className="text-red-600">{error}</div>

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Cart</h1>
          <div className="text-sm text-gray-600 mt-1">No checkout (demo)</div>
        </div>
        <button
          onClick={clear}
          className="rounded border px-3 py-2 text-sm hover:bg-gray-50"
        >
          Clear cart
        </button>
      </div>

      {cart.items.length === 0 ? (
        <div className="rounded-xl border p-8 text-gray-600">Your cart is empty.</div>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <div className="divide-y">
            {cart.items.map((it) => (
              <div key={it.product.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="h-20 w-20 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                  {it.product.imageUrl ? (
                    <img src={it.product.imageUrl} alt={it.product.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xs text-gray-400">Image</span>
                  )}
                </div>

                <div className="flex-1">
                  <div className="font-semibold">{it.product.name}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Unit: {it.product.currency} {it.product.price}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="rounded border px-3 py-1"
                    onClick={() => updateQty(it.product.id, it.quantity - 1)}
                  >
                    -
                  </button>
                  <div className="w-10 text-center">{it.quantity}</div>
                  <button
                    className="rounded border px-3 py-1"
                    onClick={() => updateQty(it.product.id, it.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <div className="text-sm font-semibold">
                  Line: {it.product.currency} {it.lineTotal}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t flex items-center justify-end gap-4">
            <div className="text-gray-600">Total</div>
            <div className="font-bold">{cart.total}</div>
          </div>
        </div>
      )}
    </div>
  )
}

