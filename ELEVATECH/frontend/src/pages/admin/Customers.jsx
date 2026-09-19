import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, RefreshCw, Eye } from "lucide-react";
import adminCustomerService from "../../services/adminCustomerService";

export default function Customers() {

    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadCustomers();
    }, []);

    async function loadCustomers() {
        try {
            setLoading(true);
            setError("");
            const data = await adminCustomerService.listCustomers();
            setCustomers(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err?.friendlyMessage || "Failed to load customers.");
        } finally {
            setLoading(false);
        }
    }

    const q = search.trim().toLowerCase();
    const filtered = !q ? customers : customers.filter((c) =>
        [c.name, c.email, c.phone, c.role].filter(Boolean).join(" ").toLowerCase().includes(q)
    );

    return (
        <div className="space-y-6">

            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-amber-600">Sales · CRM</p>
                    <h1 className="admin-page-title">Customers</h1>
                    <p className="admin-page-sub">{customers.length} total customers</p>
                </div>
                <button onClick={loadCustomers} className="admin-btn admin-btn-ghost admin-btn-auto text-sm">
                    <RefreshCw size={16} /> Refresh
                </button>
            </div>

            <div className="admin-card p-4">
                <div className="relative">
                    <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, phone…" className="admin-input !pl-10" />
                </div>
            </div>

            {error && <div className="admin-alert admin-alert-error">{error}</div>}

            {loading ? (
                <div className="admin-card space-y-3 p-6">
                    <div className="admin-skeleton h-10 w-full" />
                    <div className="admin-skeleton h-10 w-full" />
                    <div className="admin-skeleton h-10 w-full" />
                </div>
            ) : (
            <div className="admin-table-wrap">
            <table className="admin-table">

                <thead>

                    <tr>
                        <th>Customer</th>
                        <th>Email</th>
                        <th>Orders</th>
                        <th>Spent</th>
                        <th>Last Order</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>

                </thead>

                <tbody>

                    {filtered.map(customer => (

                        <tr key={customer.id}>

                            <td className="font-bold">
                                {customer.name}
                            </td>

                            <td className="text-slate-600">{customer.email}</td>

                            <td>{customer.orders ?? 0}</td>

                            <td className="font-bold">
                                KSh {Number(customer.spent ?? 0).toLocaleString()}
                            </td>

                            <td className="text-slate-500">
                                {customer.last_order
                                    ? new Date(customer.last_order).toLocaleDateString()
                                    : "Never"}
                            </td>

                            <td><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-extrabold capitalize">{customer.role}</span></td>

                            <td>
                                <button
                                    onClick={() =>
                                        navigate(`/admin/customers/${customer.id}`)
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700"
                                >
                                    <Eye size={14} /> View
                                </button>
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>
            </div>
            )}

        </div>
    );
}

