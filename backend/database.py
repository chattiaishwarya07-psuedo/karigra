"""
KALAVERSE - Database Module
SQLite database with clear schemas ready to scale to PostgreSQL.
"""
import sqlite3
import os
import json
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), 'kalaverse.db')

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Artisans table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS artisans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            craft_category TEXT NOT NULL,
            location_state TEXT NOT NULL,
            location_district TEXT NOT NULL,
            location_town TEXT,
            languages TEXT NOT NULL, -- JSON array e.g. ["Telugu", "Hindi", "English"]
            experience_years INTEGER DEFAULT 0,
            bio TEXT,
            phone TEXT,
            avatar_url TEXT,
            gi_tag_certified BOOLEAN DEFAULT 1,
            heritage_badge TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # 2. Products table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            artisan_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            craft_category TEXT NOT NULL,
            material TEXT,
            technique TEXT,
            dimensions TEXT,
            description TEXT,
            craft_story TEXT,
            tags TEXT, -- JSON array
            status TEXT DEFAULT 'draft', -- 'draft', 'ready_for_review', 'approved', 'published'
            views_count INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (artisan_id) REFERENCES artisans(id) ON DELETE CASCADE
        )
    ''')

    # 3. Product Images
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS product_images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER,
            original_image_url TEXT NOT NULL,
            enhanced_image_url TEXT,
            enhancement_metadata TEXT, -- JSON object of applied filters
            is_primary BOOLEAN DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        )
    ''')

    # 4. Product Translations
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS product_translations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            language_code TEXT NOT NULL, -- 'en', 'te', 'hi'
            language_name TEXT NOT NULL, -- 'English', 'Telugu', 'Hindi'
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            craft_story TEXT,
            material TEXT,
            tags TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
            UNIQUE(product_id, language_code)
        )
    ''')

    # 5. Product Costs
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS product_costs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            raw_material_cost REAL DEFAULT 0,
            labour_hours REAL DEFAULT 0,
            labour_rate_per_hour REAL DEFAULT 0,
            packaging_cost REAL DEFAULT 0,
            transport_cost REAL DEFAULT 0,
            other_cost REAL DEFAULT 0,
            total_cost REAL DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        )
    ''')

    # 6. Price Recommendations
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS price_recommendations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            suggested_price REAL NOT NULL,
            min_price REAL NOT NULL,
            max_price REAL NOT NULL,
            final_price REAL NOT NULL,
            margin_percent REAL,
            factors_breakdown TEXT, -- JSON object explaining AI pricing factors
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        )
    ''')

    # 7. Buyer Enquiries
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS enquiries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            artisan_id INTEGER NOT NULL,
            buyer_name TEXT NOT NULL,
            buyer_email TEXT,
            buyer_phone TEXT NOT NULL,
            quantity INTEGER DEFAULT 1,
            message TEXT,
            delivery_location TEXT,
            status TEXT DEFAULT 'pending', -- 'pending', 'contacted', 'closed'
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
            FOREIGN KEY (artisan_id) REFERENCES artisans(id) ON DELETE CASCADE
        )
    ''')

    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
    print("Database initialized successfully at", DB_PATH)
