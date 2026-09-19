# ELEVATECH — Smarter Tech. Better Living.

> Premium Kenyan e-commerce platform for laptops, smartphones, printers & accessories — with secure checkout (Stripe + M-Pesa), real-time admin dashboard, inventory & supplier management.

[![Backend](https://img.shields.io/badge/backend-Flask%203.1-blue)](./ELEVATECH/backend)
[![Frontend](https://img.shields.io/badge/frontend-React%2019%20%2B%20Vite%208-61dafb)](./ELEVATECH/frontend)
[![Database](https://img.shields.io/badge/db-Postgres%20%2F%20SQLite-green)](#-data--database)
[![Payments](https://img.shields.io/badge/payments-Stripe%20%2B%20M--Pesa%20Daraja-purple)](#-payments)
[![License](https://img.shields.io/badge/license-MIT-lightgrey)](#-license)

**Live tagline:** *Kenya-wide delivery, secure shopping, admin superpowers.*

---

## 📑 Table of Contents

- [✨ Overview](#-overview)
- [🎯 Features](#-features)
- [🧱 Tech Stack](#-tech-stack)
- [🏗️ Architecture](#️-architecture)
- [📁 Project Structure](#-project-structure)
- [🚀 Quick Start](#-quick-start)
- [⚙️ Environment Variables](#️-environment-variables)
- [🔌 API Reference](#-api-reference)
- [🖥️ Frontend Routes](#️-frontend-routes)
- [💳 Payments](#-payments)
- [📦 Database & Seeding](#-database--seeding)
- [🧪 Testing](#-testing)
- [🧰 Useful Scripts](#-useful-scripts)
- [🚢 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [📬 Contact](#-contact)

---

## ✨ Overview

**ELEVATECH** is a full-stack monorepo e-commerce system:

- **Storefront:** modern dark-themed shop (`/`, `/products`, `/product/:slug`, `/cart`, `/checkout`, `/account/*`) with hero, promo strip, categories, featured products, flash deals, testimonials, reviews, wishlist, cart and order tracking.
- **Auth:** JWT auth with email/phone **OTP verification**, forgot-password, resend-cooldown + expiry, dev-OTP mode for local testing.
- **Admin:** `/admin` dashboard with revenue trend, 7-day sales chart, top-5 products, recent orders, Kanban order board, customers, products, categories, coupons, inventory + reorder suggestions, suppliers + purchase orders + goods receiving.
- **Backend:** Flask + Flask-SQLAlchemy + Flask-Migrate + Flask-JWT-Extended + Flask-SocketIO + Flask-Mail, auto-init DB + seed on boot, Cloudinary-or-local uploads, Stripe + M-Pesa Daraja services.

> Repo layout note: the runnable app lives in [`ELEVATECH/`](./ELEVATECH) (`backend/` + `frontend/`). This root README covers the whole project.

---

## 🎯 Features

### 🛍️ Storefront
- Home sections: Hero, PromoStrip, TrustStats, FeatureCards, Categories, FeaturedProducts, FlashDeals, Testimonials, FAQ, Final CTA
- Product listing with search / filter / category, product details with gallery, highlights, specs table, rating summary, reviews, related + recently-viewed, sticky buy bar
- Cart (persistent context), wishlist, addresses book, coupons at checkout
- Checkout → Stripe Checkout session **or** M-Pesa STK push → success/cancel pages, My Orders + order details

### 🔐 Auth & Accounts
- Register / Login / Verify OTP / Forgot Password / Change Password
- OTP via Email (Flask-Mail/Gmail) or SMS (Twilio / Africa's Talking for Kenya); console-log + `EXPOSE_DEV_OTP` fallback for dev
- Protected routes (`ProtectedRoute`, `AdminRoute`), role `admin` / `customer`

### 📊 Admin Superpowers
- **Dashboard** (`GET /api/admin/dashboard`): `orders`, `revenue`, `revenue_this_week`, `revenue_prev_week`, `revenue_change_percent`, `sales_chart` (7-day labels+values), `top_products`, `recent_orders`, low-stock alerts
- **Orders:** list/filter, details, status transitions, Kanban board (`/admin/orders/board` + drag-and-drop via `@hello-pangea/dnd`), real-time Socket.IO notifications
- **Catalog:** CRUD products/categories, featured/low-stock/bulk-delete, stock PATCH, image uploads
- **Inventory:** stock levels, movements log, reorder suggestions service
- **Purchasing:** suppliers CRUD, purchase orders CRUD + receive flow (auto-increments stock + movement)
- **Marketing:** coupons CRUD + validation, flash-deal flags

### ⚡ Realtime & Media
- Flask-SocketIO + `socket.io-client` for admin notifications (`/api/test-notification`)
- Uploads to Cloudinary when configured, else `backend/uploads/` served at `/uploads/<file>`; category-image generator script included


---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Python, Flask 3.1, Flask-SQLAlchemy 3.1, Flask-Migrate/Alembic, Flask-JWT-Extended, Flask-CORS, Flask-Mail, Flask-SocketIO, Gunicorn |
| **Database** | SQLite (dev, auto-created at `backend/instance/elevatech.db`) → PostgreSQL (`DATABASE_URL`, `psycopg2-binary`) in prod |
| **Payments** | `stripe` (Checkout Sessions + Webhooks), M-Pesa Daraja STK push (`mpesa_service.py`) |
| **Media** | `cloudinary` SDK (optional) with local `uploads/` fallback |
| **Auth/Security** | JWT, `bcrypt`, OTP with expiry + resend cooldown, `python-dotenv` |
| **Frontend** | React 19, Vite 8, React Router 7, Tailwind CSS 4 (`@tailwindcss/vite`), Axios, React Hook Form, React Toastify |
| **UI/UX** | Framer Motion, Lucide + React Icons, Swiper, Chart.js + `react-chartjs-2` + Recharts, `@hello-pangea/dnd` (Kanban) |
| **Realtime** | `python-socketio` ↔ `socket.io-client` |
| **Tooling** | ESLint, `scripts/generate_category_images.ps1`, ngrok binary for demos, pytest suite |

---

## 🏗️ Architecture

```mermaid
flowchart LR
  User -->|Vite SPA :5173| FE[React Frontend]
  FE -->|REST /api/* + JWT| API[Flask API :5000]
  FE <-->|WebSocket| API
  API --> DB[(SQLite / Postgres)]
  API -->|SMTP| Mail[Gmail / Flask-Mail]
  API -->|SMS| SMS[Twilio / Africa's Talking]
  API --> Stripe[Stripe Checkout]
  API --> Mpesa[M-Pesa Daraja STK]
  API --> Cloud[Cloudinary or local uploads/]
```

- **Backend app factory:** `backend/run.py` → `app.create_app()` (`backend/app/__init__.py`) registers ~18 blueprints, CORS for `:5173`, auto `db.create_all()` + `seed_database()` when `AUTO_INIT_DB=true`.
- **Layers:** `routes/` (thin HTTP) → `services/` (business logic: `admin_dashboard_service`, `admin_order_service`, `inventory_service`, `purchase_order_service`, `stripe_service`, `mpesa_service`, …) → `models/` (User, Product, Category, Order/OrderItem, Cart, Coupon, Supplier, PurchaseOrder/Item, Payment, Review, Wishlist, Address, InventoryMovement).
- **Frontend layers:** `pages/` (storefront + `account/*` + `admin/*`) + `components/` (home/shop/products/layout/admin) + `services/*Service.js` (Axios wrapper `api.js`) + `context/` (Auth, Cart, Wishlist) + `layouts/MainLayout`.

---

## 📁 Project Structure

```text
ELEVATECH/                  # runnable monorepo (this README lives one level above)
├── backend/
│   ├── run.py              # entrypoint → socketio.run(app, :5000)
│   ├── config.py           # Config: DB, CORS, uploads, Stripe, Cloudinary, M-Pesa, Mail, OTP
│   ├── requirements.txt
│   ├── .env.example        # copy to .env
│   ├── app/
│   │   ├── __init__.py     # create_app(), blueprints, CORS, auto-init DB
│   │   ├── seed.py         # categories + demo products + primary admin
│   │   ├── models/         # user, product, category, order, cart, coupon, supplier, ...
│   │   ├── routes/         # auth, products, categories, checkout, orders, payments, mpesa,
│   │   │                   # reviews, wishlist, addresses, coupons, upload, admin_*
│   │   ├── services/       # stripe, mpesa, email, sms, cloudinary, inventory, dashboard, ...
│   │   ├── utils/          # admin_required, phone, index
│   │   └── extensions/     # db, migrate, jwt, mail, socketio
│   ├── tests/              # test_products, test_authorization, test_inventory_safety, ...
│   ├── migrations/         # Alembic / Flask-Migrate
│   └── uploads/products/   # local image fallback (served at /uploads/...)
├── frontend/
│   ├── index.html          # title: ELEVATECH — Smarter Tech. Better Living.
│   ├── vite.config.js + .env.example (VITE_API_BASE)
│   ├── package.json
│   └── src/
│       ├── App.jsx         # all Routes (public / account / admin)
│       ├── main.jsx        # BrowserRouter + Auth/Cart/Wishlist + ToastContainer
│       ├── pages/          # Home, Products, ProductDetails, Cart, Checkout, Login/Register/...
│       ├── components/     # home/, shop/, products/, layout/, admin/, ui/
│       ├── services/       # api.js + *Service.js per domain + socketService.js
│       ├── context/        # AuthContext, CartContext, WishlistContext
│       └── styles/, assets/
├── scripts/generate_category_images.ps1
└── ngrok/ngrok.exe         # local demo tunneling
```

---

## 🚀 Quick Start

### Prerequisites
- **Python 3.12+**, **Node.js 20+ + npm**, **Git**
- Optional: PostgreSQL, Cloudinary account, Stripe CLI, M-Pesa Daraja sandbox creds, Gmail App Password

### 1️⃣ Clone
```bash
git clone https://github.com/aaayussuf/ELEVATECH.git
cd ELEVATECH/ELEVATECH
```

### 2️⃣ Backend (Flask :5000)
```bash
cd backend
python -m venv .venv
# Windows (PowerShell):
.venv\Scripts\Activate.ps1
# macOS/Linux:
# source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env   # Windows: Copy-Item .env.example .env
# edit .env — minimal local dev works with defaults (SQLite + EXPOSE_DEV_OTP=true)
python run.py
# → API at http://127.0.0.1:5000  (GET / → {"message": "Welcome to ELEVATECH API"})
```

### 3️⃣ Frontend (Vite :5173)
```bash
cd ../frontend
npm install
cp .env.example .env   # set VITE_API_BASE=http://127.0.0.1:5000
npm run dev
# → Shop at http://localhost:5173
```

### 4️⃣ Default accounts (seeded)
- Seeded **primary admin**: `store.elevatech@gmail.com` (role auto-enforced to `admin` on boot; set its password via Register/Forgot-Password or DB).
- Register a customer at `/register` → verify OTP (dev: OTP printed in backend terminal **and** returned in JSON when `EXPOSE_DEV_OTP=true`) → login → shop.

> Ports: backend **5000**, frontend **5173**. CORS already allows both `localhost` + `127.0.0.1`.

---

## ⚙️ Environment Variables

### Backend (`ELEVATECH/backend/.env` — see `.env.example`)
| Key | Default / Example | Purpose |
|---|---|---|
| `SECRET_KEY` / `JWT_SECRET_KEY` | dev-only placeholders | **Change in prod!** Flask + JWT signing |
| `DATABASE_URL` | *(unset → SQLite `instance/elevatech.db`)* | e.g. `postgresql://user:pass@localhost:5432/elevatech` |
| `CORS_ORIGINS` / `FRONTEND_URL` | `http://localhost:5173,...` | Allowed origins + links |
| `AUTO_INIT_DB` | `true` | Auto `create_all()` + seed on boot |
| `EXPOSE_DEV_OTP` | `true` (dev) | Return OTP in register/resend JSON — **false in prod** |
| `OTP_LENGTH` / `OTP_EXPIRY_SECONDS` / `OTP_RESEND_COOLDOWN_SECONDS` | `6` / `600` / `60` | OTP policy |
| `UPLOAD_FOLDER` / `MAX_CONTENT_LENGTH` | `uploads` / `16777216` | Local uploads (16 MB) |
| `CLOUDINARY_CLOUD_NAME` / `_API_KEY` / `_API_SECRET` | — | When set → Cloudinary; else local `/uploads/...` |
| `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` / `STRIPE_WEBHOOK_SECRET` | — | Stripe Checkout; `STRIPE_CURRENCY=KES`, success/cancel URLs |
| `MPESA_ENV` / `MPESA_CONSUMER_KEY` / `MPESA_CONSUMER_SECRET` / `MPESA_SHORTCODE` / `MPESA_PASSKEY` / `MPESA_CALLBACK_URL` | `sandbox` | M-Pesa Daraja STK push |
| `MAIL_SERVER` / `MAIL_PORT` / `MAIL_USE_TLS` / `MAIL_USE_SSL` / `MAIL_USERNAME` / `MAIL_PASSWORD` / `MAIL_DEFAULT_SENDER` | `smtp.gmail.com:587` | Gmail App-Password email OTP |
| `TWILIO_*` / `AT_API_KEY` / `AT_USERNAME` / `AT_SENDER_ID` | — | Phone OTP (Twilio or Africa's Talking) |

### Frontend (`ELEVATECH/frontend/.env`)
| Key | Example | Purpose |
|---|---|---|
| `VITE_API_BASE` | `http://127.0.0.1:5000` | Backend base URL used by `src/services/api.js` |


---

## 🔌 API Reference

Base URL: `http://127.0.0.1:5000` • Auth: `Authorization: Bearer <JWT>` (customer) + admin guard on `/api/admin/*`.

| Domain | Method & Path | Notes |
|---|---|---|
| Health | `GET /` | `{"message": "Welcome to ELEVATECH API"}` |
| Health | `GET /api/test-notification` | Fires Socket.IO test event |
| Auth | `POST /api/auth/register` → `verify` → `login` | OTP flow; `resend`, forgot/reset, change-password |
| Products (public) | `GET /api/products`, `GET /api/products/:slugOrId` | Search/filter/featured + reviews |
| Categories (public) | `GET /api/categories`, `GET /api/categories/:id` | Storefront nav |
| Cart / Wishlist / Addresses | `/api/cart*`, `/api/wishlist*`, `/api/addresses*` | JWT customer |
| Checkout / Orders | `POST /api/checkout`, `GET /api/orders`, `GET /api/orders/:id` | Order + payment intent |
| Payments | `POST /api/payments/stripe/*` + webhook; `POST /api/mpesa/*` + callback | See Payments below |
| Coupons | `POST /api/coupons/validate`, admin CRUD | Discounts at checkout |
| Uploads | `POST /api/upload`, `GET /uploads/<file>` | Cloudinary or local |
| Admin Dashboard | `GET /api/admin/dashboard` | orders, revenue, week trend %, 7-day chart, top products |
| Admin Orders | `GET /api/admin/orders`, `PATCH .../:id/status`, Kanban | Board drag-and-drop sync |
| Admin Products | `GET/POST /api/admin/products`, `PUT/DELETE .../:id`, `PATCH .../stock\|featured\|status`, `GET .../low-stock\|featured\|inventory`, `DELETE .../bulk-delete` | Catalog control |
| Admin Categories | `GET/POST /api/admin/categories`, `PUT/DELETE .../:id`, `PATCH .../:id/status` | |
| Admin Coupons | `GET/POST /api/admin/coupons`, `GET/PUT/DELETE .../:id` | |
| Admin Customers | `GET /api/admin/customers`, `GET .../:id` | History per customer |
| Admin Inventory | `GET /api/admin/inventory*`, reorder suggestions | Movements + low-stock |
| Admin Suppliers | `GET/POST /api/admin/suppliers`, `GET/PUT/DELETE .../:id` | |
| Admin Purchase Orders | `GET/POST /api/admin/purchase-orders`, `GET/PUT/DELETE .../:id`, `POST .../:id/receive` | Receiving updates stock |
| Admin PO Items | `GET .../purchase-order-items/:poId`, `POST`, `PUT/DELETE .../:itemId` | |

> Exact prefixes: `backend/app/__init__.py` + `backend/app/routes/*.py`. Callers: `frontend/src/services/*Service.js`.

---

## 🖥️ Frontend Routes

| Path | Access | Page |
|---|---|---|
| `/`, `/products`, `/product/:slug`, `/cart` | public | Home, listing, details, cart |
| `/login`, `/register`, `/verify`, `/forgot-password` | guest | Auth + OTP |
| `/checkout`, `/checkout/success`, `/checkout/cancel` | customer | Stripe/M-Pesa checkout |
| `/my-orders`, `/orders` → `/account/orders`, `/account/*` | customer (`ProtectedRoute`) | Dashboard, Profile, Orders/:id, Addresses, Wishlist, Password |
| `/about`, `/test-upload` | public | Info + upload playground |
| `/admin`, `/admin/orders`, `/admin/orders/board`, `/admin/orders/:id` | admin (`AdminRoute`+`AdminLayout`) | Dashboard, orders, Kanban |
| `/admin/products`, `/create`, `/:id/edit` | admin | Catalog |
| `/admin/inventory`, `/inventory/reorder-suggestions` | admin | Stock |
| `/admin/categories`, `/new`, `/:id/edit` | admin | Categories |
| `/admin/coupons`, `/coupons/new` | admin | Coupons |
| `/admin/suppliers`, `/suppliers/create` | admin | Suppliers |
| `/admin/purchase-orders`, `/new`, `/:id`, `/:id/edit` | admin | Purchasing |
| `/admin/customers`, `/customers/:id` | admin | Customers |

---

## 💳 Payments

- **Stripe:** `stripe_service.py` creates Checkout Sessions (`STRIPE_SUCCESS_URL` includes `{CHECKOUT_SESSION_ID}`); webhook marks orders paid. Flow: `/checkout` → redirect → `/checkout/success?session_id=...` / `/checkout/cancel`.
- **M-Pesa Daraja:** `mpesa_service.py` (sandbox default) sends STK push to `2547XXXXXXXX`; `MPESA_CALLBACK_URL` confirms async. Needs `SHORTCODE` + `PASSKEY` + consumer key/secret.
- **Currency:** `STRIPE_CURRENCY=KES` by default.

---

## 📦 Database & Seeding

- **Dev:** zero setup — SQLite auto-created at `backend/instance/elevatech.db` (`AUTO_INIT_DB=true` runs `db.create_all()` + `seed_database()` every boot, idempotent).
- **Seed:** 4 categories (Laptops, Printers, Phones, Accessories) + 10+ demo products + primary admin `store.elevatech@gmail.com`.
- **Prod (Postgres):** set `DATABASE_URL=postgresql://...`, then `flask --app run db upgrade` (or keep `AUTO_INIT_DB=true` for first boot).
- **Migrations:** `backend/migrations/` — after model changes: `flask --app run db migrate -m "msg"` → `db upgrade`.

---

## 🧪 Testing

```bash
cd ELEVATECH/backend
.venv\Scripts\Activate.ps1
pytest -v
pytest tests/test_products.py tests/test_authorization.py tests/test_inventory_safety.py -v
```

Covers product validation/CRUD, auth + admin guards, inventory safety. Helpers: `_smoke_auth.py`, `_dbcheck.py`.

```bash
cd ../frontend
npm run lint
npm run build   # → dist/
npm run preview
```

---

## 🧰 Useful Scripts

| Script | Purpose |
|---|---|
| `ELEVATECH/scripts/generate_category_images.ps1` | Regenerates category banners |
| `ELEVATECH/ngrok/ngrok.exe` | `ngrok http 5000` for demos + Stripe/M-Pesa webhooks |
| `backend/_smoke_auth.py` | Manual auth/OTP smoke test |
| `backend/_dbcheck.py` | Inspect tables/seed state |

---

## 🚢 Deployment

**Backend (Render/Railway/VPS):** set `SECRET_KEY`, `JWT_SECRET_KEY`, `DATABASE_URL`, `FRONTEND_URL`, `CORS_ORIGINS`, `EXPOSE_DEV_OTP=false`, Stripe/M-Pesa/Cloudinary/Mail creds → `pip install -r requirements.txt` → `gunicorn run:app` → run migrations → point webhooks at `https://<api>/...`.

**Frontend (Vercel/Netlify):** root `ELEVATECH/frontend`, build `npm install && npm run build`, output `dist/`, env `VITE_API_BASE=https://<your-api>`.

---

## 🤝 Contributing

1. Fork → `git checkout -b feat/my-feature` → commit → push → PR to `main`.
2. Keep routes thin (logic in `services/`), add/extend `tests/`, run `pytest` + `npm run lint && npm run build` first.
3. Never commit `.env` (only `.env.example`).

---

## 📄 License

MIT — free to use, modify and distribute. Add a `LICENSE` file for a formal grant.

---

## 📬 Contact

- **Project:** ELEVATECH — *Smarter Tech. Better Living.* 🇰🇪
- **Support:** `store.elevatech@gmail.com`
- **Repo:** `https://github.com/aaayussuf/ELEVATECH` — issues & PRs welcome!

> Kenya-wide delivery • Secure Stripe + M-Pesa checkout • ⭐ Star the repo if ELEVATECH helped you!

