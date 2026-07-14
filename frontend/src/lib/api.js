const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'

async function requestJson(path, { method = 'GET', body, headers = {} } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined
  })

  const text = await res.text()
  const data = text ? JSON.parse(text) : null

  if (!res.ok) {
    const message = data?.message || `Request failed: ${res.status}`
    throw new Error(message)
  }
  return data
}

export const api = {
  getHome: () => requestJson('/public/home'),
  getAbout: () => requestJson('/public/about'),
  getContact: () => requestJson('/public/contact'),
  getCategories: () => requestJson('/categories'),
  listProducts: (params = {}) => {
    const qs = new URLSearchParams(params)
    const q = qs.toString()
    return requestJson(`/products${q ? `?${q}` : ''}`)
  },
  productDetail: (slug) => requestJson(`/products/${slug}`),

  register: (payload) => requestJson('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => requestJson('/auth/login', { method: 'POST', body: payload }),
  me: (token) =>
    requestJson('/auth/me', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    }),

  cart: {
    get: () => requestJson('/cart'),
    add: (productId, quantity = 1) =>
      requestJson('/cart/add', { method: 'POST', body: { productId, quantity } }),
    update: (productId, quantity) =>
      requestJson('/cart/update', { method: 'POST', body: { productId, quantity } }),
    clear: () => requestJson('/cart/clear', { method: 'POST' })
  },

  adminCreateProduct: (token, payload) =>
    requestJson('/admin/products', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: payload
    }),

  // could extend for update/delete later
}

