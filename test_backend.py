"""
Verification test script for KALAVERSE backend APIs and static assets.
"""
import unittest
import json
import os
import sys

# Ensure root in path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from backend.app import app
from backend.seed_data import seed_database

class TestKalaverseApp(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        seed_database()
        cls.client = app.test_client()

    def test_01_index_page(self):
        res = self.client.get('/')
        self.assertEqual(res.status_code, 200)
        self.assertTrue(b'KalaMarket' in res.data or b'KALAVERSE' in res.data)

    def test_02_get_artisans(self):
        res = self.client.get('/api/artisans')
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertTrue(data['success'])
        self.assertGreaterEqual(len(data['artisans']), 4)

    def test_03_get_products(self):
        res = self.client.get('/api/products')
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertTrue(data['success'])
        self.assertGreaterEqual(len(data['products']), 4)

    def test_04_enhance_image(self):
        res = self.client.post('/api/enhance-image', 
                               json={'image_url': '/assets/raw_pottery_snap.jpg', 'options': {'studio_lighting': True}})
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertTrue(data['success'])
        self.assertTrue('enhanced_image_url' in data)

    def test_05_speech_and_catalogue(self):
        stt_res = self.client.post('/api/speech-to-text', json={'language_code': 'te', 'sample_preset_id': 'te'})
        self.assertEqual(stt_res.status_code, 200)
        stt_data = json.loads(stt_res.data)
        self.assertTrue(stt_data['success'])

        cat_res = self.client.post('/api/generate-catalogue', json={'transcript': stt_data['transcript'], 'language_code': 'te'})
        self.assertEqual(cat_res.status_code, 200)
        cat_data = json.loads(cat_res.data)
        self.assertTrue(cat_data['success'])
        self.assertTrue('translations' in cat_data)

    def test_06_pricing_assistant(self):
        costs = {'raw_material_cost': 3500, 'labour_hours': 60, 'labour_rate_per_hour': 120}
        res = self.client.post('/api/calculate-price', json={'costs': costs, 'craft_category': 'Handloom & Textiles'})
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertTrue(data['success'])
        self.assertEqual(data['labour_cost'], 7200)
        self.assertEqual(data['base_cost'], 10700)
        self.assertGreaterEqual(data['suggested_price'], 10700)
        self.assertGreater(data['suggested_price'], 3500)
        self.assertGreaterEqual(data['min_price'], 10700)
        self.assertGreaterEqual(data['max_price'], data['suggested_price'])
        self.assertGreaterEqual(data['margin_percent'], 25)

    def test_07_buyer_enquiry(self):
        enq_payload = {
            'product_id': 1,
            'artisan_id': 1,
            'buyer_name': 'Test Buyer',
            'buyer_phone': '+91 99999 88888',
            'quantity': 2,
            'message': 'Test Enquiry'
        }
        res = self.client.post('/api/enquiries', json=enq_payload)
        self.assertEqual(res.status_code, 201)
        data = json.loads(res.data)
        self.assertTrue(data['success'])

    def test_08_translate_description(self):
        payload = {
            'text': 'यह हस्तनिर्मित टेराकोटा ज्यामितीय फूलदान है',
            'source_language': 'hi',
            'target_language': 'en',
            'craft_category': 'Pottery & Terracotta'
        }
        res = self.client.post('/api/translate-description', json=payload)
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertTrue(data['success'])
        self.assertTrue('translated_text' in data)

    def test_09_create_full_product(self):
        prod_payload = {
            'artisan_id': 1,
            'title': 'Test Handwoven Ikat Stole Temporary',
            'craft_category': 'Handloom & Textiles',
            'material': 'Mulberry Silk',
            'technique': 'Double Ikat Weave',
            'dimensions': '2m x 0.5m',
            'description': 'Handcrafted pure silk stole.',
            'craft_story': 'Pochampally heritage.',
            'original_image_url': '/assets/ikat_saree.jpg',
            'enhanced_image_url': '/assets/ikat_saree.jpg',
            'pricing': {'suggested_price': 2400, 'final_price': 2400},
            'status': 'published'
        }
        res = self.client.post('/api/products', json=prod_payload)
        self.assertEqual(res.status_code, 201)
        data = json.loads(res.data)
        self.assertTrue(data['success'])
        self.assertEqual(data['product']['title'], 'Test Handwoven Ikat Stole Temporary')
        
        # Clean up test product using DELETE API
        created_id = data['product']['id']
        del_res = self.client.delete(f'/api/products/{created_id}')
        self.assertEqual(del_res.status_code, 200)
        del_data = json.loads(del_res.data)
        self.assertTrue(del_data['success'])

    def test_10_delete_product(self):
        # Create temporary product
        prod_payload = {
            'artisan_id': 1,
            'title': 'Product To Delete',
            'craft_category': 'Woodcraft & Carvings',
            'status': 'published'
        }
        create_res = self.client.post('/api/products', json=prod_payload)
        self.assertEqual(create_res.status_code, 201)
        prod_id = json.loads(create_res.data)['product']['id']

        # Delete product
        del_res = self.client.delete(f'/api/products/{prod_id}')
        self.assertEqual(del_res.status_code, 200)
        data = json.loads(del_res.data)
        self.assertTrue(data['success'])

        # Verify not found
        get_res = self.client.get(f'/api/products/{prod_id}')
        self.assertEqual(get_res.status_code, 404)

    def test_11_auto_fill_details(self):
        payload = {
            'description': 'Handcrafted pure mulberry silk Pochampally double ikat saree with gold zari border, length 6.3m x 46 inches',
            'image_url': '/assets/ikat_saree.jpg'
        }
        res = self.client.post('/api/auto-fill-details', json=payload)
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertTrue(data['success'])
        self.assertEqual(data['craft_category'], 'Handloom & Textiles')
        self.assertTrue('Pochampally' in data['title'] or 'Ikat' in data['title'] or 'Silk' in data['title'])
        self.assertTrue('Silk' in data['material'])
        self.assertTrue(len(data['craft_story']) > 20)
        self.assertTrue('6.3m' in data['dimensions'])

    def test_12_market_insights(self):
        res = self.client.get('/api/market-insights?artisan_id=1&category=Handloom+%26+Textiles')
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertTrue(data['success'])
        self.assertEqual(data['primary_category'], 'Handloom & Textiles')
        self.assertGreaterEqual(data['category_demand_score'], 80)
        self.assertTrue(len(data['creation_ideas']) >= 3)
        self.assertTrue(len(data['trending_categories']) >= 4)
        self.assertTrue(len(data['top_keywords']) >= 3)

if __name__ == '__main__':
    unittest.main()

