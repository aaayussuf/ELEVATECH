# Coupon Service — Implementation TODO

## Step 1 — Create the coupon service
- [x] Create `frontend/src/services/adminCouponService.js`
- [x] Base path: `/api/admin/coupons` (matches backend blueprint + all other admin services)

## Step 2 — Connect the Coupons page
- [x] Replace `frontend/src/pages/admin/Coupons.jsx`
- [x] Load coupons via `adminCouponService.listCoupons()`
- [x] Table with code, description, discount, min amount, usage, expiry, status, actions
- [x] Create / Edit modal form
- [x] Delete with confirmation
- [x] Active/Inactive toggle

## Follow-up
- [x] Files created and routes confirmed in `App.jsx` and `Sidebar.jsx`
- [ ] Verify page loads in dev (`npm run dev` in `ELEVATECH/frontend`)

