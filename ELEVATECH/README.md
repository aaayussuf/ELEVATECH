# ELEVATECH — Smarter Tech. Better Living.

> Full documentation lives in the **root [`README.md`](../README.md)** — start there.

## Quick Start (from this folder)

```bash
# Backend :5000
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
python run.py

# Frontend :5173 (new terminal)
cd ../frontend
npm install
Copy-Item .env.example .env
npm run dev
```

- API: http://127.0.0.1:5000 • Shop: http://localhost:5173
- See root README for features, env vars, API reference, routes, payments, testing & deployment.

