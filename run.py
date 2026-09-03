"""
KALAVERSE — AI Artisan Digital Business Manager
Launcher script. Starts Flask backend server and hosts frontend on http://localhost:5000
"""
import os
import sys
import webbrowser
import threading
import time

# Ensure workspace root is in python path
WORKSPACE_ROOT = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, WORKSPACE_ROOT)

from backend.app import app
from backend.seed_data import seed_database

def open_browser():
    time.sleep(1.2)
    try:
        webbrowser.open("http://localhost:5000")
    except Exception:
        pass

if __name__ == '__main__':
    print("=" * 65)
    print("KALAVERSE - AI Artisan Digital Business Manager")
    print("=" * 65)
    print("Initializing Database & Seed Data...")
    seed_database()
    print("Starting Web Server at: http://localhost:5000")
    print("=" * 65)

    threading.Thread(target=open_browser, daemon=True).start()
    app.run(host='0.0.0.0', port=5000, debug=False)
