# BX-Tech-Digital-World - TODO

## Step 1 - Project scaffolding
- [x] Create docker-compose.yml
- [x] Create .env.example
- [x] Create frontend React + Tailwind skeleton and core pages

## Step 2 - Backend (Flask + Postgres + SQLAlchemy)
- [x] Create backend requirements.txt
- [x] Create Flask extensions
- [x] Create Flask app entry (backend/app.py, backend/wsgi.py)
- [x] Create SQLAlchemy models: User, Category, Product, CartItem
- [x] Create routes:
  - [x] public home/about/contact
  - [x] categories + product listing + product detail
  - [x] register/login/me + admin create product
  - [x] cart session APIs (get/add/update/clear)
- [x] Seed DB with demo data when empty

## Step 3 - Frontend remaining wiring
- [ ] Fix AboutPage and ContactPage to not hardcode unused API helper
- [ ] Add any missing pages imports (if any) and ensure App.jsx compiles

## Step 4 - Migrations / database initialization
- [ ] Provide migration command instructions OR auto-create tables on startup

## Step 5 - Testing
- [ ] Run docker compose up --build and verify API endpoints
- [ ] Run frontend dev server and verify routing and cart flow

