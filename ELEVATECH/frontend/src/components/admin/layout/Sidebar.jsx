import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { LayoutDashboard, Package, ClipboardList, Users, Tags, TicketPercent, Truck, ShoppingCart, Menu, X, KanbanSquare, Store } from "lucide-react";

const sections = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", path: "/admin", icon: LayoutDashboard, end: true },
      { name: "Order Board", path: "/admin/orders/board", icon: KanbanSquare },
    ],
  },
  {
    title: "Sales",
    items: [
      { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
      { name: "Customers", path: "/admin/customers", icon: Users },
      { name: "Coupons", path: "/admin/coupons", icon: TicketPercent },
    ],
  },
  {
    title: "Catalog",
    items: [
      { name: "Products", path: "/admin/products", icon: Package },
      { name: "Categories", path: "/admin/categories", icon: Tags },
      { name: "Inventory", path: "/admin/inventory", icon: ClipboardList },
    ],
  },
  {
    title: "Procurement",
    items: [
      { name: "Suppliers", path: "/admin/suppliers", icon: Truck },
      { name: "Purchase Orders", path: "/admin/purchase-orders", icon: ClipboardList },
    ],
  },
];

function SidebarContent({ onNavigate }) {
  return (
    <>
      <Link to="/admin" onClick={onNavigate} className="flex items-center gap-3 p-6 border-b border-white/10">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-amber-500 text-xl font-black text-slate-900 shadow-lg shadow-amber-500/30">
          E
        </span>
        <span>
          <span className="block text-lg font-black leading-tight tracking-tight">ElevaTech</span>
          <span className="block text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300/90">
            Admin Suite
          </span>
        </span>
      </Link>

      <nav className="mt-4 flex flex-col gap-5 px-3 pb-8">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="px-3 mb-2 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
              {section.title}
            </p>
            <div className="flex flex-col gap-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `min-h-[46px] flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${isActive
                        ? "bg-amber-400 text-slate-900 font-extrabold shadow-lg shadow-amber-500/25"
                        : "text-slate-200 hover:bg-white/10 hover:text-white"
                      }`
                    }
                  >
                    {Icon && <Icon size={18} className="shrink-0" />}
                    {item.name}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}

        <Link
          to="/"
          className="mt-2 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm font-bold text-slate-200 hover:bg-white/10"
        >
          <Store size={18} className="shrink-0 text-amber-300" />
          View Storefront
        </Link>
      </nav>
    </>
  );
}

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile drawer trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open admin menu"
        className="lg:hidden fixed bottom-24 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-2xl"
      >
        <Menu size={22} />
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 xl:w-72 shrink-0 bg-slate-900 text-white min-h-screen sticky top-0 h-screen overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin menu">
          <button
            type="button"
            aria-label="Close admin menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/60"
          />
          <aside className="absolute inset-y-0 left-0 w-[84%] max-w-xs overflow-y-auto bg-slate-900 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-700 p-4 pl-6">
              <span className="font-bold">Menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close admin menu"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10"
              >
                <X size={20} />
              </button>
            </div>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}


