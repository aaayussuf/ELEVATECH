import React from 'react'

// Placeholder component.
// AdminPanel imports this file, but it was missing from the repo, causing Vite to fail.
export default function AnalyticsCharts({ stats }) {
  const safeStats = stats || {}

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-[11px] font-extrabold tracking-widest text-slate-500 uppercase">Total Revenue</div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">{safeStats.totalRevenue ?? 0}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-[11px] font-extrabold tracking-widest text-slate-500 uppercase">Total Orders</div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">{safeStats.totalOrders ?? 0}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-[11px] font-extrabold tracking-widest text-slate-500 uppercase">Pending Orders</div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">{safeStats.pendingOrders ?? 0}</div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-[11px] font-extrabold tracking-widest text-slate-500 uppercase">Low Stock (placeholder)</div>
        <div className="mt-2 text-lg font-extrabold text-slate-900">
          {safeStats.lowStockCount ?? 0}
        </div>
        <div className="mt-2 text-sm text-slate-500">
          Analytics charts UI is not yet implemented in this repo. This component prevents build failures until charts are added.
        </div>
      </div>
    </div>
  )
}

