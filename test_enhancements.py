import unittest
import os
import json
from backend.services.image_service import imageEnhancementService
from backend.database import get_db_connection

class TestEnhancements(unittest.TestCase):
    def test_image_enhancement_service(self):
        asset_path = os.path.join(os.path.dirname(__file__), 'frontend', 'assets', 'raw_pottery_snap.jpg')
        self.assertTrue(os.path.exists(asset_path), "Sample craft image asset exists")
        res = imageEnhancementService(asset_path, {
            'studio_lighting': True,
            'color_vibrancy': True,
            'super_resolution': True,
            'authenticity_stamp': True,
            'background_cleanup': True
        })
        self.assertTrue(res.get('success'), f"Enhancement succeeded: {res}")
        self.assertTrue('enhanced_image_url' in res)
        self.assertTrue('enhancement_metadata' in res)

    def test_database_prices_are_valid(self):
        conn = get_db_connection()
        rows = conn.execute("SELECT suggested_price, min_price, max_price FROM price_recommendations").fetchall()
        conn.close()
        self.assertGreater(len(rows), 0)
        for r in rows:
            self.assertGreater(r['suggested_price'], 0, "Price must be positive in INR")

if __name__ == '__main__':
    unittest.main()
