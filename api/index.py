# Vercel serverless entrypoint. Adds this directory to sys.path first so the
# sibling modules (main.py, store.py) are importable regardless of how the
# runtime configures the function. Not used in local dev
# (run `uvicorn main:app` from this directory instead).
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from main import app  # noqa: E402,F401  (Vercel detects the ASGI app)
