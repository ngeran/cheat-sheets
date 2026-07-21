# Vercel serverless entrypoint. Vercel's Python runtime detects the ASGI `app`
# and serves it; vercel.json rewrites /api/* here. Not used in local dev
# (run `uvicorn main:app` from this directory instead).
from main import app  # noqa: F401
