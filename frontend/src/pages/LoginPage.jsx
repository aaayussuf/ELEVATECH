import React, { useState } from 'react'
import { api } from '../lib/api'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [status, setStatus] = useState({ type: null, msg: '' })
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setStatus({ type: null, msg: '' })
    try {
      const d = await api.login(form)
      localStorage.setItem('token', d.token)
      localStorage.setItem('role', d.role)
      setStatus({ type: 'ok', msg: 'Logged in.' })
      navigate('/')
    } catch (err) {
      setStatus({ type: 'err', msg: err.message })
    }
  }

  return (
    <div className="max-w-md space-y-6">
      <h1 className="text-2xl font-bold">Login</h1>

      <form onSubmit={submit} className="space-y-4 rounded-xl border p-6">
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">Password</label>
          <input
            type="password"
            className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          />
        </div>

        {status.msg && (
          <div className={status.type === 'ok' ? 'text-green-700' : 'text-red-700'}>
            {status.msg}
          </div>
        )}

        <button className="w-full rounded bg-gray-900 px-4 py-2 text-white font-semibold hover:bg-black" type="submit">
          Login
        </button>
      </form>

      <div className="text-sm text-gray-500">
        No account? Use the register endpoint in the backend (or extend UI).
      </div>
    </div>
  )
}

