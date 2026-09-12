import { useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Heart, Home, LayoutGrid, ShoppingCart, User } from "lucide-react";
import { CartContext } from "../../context/CartContext";

/* Thumb-friendly bottom navigation for phones.
   Hidden on tablet/desktop where the full navbar is comfortable. */
export default function MobileBottomNav() {
  const { totalItems } = useContext(CartContext);
  const { pathname, search } = useLocation();
  const query = search || "";

  const items = [
    { to: "/", label: "Home", icon: Home, active: pathname === "/" },
    {
      to: "/products",
      label: "Shop",
      icon: LayoutGrid,
      active: pathname === "/products" && !query.includes("featured"),
    },
    {
      to: "/products?featured=true",
      label: "Deals",
      icon: Heart,
      active: query.includes("featured"),
    },
    { to: "/cart", label: "Cart", icon: ShoppingCart, active: pathname === "/cart", badge: totalItems },
    { to: "/account", label: "Account", icon: User, active: pathname.startsWith("/account") },
  ];

  return (
    <nav
      aria-label="Mobile navigation"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-white/10 bg-[#050B14]/95 backdrop-blur-2xl mobile-bottom-nav"
    >
      <div className="mx-auto grid max-w-lg grid-cols-5 px-1">
        {items.map(({ to, label, icon: Icon, active, badge }) => (
          <NavLink
            key={label}
            to={to}
            className={`relative flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-bold transition ${
              active ? "text-yellow-400" : "text-slate-400 hover:text-white"
            }`}
          >
            <span className="relative">
              <Icon size={22} />
              {badge > 0 && (
                <span className="absolute -right-2.5 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-yellow-400 px-1 text-[10px] font-black text-black">
                  {badge > 99 ? "99+" : badge}
                </span>
              )}
              {active && (
                <span className="absolute -bottom-2 left-1/2 h-1 w-6 -translate-x-1/2 rounded-full bg-yellow-400" />
              )}
            </span>
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
