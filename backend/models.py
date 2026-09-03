"""
KALAVERSE - Models & Data Access Layer
Clean parameterized queries for artisans, products, pricing, and enquiries.
"""
import json
from .database import get_db_connection

class ArtisanModel:
    @staticmethod
    def get_all():
        conn = get_db_connection()
        rows = conn.execute("SELECT * FROM artisans ORDER BY id ASC").fetchall()
        conn.close()
        result = []
        for r in rows:
            d = dict(r)
            d['languages'] = json.loads(d['languages']) if d['languages'] else []
            result.append(d)
        return result

    @staticmethod
    def get_by_id(artisan_id):
        conn = get_db_connection()
        row = conn.execute("SELECT * FROM artisans WHERE id = ?", (artisan_id,)).fetchone()
        conn.close()
        if not row:
            return None
        d = dict(row)
        d['languages'] = json.loads(d['languages']) if d['languages'] else []
        return d

    @staticmethod
    def create(data):
        conn = get_db_connection()
        cursor = conn.cursor()
        langs = json.dumps(data.get('languages', ["English"]))
        cursor.execute('''
            INSERT INTO artisans (name, craft_category, location_state, location_district, 
                                 location_town, languages, experience_years, bio, phone, 
                                 avatar_url, gi_tag_certified, heritage_badge)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data.get('name'),
            data.get('craft_category'),
            data.get('location_state', 'Telangana'),
            data.get('location_district', 'Yadadri Bhuvanagiri'),
            data.get('location_town', 'Pochampally'),
            langs,
            data.get('experience_years', 10),
            data.get('bio', ''),
            data.get('phone', '+91 98765 43210'),
            data.get('avatar_url', ''),
            1 if data.get('gi_tag_certified', True) else 0,
            data.get('heritage_badge', 'Master Weaver')
        ))
        artisan_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return ArtisanModel.get_by_id(artisan_id)


class ProductModel:
    @staticmethod
    def get_all(artisan_id=None, status=None, category=None):
        conn = get_db_connection()
        query = '''
            SELECT p.*, a.name as artisan_name, a.location_district, a.location_state,
                   i.original_image_url, i.enhanced_image_url,
                   pr.final_price, pr.suggested_price, pr.min_price, pr.max_price
            FROM products p
            JOIN artisans a ON p.artisan_id = a.id
            LEFT JOIN product_images i ON p.id = i.product_id AND i.is_primary = 1
            LEFT JOIN price_recommendations pr ON p.id = pr.product_id
            WHERE 1=1
        '''
        params = []
        if artisan_id:
            query += " AND p.artisan_id = ?"
            params.append(artisan_id)
        if status:
            query += " AND p.status = ?"
            params.append(status)
        if category and category != 'all':
            query += " AND p.craft_category = ?"
            params.append(category)

        query += " ORDER BY p.created_at DESC"
        rows = conn.execute(query, params).fetchall()
        conn.close()

        products = []
        for r in rows:
            p = dict(r)
            p['tags'] = json.loads(p['tags']) if p['tags'] else []
            products.append(p)
        return products

    @staticmethod
    def get_by_id(product_id):
        conn = get_db_connection()
        row = conn.execute('''
            SELECT p.*, a.name as artisan_name, a.location_district, a.location_state, a.bio as artisan_bio, a.phone as artisan_phone,
                   i.original_image_url, i.enhanced_image_url, i.enhancement_metadata,
                   pr.final_price, pr.suggested_price, pr.min_price, pr.max_price, pr.margin_percent, pr.factors_breakdown,
                   pc.raw_material_cost, pc.labour_hours, pc.labour_rate_per_hour, pc.packaging_cost, pc.transport_cost, pc.other_cost, pc.total_cost
            FROM products p
            JOIN artisans a ON p.artisan_id = a.id
            LEFT JOIN product_images i ON p.id = i.product_id AND i.is_primary = 1
            LEFT JOIN price_recommendations pr ON p.id = pr.product_id
            LEFT JOIN product_costs pc ON p.id = pc.product_id
            WHERE p.id = ?
        ''', (product_id,)).fetchone()

        if not row:
            conn.close()
            return None

        product = dict(row)
        product['tags'] = json.loads(product['tags']) if product['tags'] else []
        if product.get('enhancement_metadata'):
            try:
                product['enhancement_metadata'] = json.loads(product['enhancement_metadata'])
            except Exception:
                pass
        if product.get('factors_breakdown'):
            try:
                product['factors_breakdown'] = json.loads(product['factors_breakdown'])
            except Exception:
                pass

        # Load translations
        trans_rows = conn.execute("SELECT * FROM product_translations WHERE product_id = ?", (product_id,)).fetchall()
        translations = {}
        for tr in trans_rows:
            tr_dict = dict(tr)
            if tr_dict.get('tags'):
                tr_dict['tags'] = json.loads(tr_dict['tags'])
            translations[tr_dict['language_code']] = tr_dict
        product['translations'] = translations

        conn.close()
        return product

    @staticmethod
    def create(data):
        conn = get_db_connection()
        cursor = conn.cursor()
        tags_json = json.dumps(data.get('tags', []))
        cursor.execute('''
            INSERT INTO products (artisan_id, title, craft_category, material, technique, dimensions, description, craft_story, tags, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data.get('artisan_id', 1),
            data.get('title', 'Untitled Craft'),
            data.get('craft_category', 'Handloom'),
            data.get('material', 'Pure Silk'),
            data.get('technique', 'Handwoven Ikat'),
            data.get('dimensions', '5.5m x 1.2m'),
            data.get('description', ''),
            data.get('craft_story', ''),
            tags_json,
            data.get('status', 'draft')
        ))
        product_id = cursor.lastrowid

        # Insert primary image if provided
        if data.get('original_image_url'):
            cursor.execute('''
                INSERT INTO product_images (product_id, original_image_url, enhanced_image_url, enhancement_metadata, is_primary)
                VALUES (?, ?, ?, ?, 1)
            ''', (
                product_id,
                data.get('original_image_url'),
                data.get('enhanced_image_url', data.get('original_image_url')),
                json.dumps(data.get('enhancement_metadata', {}))
            ))

        # Insert costs if provided
        costs = data.get('costs', {})
        total_cost = (
            float(costs.get('raw_material_cost', 0)) +
            (float(costs.get('labour_hours', 0)) * float(costs.get('labour_rate_per_hour', 0))) +
            float(costs.get('packaging_cost', 0)) +
            float(costs.get('transport_cost', 0)) +
            float(costs.get('other_cost', 0))
        )
        cursor.execute('''
            INSERT INTO product_costs (product_id, raw_material_cost, labour_hours, labour_rate_per_hour, packaging_cost, transport_cost, other_cost, total_cost)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            product_id,
            costs.get('raw_material_cost', 0),
            costs.get('labour_hours', 0),
            costs.get('labour_rate_per_hour', 0),
            costs.get('packaging_cost', 0),
            costs.get('transport_cost', 0),
            costs.get('other_cost', 0),
            total_cost
        ))

        # Insert pricing if provided
        pricing = data.get('pricing', {})
        cursor.execute('''
            INSERT INTO price_recommendations (product_id, suggested_price, min_price, max_price, final_price, margin_percent, factors_breakdown)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            product_id,
            pricing.get('suggested_price', 0),
            pricing.get('min_price', 0),
            pricing.get('max_price', 0),
            pricing.get('final_price', pricing.get('suggested_price', 0)),
            pricing.get('margin_percent', 35.0),
            json.dumps(pricing.get('factors_breakdown', {}))
        ))

        # Insert translations if provided
        translations = data.get('translations', {})
        for lang_code, tr in translations.items():
            cursor.execute('''
                INSERT INTO product_translations (product_id, language_code, language_name, title, description, craft_story, material, tags)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                product_id,
                lang_code,
                tr.get('language_name', lang_code.upper()),
                tr.get('title', data.get('title')),
                tr.get('description', data.get('description')),
                tr.get('craft_story', data.get('craft_story')),
                tr.get('material', data.get('material')),
                json.dumps(tr.get('tags', []))
            ))

        conn.commit()
        conn.close()
        return ProductModel.get_by_id(product_id)

    @staticmethod
    def update(product_id, data):
        conn = get_db_connection()
        cursor = conn.cursor()

        fields = []
        params = []
        for k in ['title', 'craft_category', 'material', 'technique', 'dimensions', 'description', 'craft_story', 'status']:
            if k in data:
                fields.append(f"{k} = ?")
                params.append(data[k])

        if 'tags' in data:
            fields.append("tags = ?")
            params.append(json.dumps(data['tags']))

        fields.append("updated_at = CURRENT_TIMESTAMP")

        if fields:
            params.append(product_id)
            cursor.execute(f"UPDATE products SET {', '.join(fields)} WHERE id = ?", params)

        # Update pricing if final_price updated
        if 'final_price' in data:
            cursor.execute("UPDATE price_recommendations SET final_price = ? WHERE product_id = ?", (data['final_price'], product_id))

        if 'enhanced_image_url' in data:
            cursor.execute("UPDATE product_images SET enhanced_image_url = ? WHERE product_id = ? AND is_primary = 1", (data['enhanced_image_url'], product_id))

        conn.commit()
        conn.close()
        return ProductModel.get_by_id(product_id)

    @staticmethod
    def delete(product_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM product_translations WHERE product_id = ?", (product_id,))
        cursor.execute("DELETE FROM product_costs WHERE product_id = ?", (product_id,))
        cursor.execute("DELETE FROM price_recommendations WHERE product_id = ?", (product_id,))
        cursor.execute("DELETE FROM product_images WHERE product_id = ?", (product_id,))
        cursor.execute("DELETE FROM enquiries WHERE product_id = ?", (product_id,))
        cursor.execute("DELETE FROM products WHERE id = ?", (product_id,))
        deleted = cursor.rowcount > 0
        conn.commit()
        conn.close()
        return deleted


class EnquiryModel:
    @staticmethod
    def create(data):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO enquiries (product_id, artisan_id, buyer_name, buyer_email, buyer_phone, quantity, message, delivery_location, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
        ''', (
            data.get('product_id'),
            data.get('artisan_id'),
            data.get('buyer_name'),
            data.get('buyer_email'),
            data.get('buyer_phone'),
            data.get('quantity', 1),
            data.get('message', ''),
            data.get('delivery_location', '')
        ))
        enquiry_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return EnquiryModel.get_by_id(enquiry_id)

    @staticmethod
    def get_by_id(enquiry_id):
        conn = get_db_connection()
        row = conn.execute('''
            SELECT e.*, p.title as product_title, a.name as artisan_name
            FROM enquiries e
            JOIN products p ON e.product_id = p.id
            JOIN artisans a ON e.artisan_id = a.id
            WHERE e.id = ?
        ''', (enquiry_id,)).fetchone()
        conn.close()
        return dict(row) if row else None

    @staticmethod
    def get_by_artisan(artisan_id):
        conn = get_db_connection()
        rows = conn.execute('''
            SELECT e.*, p.title as product_title, i.enhanced_image_url as product_image
            FROM enquiries e
            JOIN products p ON e.product_id = p.id
            LEFT JOIN product_images i ON p.id = i.product_id AND i.is_primary = 1
            WHERE e.artisan_id = ?
            ORDER BY e.created_at DESC
        ''', (artisan_id,)).fetchall()
        conn.close()
        return [dict(r) for r in rows]
