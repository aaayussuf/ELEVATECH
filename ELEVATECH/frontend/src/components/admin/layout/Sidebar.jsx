import { NavLink } from "react-router-dom";

const menu = [
  { name: "Dashboard", path: "/admin" },
  { name: "Products", path: "/admin/products" },
  { name: "Inventory", path: "/admin/inventory" },
  { name: "Orders", path: "/admin/orders" },
  { name: "Customers", path: "/admin/customers" },
  { name: "Categories", path: "/admin/categories" },
  { name: "Coupons", path: "/admin/coupons" },
  { name: "Reports", path: "/admin/reports" },
  { name: "Settings", path: "/admin/settings" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen">
      <div className="p-6 text-2xl font-bold border-b border-slate-700">
        ElevaTech
      </div>

      <nav className="mt-6 flex flex-col">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/admin"}
            className={({ isActive }) =>
              `px-6 py-3 transition ${
                isActive
                  ? "bg-blue-600"
                  : "hover:bg-slate-800"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

