import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Heart,
  MapPinned,
  Package,
  Plus,
  ShoppingCart,
} from "lucide-react";

import { AuthContext } from "../../context/AuthContext";
import AccountLayout from "../../layouts/AccountLayout";
import accountService from "../../services/accountService";
import OrderCard from "../../components/account/OrderCard";

const statCards = [
  {
    label: "Total Orders",
    href: "/account/orders",
    icon: Package,
    chip: "from-blue-500 to-cyan-400",
  },
  {
    label: "Wishlist Items",
    href: "/account/wishlist",
    icon: Heart,
    chip: "from-pink-500 to-rose-400",
  },
  {
    label: "Saved Addresses",
    href: "/account/addresses",
    icon: MapPinned,
    chip: "from-yellow-400 to-amber-500",
  },
];

export default function Dashboard() {
  const { user, token, isLoading, logout } = useContext(AuthContext);

  const [stats, setStats] = useState({
    totalOrders: 0,
    wishlistCount: 0,
    savedAddresses: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentWishlist, setRecentWishlist] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);

        const [ordersRes, addressesRes, wishlistRes] = await Promise.all([
          accountService.getOrders(token).catch(() => []),
          accountService.getAddresses(token).catch(() => []),
          accountService.getWishlist(token).catch(() => []),
        ]);

        const ordersList = Array.isArray(ordersRes) ? ordersRes : [];
        const addressesList = Array.isArray(addressesRes) ? addressesRes : [];
        const wishlistList = Array.isArray(wishlistRes) ? wishlistRes : [];

        if (!mounted) return;

        setStats({
          totalOrders: ordersList.length,
          wishlistCount: wishlistList.length,
          savedAddresses: addressesList.length,
        });

        setRecentOrders(ordersList.slice(0, 100).slice(0, 4));
        setRecentWishlist(wishlistList.slice(0, 3));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (!isLoading && token) load();

    return () => {
      mounted = false;
    };
  }, [isLoading, token]);

  const statValues = [
    stats.totalOrders,
    stats.wishlistCount,
    stats.savedAddresses,
  ];

  return (
<AccountLayout user={user} onLogout={logout}>
      <div className="space-y-6">
        {/* Stat cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {statCards.map(({ label, href, icon: Icon, chip }, index) => (
            <Link
              key={label}
              to={href}
              className="group rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                    {label}
                  </p>
                  <p className="mt-1 text-3xl font-black text-gray-900">
                    {loading ? "—" : statValues[index]}
                  </p>
                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-black ${chip}`}
                >
                  <Icon size={22} />
                </div>
              </div>

              <p className="mt-3 inline-flex items-center gap-1 text-sm font-black text-blue-600 transition group-hover:gap-2">
                Open <ChevronRight size={14} />
              </p>
            </Link>
          ))}
        </div>

        {/* Panels */}
        <div className="grid gap-6 xl:grid-cols-2">
<section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-black text-gray-900">Recent Orders</h2>
              <Link
                to="/account/orders"
                className="text-sm font-black text-blue-600 hover:text-blue-700"
              >
                View all
              </Link>
            </div>

            {loading ? (
              <p className="py-6 text-center text-sm font-bold text-gray-400">
                Loading...
              </p>
            ) : recentOrders.length ? (
              <div className="grid gap-4">
                {recentOrders.map((o) => (
                  <OrderCard key={o.id} order={o} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
                <Package size={28} className="mx-auto text-gray-300" />
                <p className="mt-3 font-bold text-gray-700">No orders yet</p>
                <p className="mt-1 text-sm text-gray-500">
                  Your orders will appear here once you shop.
                </p>
                <Link
                  to="/products"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-black text-white transition hover:bg-gray-800"
                >
                  <ShoppingCart size={15} /> Start shopping
                </Link>
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-black text-gray-900">Recently Saved</h2>
              <Link
                to="/account/wishlist"
                className="text-sm font-black text-blue-600 hover:text-blue-700"
              >
                View all
              </Link>
            </div>

            {loading ? (
              <p className="py-6 text-center text-sm font-bold text-gray-400">
                Loading...
              </p>
            ) : recentWishlist.length ? (
              <ul className="divide-y divide-gray-100">
                {recentWishlist.map((w) => {
                  const id = w.id ?? w.wishlist_item_id ?? w.product_id;
                  const name =
                    w.product_name ||
                    w.name ||
                    w.title ||
                    `Product #${w.product_id || id}`;
                  const price = w.price ?? w.product_price;

                  return (
                    <li key={id} className="flex items-center gap-3 py-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                        <Heart size={16} fill="currentColor" />
                      </span>
                      <span className="min-w-0 flex-1 truncate font-bold text-gray-800">
                        {name}
                      </span>
                      {price != null && (
                        <span className="text-sm font-black text-gray-900">
                          KSh {Number(price).toLocaleString()}
                        </span>
                      )}
                      <Link
                        to="/account/wishlist"
                        className="text-sm font-black text-blue-600 hover:text-blue-700"
                      >
                        View
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
                <Heart size={28} className="mx-auto text-gray-300" />
                <p className="mt-3 font-bold text-gray-700">Wishlist is empty</p>
                <p className="mt-1 text-sm text-gray-500">
                  Save products you love for later.
                </p>
                <Link
                  to="/products"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-black text-white transition hover:bg-gray-800"
                >
                  <Plus size={15} /> Browse products
                </Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </AccountLayout>
  );
}