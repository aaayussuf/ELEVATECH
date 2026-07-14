import React, { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function AboutPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({ title: '', content: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .getAbout()
      .then((d) => setData(d))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-gray-600">Loading...</div>
  if (error) return <div className="text-red-600">{error}</div>

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{data.title}</h1>
      <p className="text-gray-700">{data.content}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border p-4">
          <div className="font-semibold">Quality</div>
          <div className="text-sm text-gray-600 mt-1">Genuine products and reliable performance.</div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="font-semibold">Support</div>
          <div className="text-sm text-gray-600 mt-1">Help when you need it—before and after purchase.</div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="font-semibold">Value</div>
          <div className="text-sm text-gray-600 mt-1">Competitive pricing across our catalog.</div>
        </div>
      </div>
    </div>
  )
}

