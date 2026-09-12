import psycopg2

conn = psycopg2.connect(host="localhost", port=5432, dbname="elevatech", user="elevatech", password="elevatech")
cur = conn.cursor()
cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name='users' ORDER BY ordinal_position")
cols = [r[0] for r in cur.fetchall()]
print("users columns:", cols)
expected = [
    "email_verified", "phone_verified",
    "email_otp", "email_otp_expires_at", "email_otp_sent_at",
    "phone_otp", "phone_otp_expires_at", "phone_otp_sent_at",
    "reset_otp", "reset_otp_expires_at", "reset_otp_sent_at",
]
missing = [c for c in expected if c not in cols]
print("MISSING:", missing)
try:
    cur.execute("SELECT version_num FROM alembic_version")
    print("alembic_version:", cur.fetchall())
except Exception as exc:
    print("alembic_version table error:", exc)
conn.rollback()
conn.close()