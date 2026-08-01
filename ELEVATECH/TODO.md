# Admin Dashboard Enhancement — TODO

- [x] Explore backend `admin_dashboard.py`, models (Order/OrderItem/Product), and frontend Dashboard/StatCard/SalesChart
- [x] Approve plan with user

## Backend
- [x] Extend `/api/admin/dashboard`:
  - Rename `total_orders` → `orders`
  - Add `sales_chart` (last 7 days labels + daily paid revenue values)
  - Add `top_products` (top 5 paid-order products by units sold)
  - Add `revenue_this_week`, `revenue_prev_week`, `revenue_change_percent` for the Revenue Trend widget

## Frontend
- [x] Create `TopProducts.jsx` component (spec-driven)
- [x] Update `Dashboard.jsx`:
  - Use `stats.orders`
  - Add Revenue Trend card (green ▲ / red ▼, "Compared with last week")
  - Add Sales Chart section using `SalesChart`
  - Add Top Products section using `TopProducts`
  - Keep Recent Orders table

## Verification
- [x] Confirm no other consumers of `total_orders` / `recent_orders` break (only Dashboard.jsx)
- [x] Backend compiles (`python -m py_compile`)
- [x] Frontend builds (`npm run build` passed)
- [x] Final review



