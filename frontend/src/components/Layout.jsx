import React, { useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'

function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      className="text-sm font-medium text-gray-700 hover:text-gray-900"
    >
      {children}
    </Link>
  )
}

export default function Layout() {
  const [auth, setAuth] = useState({ role: null })
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    setAuth({ role: token ? role : null })
  }, [location.pathname])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    setAuth({ role: null })
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded bg-gray-900 text-white flex items-center justify-center font-bold">
              BX
            </div>
            <div className="leading-tight">
              <div className="font-semibold">BX Tech Digital World</div>
              <div className="text-xs text-gray-500">Laptops • Band • Printers • Phones</div>
            </div>
          </div>

          <nav className="flex items-center gap-6">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/categories">Categories</NavLink>
            <NavLink to="/products">Products</NavLink>
            <NavLink to="/cart">Cart</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>

            {auth.role ? (
              <>
                {auth.role === 'admin' && <NavLink to="/admin/products">Admin</NavLink>}
                <button
                  onClick={logout}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink to="/login">Login</NavLink>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-gray-500">
          © {new Date().getFullYear()} BX Tech Digital World
        </div>
      </footer>
    </div>
  )
}

