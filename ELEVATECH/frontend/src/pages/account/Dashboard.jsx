import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Heart,
  MapPinned,
  Package,
  Plus,
  ShoppingCart,
  ArrowUpRight,
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
      <div className="w-full min-w-0 space-y-5 sm:space-y-6 md:space-y-7">
        <div className="min-w-0">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-5 md:p-6">
            <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-500 sm:text-xs sm:tracking-[0.2em]">
                  Customer account
                </p>
                <h1 className="mt-1.5 truncate text-xl font-black tracking-tight text-gray-900 sm:text-2xl md:text-3xl">
                  Welcome{user?.first_name ? `, ${user.first_name}` : ""}
                </h1>
                <p className="mt-1.5 max-w-2xl text-xs leading-5 text-gray-500 sm:text-sm sm:leading-6">
                  Manage your orders, wishlist, addresses, and account activity from one place.
                </p>
              </div>
              <Link
                to="/products"
                className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-xs font-black text-white transition hover:bg-gray-800 active:scale-[0.99] sm:w-auto sm:px-5 sm:text-sm"
              >
                <ShoppingCart size={16} className="shrink-0" />
                Continue shopping
              </Link>
            </div>
          </div>
        </div>


        <div className="grid min-w-0 grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:gap-4 xl:grid-cols-3">
          {statCards.map(({ label, href, icon: Icon, chip }, index) => (
            <Link
              key={label}
              to={href}
              className="group min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99] sm:rounded-3xl sm:p-5 md:p-6"
            >
              <div className="flex min-w-0 items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[9px] font-black uppercase tracking-[0.14em] text-gray-400 min-[375px]:text-[10px] sm:text-[11px] sm:tracking-widest">
                    {label}
                  </p>
                  <p className="mt-1 text-2xl font-black text-gray-900 min-[375px]:text-3xl">
                    {loading ? "—" : statValues[index]}
                  </p>
                </div>
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-black sm:h-12 sm:w-12 sm:rounded-2xl ${chip}`}>
                  <Icon size={20} className="sm:h-[22px] sm:w-[22px]" />
                </div>
              </div>
              <div className="mt-3 inline-flex min-h-9 items-center gap-1 text-xs font-black text-blue-600 transition group-hover:gap-2 sm:text-sm">
                Open
                <ChevronRight size={14} className="shrink-0" />
              </div>
            </Link>
          ))}
        </div>
        <div className="grid min-w-0 gap-5 lg:gap-6 xl:grid-cols-2">
          <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-5 md:p-6">
            <div className="mb-4 flex min-w-0 items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate text-base font-black text-gray-900 sm:text-lg">Recent Orders</h2>
                <p className="mt-0.5 text-[11px] text-gray-400 sm:text-xs">Your latest purchases</p>
              </div>
              <Link to="/account/orders" className="inline-flex min-h-10 shrink-0 items-center gap-1 rounded-lg px-1 text-xs font-black text-blue-600 transition hover:text-blue-700 sm:text-sm">
                View all
                <ArrowUpRight size={14} className="shrink-0" />
              </Link>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1, 2].map((item) => (
                  <div key={item} className="animate-pulse rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <div className="h-4 w-1/3 rounded bg-gray-200" />
                    <div className="mt-3 h-3 w-2/3 rounded bg-gray-200" />
                    <div className="mt-2 h-3 w-1/2 rounded bg-gray-200" />
                  </div>
                ))}
              </div>
            ) : recentOrders.length ? (
              <div className="grid min-w-0 gap-3 sm:gap-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="min-w-0">
                    <OrderCard order={order} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center sm:p-8">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <Package size={25} className="text-gray-300" />
                </div>
                <p className="mt-3 text-sm font-bold text-gray-700 sm:text-base">No orders yet</p>
                <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-gray-500 sm:text-sm sm:leading-6">Your orders will appear here once you shop.</p>
                <Link to="/products" className="mt-4 inline-flex min-h-11 w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-xs font-black text-white transition hover:bg-gray-800 active:scale-[0.99] sm:w-auto sm:text-sm">
                  <ShoppingCart size={15} className="shrink-0" />
                  Start shopping
                </Link>
              </div>
            )}
          </section>
          <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-5 md:p-6">
            <div className="mb-4 flex min-w-0 items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate text-base font-black text-gray-900 sm:text-lg">Recently Saved</h2>
                <p className="mt-0.5 text-[11px] text-gray-400 sm:text-xs">Products in your wishlist</p>
              </div>
              <Link to="/account/wishlist" className="inline-flex min-h-10 shrink-0 items-center gap-1 rounded-lg px-1 text-xs font-black text-blue-600 transition hover:text-blue-700 sm:text-sm">
                View all
                <ArrowUpRight size={14} className="shrink-0" />
              </Link>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex animate-pulse items-center gap-3 py-3">
                    <div className="h-9 w-9 shrink-0 rounded-xl bg-gray-200" />
                    <div className="h-3 flex-1 rounded bg-gray-200" />
                    <div className="h-3 w-16 rounded bg-gray-200" />
                  </div>
                ))}
              </div>
            ) : recentWishlist.length ? (
              <ul className="divide-y divide-gray-100">
                {recentWishlist.map((w) => {
                  const id = w.id ?? w.wishlist_item_id ?? w.product_id;
                  const name = w.product_name || w.name || w.title || `Product #${w.product_id || id}`;
                  const price = w.price ?? w.product_price;
                  return (
                    <li key={id} className="flex min-w-0 flex-wrap items-center gap-2.5 py-3 sm:flex-nowrap sm:gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                        <Heart size={16} fill="currentColor" />
                      </span>
                      <span className="min-w-0 flex-1 break-words text-xs font-bold leading-5 text-gray-800 sm:truncate sm:text-sm">{name}</span>
                      {price != null && (
                        <span className="shrink-0 text-xs font-black text-gray-900 sm:text-sm">KSh {Number(price).toLocaleString()}</span>
                      )}
                      <Link to="/account/wishlist" className="inline-flex min-h-9 shrink-0 items-center rounded-lg px-2 text-xs font-black text-blue-600 transition hover:text-blue-700 sm:text-sm">View</Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center sm:p-8">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <Heart size={25} className="text-gray-300" />
                </div>
                <p className="mt-3 text-sm font-bold text-gray-700 sm:text-base">Wishlist is empty</p>
                <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-gray-500 sm:text-sm sm:leading-6">Save products you love for later.</p>
                <Link to="/products" className="mt-4 inline-flex min-h-11 w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-xs font-black text-white transition hover:bg-gray-800 active:scale-[0.99] sm:w-auto sm:text-sm">
                  <Plus size={15} className="shrink-0" />
                  Browse products
                </Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </AccountLayout>
  );
}


