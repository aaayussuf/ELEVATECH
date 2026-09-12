import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, ClipboardList, Users, Tags, TicketPercent, Truck, ShoppingCart, Menu, X } from "lucide-react";

const menu = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard, end: true },
  { name: "Products", path: "/admin/products", icon: Package },
  { name: "Inventory", path: "/admin/inventory", icon: ClipboardList },
  { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
  { name: "Customers", path: "/admin/customers", icon: Users },
  { name: "Categories", path: "/admin/categories", icon: Tags },
  { name: "Coupons", path: "/admin/coupons", icon: TicketPercent },
  { name: "Suppliers", path: "/admin/suppliers", icon: Truck },
  { name: "Purchase Orders", path: "/admin/purchase-orders", icon: ClipboardList },
];

function SidebarContent({ onNavigate }) {
  return (
    <>
      <div className="p-6 text-2xl font-bold border-b border-slate-700">
        ElevaTech
      </div>

      <nav className="mt-6 flex flex-col pb-6">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                `px-6 py-3.5 min-h-[48px] flex items-center gap-3 transition ${
                  isActive
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-slate-200 hover:bg-slate-800"
                }`
              }
            >
              {Icon && <Icon size={18} className="shrink-0" />}
              {item.name}
            </NavLink>
          );
        })}
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


