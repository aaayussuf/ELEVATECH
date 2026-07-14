import React, { useState } from 'react'
import { api } from '../lib/api'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState({ type: null, msg: '' })

  const submit = async (e) => {
    e.preventDefault()
    setStatus({ type: null, msg: '' })
    try {
      await request('/public/contact', form)
      setStatus({ type: 'ok', msg: 'Message sent. We will reach out soon.' })
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      setStatus({ type: 'err', msg: err.message })
    }
  }

  // small helper so we don't expand api.js for demo
  const request = (path, payload) =>
    fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(async (res) => {
      const t = await res.text()
      const data = t ? JSON.parse(t) : null
      if (!res.ok) throw new Error(data?.message || `Request failed: ${res.status}`)
      return data
    })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Contact</h1>

      <form onSubmit={submit} className="max-w-xl space-y-4 rounded-xl border p-6">
        <div>
          <label className="text-sm text-gray-600">Name</label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">Message</label>
          <textarea
            className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring"
            rows={5}
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          />
        </div>

        {status.msg && (
          <div className={status.type === 'ok' ? 'text-green-700' : 'text-red-700'}>
            {status.msg}
          </div>
        )}

        <button className="rounded bg-gray-900 px-4 py-2 text-white font-semibold hover:bg-black" type="submit">
          Send message
        </button>
      </form>
    </div>
  )
}

