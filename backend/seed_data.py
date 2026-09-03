"""
KALAVERSE - Seed Data Script
Initializes the database and inserts realistic sample artisans, products, translations, and enquiries.
"""
import os
import json
from .database import init_db, get_db_connection

def seed_database(force=False):
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if already seeded
    if not force:
        artisan_count = cursor.execute("SELECT COUNT(*) FROM artisans").fetchone()[0]
        if artisan_count > 0:
            print("Database already contains data. Skipping re-seed.")
            conn.close()
            return

    print("Seeding KALAVERSE database with diverse authentic Indian handicrafts...")

    # Clear existing data if force
    if force:
        cursor.execute("DELETE FROM enquiries")
        cursor.execute("DELETE FROM product_translations")
        cursor.execute("DELETE FROM price_recommendations")
        cursor.execute("DELETE FROM product_costs")
        cursor.execute("DELETE FROM product_images")
        cursor.execute("DELETE FROM products")
        cursor.execute("DELETE FROM artisans")

    # 1. Insert Artisans
    artisans = [
        (
            1,
            "K. Ramulu",
            "Handloom & Textiles",
            "Telangana",
            "Yadadri Bhuvanagiri",
            "Bhoodan Pochampally",
            json.dumps(["Telugu", "Hindi", "English"]),
            28,
            "National Award Winning Master Weaver preserving the 500-year legacy of Pochampally Double Ikat on traditional wooden pit looms.",
            "+91 94401 23456",
            "/assets/artisan_ramulu.jpg",
            1,
            "Master Ikat Weaver • National Awardee"
        ),
        (
            2,
            "Mohd. Saleem",
            "Metalware & Heritage Art",
            "Karnataka",
            "Bidar",
            "Old Fort Colony",
            json.dumps(["Hindi", "English", "Kannada"]),
            22,
            "4th generation Bidriware craftsman specializing in intricate pure silver wire Tarkashi work with heritage Bahmani motifs.",
            "+91 98450 67890",
            "/assets/artisan_saleem.jpg",
            1,
            "Master Bidri Inlayer • State Heritage Fellow"
        ),
        (
            3,
            "Budhram Baghel",
            "Brass & Bell Metal Craft",
            "Chhattisgarh",
            "Bastar",
            "Kondagaon",
            json.dumps(["Hindi", "Chhattisgarhi"]),
            19,
            "Indigenous tribal artist practicing 4000-year-old hollow lost-wax bronze and brass casting inspired by Bastar folklore.",
            "+91 97520 11223",
            "/assets/artisan_budhram.jpg",
            1,
            "Dhokra Tribal Master"
        ),
        (
            4,
            "Sunita Devi",
            "Pottery & Terracotta",
            "Rajasthan",
            "Jaipur",
            "Sanganer",
            json.dumps(["Hindi", "English", "Rajasthani"]),
            15,
            "Pioneering woman artisan blending historic Jaipur turquoise blue pottery with modern functional ceramics and quartz glazes.",
            "+91 98290 55443",
            "/assets/artisan_sunita.jpg",
            1,
            "Master Ceramist • Craft Guild Leader"
        ),
        (
            5,
            "Artisan Rahul",
            "Woodcraft & Carvings",
            "Uttar Pradesh",
            "Saharanpur",
            "Purani Mandi",
            json.dumps(["Hindi", "English", "Punjabi"]),
            24,
            "Master artisan in Saharanpur GI woodcraft specializing in intricately hand-chiseled sheesham teak wood with delicate floral fretwork and brass wire inlay.",
            "+91 98370 12345",
            "/assets/artisan_rahul.jpg",
            1,
            "Master Woodcarver • Saharanpur Guild"
        )
    ]

    for a in artisans:
        cursor.execute('''
            INSERT INTO artisans (id, name, craft_category, location_state, location_district, 
                                 location_town, languages, experience_years, bio, phone, 
                                 avatar_url, gi_tag_certified, heritage_badge)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', a)

    # 2. Insert Diverse Authentic Products (Unique ID, Unique Title, Unique Image, Unique Category)

    # Product 1: Pochampally Double Ikat Silk Saree (Handloom)
    cursor.execute('''
        INSERT INTO products (id, artisan_id, title, craft_category, material, technique, dimensions, description, craft_story, tags, status, views_count)
        VALUES (1, 1, 'GI Tagged Authentic Pochampally Double Ikat Pure Silk Saree', 'Handloom & Textiles', 
                '100% Pure Mulberry Silk with Gold Zari Border', 'Traditional Pochampally Double Ikat Handloom Weave', 
                'Length: 6.3m (with 0.8m blouse), Width: 46 inches',
                'Exquisite handcrafted Pochampally Ikat silk saree woven meticulously over 12 days by master weavers. Featuring iconic diamond geometric ikat motifs dyed with natural colors and enriched with an opulent golden zari border.',
                'Pochampally Ikat from Telangana is a centuries-old Geographical Indication (GI) heritage craft renowned worldwide for its mathematically precise tie-and-dye patterns before weaving on pit looms.',
                ?, 'published', 342)
    ''', (json.dumps(["Pochampally Silk", "Handloom Saree", "Ikat Geometric", "GI Certified", "Bridal Wear"]),))
    
    cursor.execute('''
        INSERT INTO product_images (product_id, original_image_url, enhanced_image_url, enhancement_metadata, is_primary)
        VALUES (1, '/assets/ikat_saree.jpg', '/assets/ikat_saree.jpg', ?, 1)
    ''', (json.dumps({"applied_filters": ["studio_lighting", "color_vibrancy", "super_resolution", "authenticity_stamp"]}),))

    cursor.execute('''
        INSERT INTO price_recommendations (product_id, suggested_price, min_price, max_price, final_price, margin_percent, factors_breakdown)
        VALUES (1, 8500, 7200, 10500, 8500, 28.4, ?)
    ''', (json.dumps([{"name": "Base Silk & 72h Labour", "impact": "₹6,200"}, {"name": "GI Heritage Premium", "impact": "+15%"} ]),))

    cursor.execute('''
        INSERT INTO product_translations (product_id, language_code, language_name, title, description, craft_story, material, tags)
        VALUES 
        (1, 'en', 'English', 'GI Tagged Authentic Pochampally Double Ikat Pure Silk Saree', 
         'Exquisite handcrafted Pochampally Ikat silk saree woven meticulously over 12 days by master weavers.',
         'Pochampally Ikat from Telangana is a centuries-old Geographical Indication (GI) heritage craft.',
         '100% Pure Mulberry Silk with Gold Zari Border', ?),
        (1, 'te', 'Telugu', 'జిఐ గుర్తింపు పొందిన సాంప్రదాయ పోచంపల్లి డబుల్ ఇక్కత్ స్వచ్ఛమైన పట్టు చీర',
         'చేనేత కళాకారులచే 12 రోజుల కఠిన పరిశ్రమతో రూపొందించబడిన స్వచ్ఛమైన పోచంపల్లి పట్టు చీర.',
         'తెలంగాణలోని పోచంపల్లి గ్రామానికి చెందిన ఈ కళ భౌగోళిక గుర్తింపు (GI Tag) పొందిన ప్రసిద్ధ చేనేత సంస్కృతి.',
         '100% స్వచ్ఛమైన మల్బరీ పట్టు మరియు బంగారు జరీ అంచు', ?),
        (1, 'hi', 'Hindi', 'जीआई टैग प्रमाणित पारंपरिक पोचमपल्ली डबल इकत शुद्ध रेशम साड़ी',
         'कुशल बुनकरों द्वारा 12 दिनों के समर्पण से तैयार की गई प्रामाणिक पोचमपल्ली इकत सिल्क साड़ी।',
         'तेलंगाना की पोचमपल्ली इकत एक सदियों पुरानी जीआई टैग प्राप्त धरोहर कला है।',
         '100% शुद्ध मलबरी रेशम एवं स्वर्ण जरी बॉर्डर', ?)
    ''', (
        json.dumps(["Pochampally", "Silk", "Ikat"]),
        json.dumps(["పోచంపల్లి", "పట్టు", "ఇక్కత్"]),
        json.dumps(["पोचमपल्ली", "रेशम", "इकत"])
    ))

    # Product 2: Royal Bidriware Silver Inlay Vase (Metalware)
    cursor.execute('''
        INSERT INTO products (id, artisan_id, title, craft_category, material, technique, dimensions, description, craft_story, tags, status, views_count)
        VALUES (2, 2, 'Royal Bidriware Handcrafted Silver Inlay Zinc-Copper Flower Vase', 'Metalware & Heritage Art',
                'Zinc & Copper Alloy with Pure Silver Wire (99.9%)', 'Centuries-old Persian Tarkashi & Soil Oxidation',
                'Height: 12 Inches, Base: 4.5 Inches, Weight: 1.8 kg',
                'Regal handcrafted Bidriware decorative vase featuring intricate floral arabesque motifs inlaid with pure silver wire on a lustrous jet-black zinc alloy background.',
                'Bidriware is an imperial metal handicraft dating back to the 14th century Bahmani Sultanate.',
                ?, 'published', 289)
    ''', (json.dumps(["Bidriware", "Silver Inlay", "Persian Floral", "GI Certified", "Royal Decor"]),))

    cursor.execute('''
        INSERT INTO product_images (product_id, original_image_url, enhanced_image_url, enhancement_metadata, is_primary)
        VALUES (2, '/assets/bidriware_vase.jpg', '/assets/bidriware_vase.jpg', ?, 1)
    ''', (json.dumps({"applied_filters": ["studio_lighting", "color_vibrancy", "super_resolution"]}),))

    cursor.execute('''
        INSERT INTO price_recommendations (product_id, suggested_price, min_price, max_price, final_price, margin_percent, factors_breakdown)
        VALUES (2, 4200, 3600, 5200, 4200, 32.5, ?)
    ''', (json.dumps([{"name": "Silver Inlay & Alloy Cost", "impact": "₹2,800"}, {"name": "Tarkashi Hand Engraving", "impact": "+20% Skill"}]),))

    # Product 3: Lost-Wax Dhokra Tribal Musician (Brass & Bell Metal)
    cursor.execute('''
        INSERT INTO products (id, artisan_id, title, craft_category, material, technique, dimensions, description, craft_story, tags, status, views_count)
        VALUES (3, 3, 'Authentic Bastar Dhokra Lost-Wax Brass Tribal Musician Figurine', 'Brass & Bell Metal Craft',
                'Recycled Brass & Bell Metal Alloy, Natural Beeswax', '4000-Year-Old Ancient Lost-Wax Hollow Casting',
                'Height: 8.5 Inches, Width: 5.5 Inches, Weight: 1.2 kg',
                'Captivating handcrafted Dhokra brass sculpture depicting a seated folk drummer. Each piece is one-of-a-kind as the clay wax mould is destroyed during molten metal casting.',
                'Dhokra is an unbroken 4,000-year-old non-ferrous metal casting craft practiced by indigenous artisans of Bastar.',
                ?, 'published', 195)
    ''', (json.dumps(["Dhokra Craft", "Lost Wax Casting", "Bastar Tribal Art", "GI Tagged"]),))

    cursor.execute('''
        INSERT INTO product_images (product_id, original_image_url, enhanced_image_url, enhancement_metadata, is_primary)
        VALUES (3, '/assets/dhokra_brass.jpg', '/assets/dhokra_brass.jpg', ?, 1)
    ''', (json.dumps({"applied_filters": ["studio_lighting", "color_vibrancy"]}),))

    cursor.execute('''
        INSERT INTO price_recommendations (product_id, suggested_price, min_price, max_price, final_price, margin_percent, factors_breakdown)
        VALUES (3, 2600, 2100, 3400, 2600, 31.0, ?)
    ''', (json.dumps([{"name": "Brass Metal & Wax Mould", "impact": "₹1,400"}, {"name": "Ancient Tribal Artform", "impact": "High Demand"}]),))

    # Product 4: Jaipur Blue Pottery Ceramic Wall Plate (Pottery)
    cursor.execute('''
        INSERT INTO products (id, artisan_id, title, craft_category, material, technique, dimensions, description, craft_story, tags, status, views_count)
        VALUES (4, 4, 'Traditional Jaipur Blue Pottery Hand-Painted Floral Ceramic Wall Plate', 'Pottery & Terracotta',
                'Quartz Stone Powder, Glass, Multani Mitti & Cobalt Oxide Glaze', 'Hand-Shaped Quartz Dough, Hand-Painted & Kiln Fired',
                'Diameter: 12 Inches, Depth: 1.5 Inches',
                'Vibrant hand-painted Jaipur Blue Pottery wall plate adorned with cobalt blue and turquoise arabesque floral designs.',
                'Jaipur Blue Pottery is unique because it uses no clay—made entirely from quartz stone powder, raw glass, and natural gum.',
                ?, 'published', 178)
    ''', (json.dumps(["Blue Pottery", "Jaipur Craft", "Ceramic Plate", "GI Certified", "Hand Painted"]),))

    cursor.execute('''
        INSERT INTO product_images (product_id, original_image_url, enhanced_image_url, enhancement_metadata, is_primary)
        VALUES (4, '/assets/blue_pottery.jpg', '/assets/blue_pottery.jpg', ?, 1)
    ''', (json.dumps({"applied_filters": ["studio_lighting", "color_vibrancy"]}),))

    cursor.execute('''
        INSERT INTO price_recommendations (product_id, suggested_price, min_price, max_price, final_price, margin_percent, factors_breakdown)
        VALUES (4, 1850, 1500, 2400, 1850, 35.0, ?)
    ''', (json.dumps([{"name": "Quartz & Cobalt Glaze", "impact": "₹900"}, {"name": "GI Jaipur Craft Value", "impact": "+15%"}]),))

    # Product 5: Hand-Thrown Terracotta Geometric Studio Urn (Pottery)
    cursor.execute('''
        INSERT INTO products (id, artisan_id, title, craft_category, material, technique, dimensions, description, craft_story, tags, status, views_count)
        VALUES (5, 4, 'Hand-Thrown Terracotta Geometric Studio Vase', 'Pottery & Terracotta',
                'All-Natural Riverbed Clay, Organic Wood Ash Polish', 'Wheel Thrown & Hand-Chiseled Sun-Fired Pottery',
                'Height: 10 Inches, Diameter: 8 Inches, Capacity: 3.5 L',
                'Rustic, hand-shaped earthen urn with traditional tribal concentric geometric etchings. Naturally cooling and organic warmth.',
                'Terracotta pottery is one of India oldest continuous artforms rooted in the Indus Valley civilization.',
                ?, 'published', 420)
    ''', (json.dumps(["Terracotta", "Clay Pottery", "Eco Friendly", "Handmade Vase"]),))

    cursor.execute('''
        INSERT INTO product_images (product_id, original_image_url, enhanced_image_url, enhancement_metadata, is_primary)
        VALUES (5, '/assets/raw_pottery_snap.jpg', '/assets/raw_pottery_snap.jpg', ?, 1)
    ''', (json.dumps({"applied_filters": ["studio_lighting"]}),))

    cursor.execute('''
        INSERT INTO price_recommendations (product_id, suggested_price, min_price, max_price, final_price, margin_percent, factors_breakdown)
        VALUES (5, 4500, 3800, 5500, 4500, 42.0, ?)
    ''', (json.dumps([{"name": "Riverbed Clay & Wood Firing", "impact": "₹1,200"}]),))

    # Product 6: Saharanpur Hand-Carved Teak Heritage Bowl (Woodcraft)
    cursor.execute('''
        INSERT INTO products (id, artisan_id, title, craft_category, material, technique, dimensions, description, craft_story, tags, status, views_count)
        VALUES (6, 5, 'GI Tagged Saharanpur Hand-Carved Sheesham Wood Floral Heritage Bowl', 'Woodcraft & Carvings',
                'Seasoned Sheesham Wood (Indian Rosewood) with Pure Brass Wire Inlay', 'Hand-Chiseled Deep Floral Relief Carving & Natural Wax Polish',
                'Diameter: 9.5 Inches, Height: 4.5 Inches, Weight: 850g',
                'Mastercrafted Saharanpur floral wooden bowl hand-chiseled from single-block seasoned sheesham hardwood with exquisite leaf patterns and brass inlay accents.',
                'Saharanpur in Uttar Pradesh is globally acclaimed as the City of Wood Carvings with a rich 400-year Mughal legacy.',
                ?, 'published', 342)
    ''', (json.dumps(["Woodcraft", "Saharanpur Carving", "Sheesham Wood", "Brass Inlay", "GI Tagged"]),))

    cursor.execute('''
        INSERT INTO product_images (product_id, original_image_url, enhanced_image_url, enhancement_metadata, is_primary)
        VALUES (6, '/assets/woodcraft_bowl.jpg', '/assets/woodcraft_bowl.jpg', ?, 1)
    ''', (json.dumps({"applied_filters": ["studio_lighting", "detail_enhancement"]}),))

    cursor.execute('''
        INSERT INTO price_recommendations (product_id, suggested_price, min_price, max_price, final_price, margin_percent, factors_breakdown)
        VALUES (6, 1450, 1150, 1900, 1450, 38.0, ?)
    ''', (json.dumps([{"name": "Seasoned Sheesham Wood", "impact": "₹650"}, {"name": "Master Hand Carving", "impact": "+25%"}]),))

    # 3. Insert Realistic Buyer Enquiries
    enquiries = [
        (1, 1, "Pooja Hegde (FabIndia Sourcing)", "pooja.hegde@fabindia.com", "+91 98200 45678", 5, "Hello Ramulu ji, we love this Pochampally Ikat silk saree design! Would you be able to supply 5 pieces in royal blue and maroon for our Diwali heritage collection? Please let us know delivery lead time.", "Bengaluru, Karnataka", "pending"),
        (1, 1, "Ananya Rao", "ananya.rao@gmail.com", "+91 99887 66554", 1, "Is custom blouse sizing possible with this pure silk saree? Also can we arrange expedited shipping to Hyderabad?", "Hyderabad, Telangana", "pending"),
        (2, 2, "Vikramaditya Oberoi", "v.oberoi@oberoihotels.com", "+91 98110 33445", 10, "Greetings Saleem sahab. We are renovating our luxury suite lounges and wish to place 10 authentic Bidriware vases. Please share bulk B2B price quote.", "New Delhi", "pending"),
        (3, 3, "Rajeshwari Sharma (Tribal Co-op)", "rajeshwari@craftsbazaar.in", "+91 97112 88990", 3, "Interested in your Dhokra tribal drummer sculptures for our museum gallery exhibition.", "Mumbai, Maharashtra", "pending"),
        (6, 5, "Kabir Mehta", "kabir.mehta@decorstudio.in", "+91 98190 77665", 8, "Interested in ordering 8 pieces of the Saharanpur hand-carved sheesham wooden bowl for corporate gift hampers.", "Gurugram, Haryana", "pending")
    ]

    for eq in enquiries:
        cursor.execute('''
            INSERT INTO enquiries (product_id, artisan_id, buyer_name, buyer_email, buyer_phone, quantity, message, delivery_location, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', eq)

    conn.commit()
    conn.close()
    print("Database seeding completed successfully with 5 artisans, 6 diverse products, and 5 buyer enquiries!")

if __name__ == '__main__':
    seed_database(force=True)
