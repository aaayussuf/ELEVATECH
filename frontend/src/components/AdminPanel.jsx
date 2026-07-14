import React, { useEffect, useState } from 'react'
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  AlertTriangle,
  Layers,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  ChevronRight,
  X,
  Sparkles,
  Shield,
  RefreshCw,
  Lock,
  ShieldAlert,
  KeyRound,
  ArrowRight,
  UserCheck,
  Database,
  Terminal,
  FileText,
  Download,
  Play
} from 'lucide-react'

import AnalyticsCharts from './AnalyticsCharts'

export default function AdminPanel({
  products,
  orders,
  stats,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  refreshData,
  currentUser,
  onLoginClick
}) {
  const [activeTab, setActiveTab] = useState('overview')

  // Owner / Manager corporate verification state
  const [managerPasscode, setManagerPasscode] = useState('')
  const [isManagerAuthorized, setIsManagerAuthorized] = useState(() => {
    return sessionStorage.getItem('bxtech_manager_auth') === 'true'
  })
  const [authError, setAuthError] = useState('')

  // Auto-authorize if logged in as official owner
  useEffect(() => {
    if (currentUser?.email === 'bxtech36@gmail.com') {
      setIsManagerAuthorized(true)
      sessionStorage.setItem('bxtech_manager_auth', 'true')
    }
  }, [currentUser])

  const handlePasscodeSubmit = (e) => {
    e.preventDefault()
    setAuthError('')

    const code = managerPasscode.trim()
    if (code === 'BX2026' || code === 'admin123') {
      setIsManagerAuthorized(true)
      sessionStorage.setItem('bxtech_manager_auth', 'true')
      setManagerPasscode('')
    } else {
      setAuthError('Invalid administrative passcode. Please verify corporate credentials.')
    }
  }

  // PostgreSQL Interactive Sandbox States
  const [sqlQuery, setSqlQuery] = useState(
    'SELECT brand, COUNT(*), SUM(price) AS total_value, AVG(stock) AS avg_stock FROM products GROUP BY brand ORDER BY total_value DESC;'
  )
  const [sqlResponse, setSqlResponse] = useState(null)
  const [sqlLoading, setSqlLoading] = useState(false)
  const [sqlErrorState, setSqlErrorState] = useState('')
  const [selectedSchemaTable, setSelectedSchemaTable] = useState('products')

  const executePostgreSQLQuery = async (queryToRun) => {
    const q = queryToRun || sqlQuery
    setSqlLoading(true)
    setSqlErrorState('')

    try {
      const res = await fetch('/api/sql/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q })
      })

      const data = await res.json()
      if (data.success) {
        setSqlResponse(data)
      } else {
        setSqlErrorState(data.error || 'Syntax error or table structure mismatch.')
        setSqlResponse(null)
      }
    } catch (err) {
      setSqlErrorState(err?.message || 'Failed to dispatch SQL query to PostgreSQL instance.')
      setSqlResponse(null)
    } finally {
      setSqlLoading(false)
    }
  }

  // Auto-run first query when switching to tab
  useEffect(() => {
    if (activeTab === 'sql' && !sqlResponse && !sqlErrorState && !sqlLoading) {
      executePostgreSQLQuery()
    }
  }, [activeTab])

  // Modals / Form States
  const [showProductModal, setShowProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  // Product Form Fields
  const [prodName, setProdName] = useState('')
  const [prodBrand, setProdBrand] = useState('')
  const [prodCategory, setProdCategory] = useState('Laptops')
  const [prodCondition, setProdCondition] = useState('Ex-UK')
  const [prodPrice, setProdPrice] = useState('')
  const [prodStock, setProdStock] = useState('')
  const [prodImage, setProdImage] = useState('')
  const [prodDesc, setProdDesc] = useState('')
  const [prodFeatured, setProdFeatured] = useState(false)

  // Specs form states (Dynamic specs helper)
  const [specCpu, setSpecCpu] = useState('')
  const [specRam, setSpecRam] = useState('')
  const [specStorage, setSpecStorage] = useState('')
  const [specDisplay, setSpecDisplay] = useState('')
  const [specWarranty, setSpecWarranty] = useState('6 Months Shop Warranty')

  // Order Filters
  const [orderStatusFilter, setOrderStatusFilter] = useState('all')
  const [expandedOrder, setExpandedOrder] = useState(null)

  // Search
  const [productSearch, setProductSearch] = useState('')

  // Pre-populate fields on edit
  useEffect(() => {
    if (editingProduct) {
      setProdName(editingProduct.name)
      setProdBrand(editingProduct.brand)
      setProdCategory(editingProduct.category)
      setProdCondition(editingProduct.condition)
      setProdPrice(editingProduct.price?.toString?.() ?? '')
      setProdStock(editingProduct.stock?.toString?.() ?? '')
      setProdImage(editingProduct.imageUrl)
      setProdDesc(editingProduct.description)
      setProdFeatured(!!editingProduct.featured)

      // Specs
      const specs = editingProduct.specs || {}
      setSpecCpu(specs['Processor'] || specs['Print Technology'] || specs['Brightness'] || '')
      setSpecRam(specs['RAM'] || specs['Functionality'] || specs['Native Resolution'] || '')
      setSpecStorage(specs['Storage'] || specs['Connectivity'] || '')
      setSpecDisplay(specs['Display'] || specs['Duplex Printing'] || '')
      setSpecWarranty(specs['Warranty'] || '6 Months Shop Warranty')
    } else {
      // Clear fields
      setProdName('')
      setProdBrand('')
      setProdCategory('Laptops')
      setProdCondition('Ex-UK')
      setProdPrice('')
      setProdStock('')
      setProdImage('')
      setProdDesc('')
      setProdFeatured(false)
      setSpecCpu('')
      setSpecRam('')
      setSpecStorage('')
      setSpecDisplay('')
      setSpecWarranty('6 Months Shop Warranty')
    }
  }, [editingProduct, showProductModal])

  const formatPrice = (price) => {
    if (typeof price !== 'number') return price
    return `KSh ${price.toLocaleString()}`
  }

  const handleProductSubmit = async (e) => {
    e.preventDefault()

    // Assemble specs based on category
    const specs = {}
    if (prodCategory === 'Laptops' || prodCategory === 'Computers') {
      specs['Processor'] = specCpu || 'N/A'
      specs['RAM'] = specRam || 'N/A'
      specs['Storage'] = specStorage || 'N/A'
      if (specDisplay) specs['Display'] = specDisplay
    } else if (prodCategory === 'Printers') {
      specs['Print Technology'] = specCpu || 'Laser'
      specs['Functionality'] = specRam || 'Print Only'
      specs['Connectivity'] = specStorage || 'USB & Ethernet'
      if (specDisplay) specs['Duplex Printing'] = specDisplay
    } else if (prodCategory === 'Projectors') {
      specs['Brightness'] = specCpu || '3000 Lumens'
      specs['Native Resolution'] = specRam || 'XGA'
      specs['Connectivity'] = specStorage || 'HDMI, VGA'
    }
    specs['Warranty'] = specWarranty || '6 Months Shop Warranty'

    const productPayload = {
      name: prodName,
      brand: prodBrand,
      category: prodCategory,
      condition: prodCondition,
      price: Number(prodPrice),
      description: prodDesc,
      stock: Number(prodStock),
      imageUrl:
        prodImage || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600',
      featured: prodFeatured,
      specs
    }

    let success = false
    if (editingProduct) {
      success = await onEditProduct(editingProduct.id, productPayload)
    } else {
      success = await onAddProduct(productPayload)
    }

    if (success) {
      setShowProductModal(false)
      setEditingProduct(null)
      refreshData?.()
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you absolutely sure you want to delete this item from shop inventory?')) {
      const success = await onDeleteProduct(id)
      if (success) refreshData?.()
    }
  }

  const handleStatusChange = async (orderId, status) => {
    const success = await onUpdateOrderStatus(orderId, status)
    if (success) refreshData?.()
  }

  // Filter products by search
  const filteredProducts = (products || []).filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase())
  )

  // Filter orders by status
  const filteredOrders = orderStatusFilter === 'all' ? orders || [] : (orders || []).filter((o) => o.status === orderStatusFilter)

  if (!isManagerAuthorized) {
    return (
      <div className="max-w-xl mx-auto space-y-6 py-12" id="admin-auth-gate">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl text-center space-y-6 animate-scale-in">
          <div className="flex justify-center">
            <div className="bg-slate-900 text-amber-400 p-4 rounded-full border border-slate-800 shadow-md">
              <Lock className="h-10 w-10 animate-pulse" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-slate-950 font-display font-extrabold text-xl tracking-tight">Executive Vault Locked</h2>
            <p className="text-slate-500 text-xs max-w-sm mx-auto leading-relaxed">
              This panel is protected by corporate governance. Only verified company managers or BX Tech owners may inspect store sales
              graphs, alter physical inventories, or manage delivery statuses.
            </p>
          </div>

          <form onSubmit={handlePasscodeSubmit} className="space-y-4 max-w-xs mx-auto">
            {authError && (
              <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold rounded-xl flex items-start gap-1.5 text-left animate-shake">
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <div className="space-y-1 text-left">
              <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block text-center">
                Manager Security PIN
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400">
                  <KeyRound className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="Enter Passcode (e.g. BX2026)"
                  value={managerPasscode}
                  onChange={(e) => setManagerPasscode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-950 pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-center tracking-widest font-mono"
                  id="manager-pin-input"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow"
            >
              <span>Unlock Back-Office</span>
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </button>
          </form>

          {!currentUser ? (
            <div className="pt-4 border-t border-slate-100">
              <p className="text-[11px] font-bold text-slate-400">Are you the business owner?</p>
              <button
                onClick={onLoginClick}
                className="mt-2 px-4 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-[11px] font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 border border-blue-100"
                id="owner-gate-login-btn"
              >
                <UserCheck className="h-3.5 w-3.5" />
                <span>Log In as Owner (bxtech36@gmail.com)</span>
              </button>
            </div>
          ) : currentUser.email !== 'bxtech36@gmail.com' ? (
            <div className="p-3.5 bg-amber-50 rounded-xl text-[10.5px] leading-normal text-amber-800 font-semibold border border-amber-100">
              👋 Currently authenticated as <strong className="text-amber-900">{currentUser.name}</strong>. Sign in as{' '}
              <strong className="text-blue-700">bxtech36@gmail.com</strong> for automatic executive access, or supply the corporate lock
              passcode.
            </div>
          ) : null}
        </div>
      </div>
    )
  }

  return <div className="space-y-6" id="admin-panel-container"></div>
}

