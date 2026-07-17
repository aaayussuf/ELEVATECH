# TODO

- [x] Create `backend/app/routes/payments.py` with endpoints to create, list, and verify payments (simulated success)
- [x] Register `payments_bp` in `backend/app/__init__.py`
- [ ] Run backend and manually test payment endpoints
  - [ ] Create (POST /api/payments)
  - [ ] List (GET /api/payments)
  - [ ] Verify (PATCH /api/payments/<id>/verify)
  - [ ] Order history (GET /api/payments/order/<order_id>)

- [x] Integrate real Stripe payments (Checkout Session + Webhooks)
  - [x] Add Stripe config (env-driven)
  - [x] Add `stripe_service.py`
  - [x] Add `routes/checkout.py` with `/api/checkout` and webhook endpoint
  - [x] Update `Payment` model to store Stripe identifiers
  - [x] Register checkout blueprint in `app/__init__.py`
  - [x] Update React `Checkout.jsx` to call `/api/checkout` and redirect
  - [ ] Add manual test checklist



