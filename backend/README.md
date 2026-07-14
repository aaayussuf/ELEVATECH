# BX Tech Digital World - Backend (Flask)

Run (dev):

```bash
docker compose up --build
```

Then in another terminal:

```bash
docker compose exec api bash
# (inside container)
python -m flask run --host=0.0.0.0 --port=5000
```

For local non-docker dev, create backend/.env and install requirements.

