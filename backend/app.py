"""
KALAVERSE - Main Flask Application Server
Exposes clean REST APIs for all 9 screens, AI services, and serves the responsive frontend.
"""

import os
import json
import uuid

from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename

from .database import init_db
from .models import ArtisanModel, ProductModel, EnquiryModel
from .services.image_service import imageEnhancementService
from .services.speech_service import speechToTextService, getAvailableVoicePresets
from .services.catalogue_service import (
    generateCatalogueService,
    translateProductDescriptionService,
    autoFillProductDetailsService,
)
from .services.pricing_service import calculatePriceRecommendation
from .services.insights_service import generateMarketInsightsService
from .seed_data import seed_database


# ============================================================
# PATH CONFIGURATION
# ============================================================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")

# Vercel serverless functions can write only to /tmp.
# Local development continues to use backend/uploads.
if os.environ.get("VERCEL"):
    UPLOADS_DIR = os.path.join("/tmp", "karigra_uploads")
else:
    UPLOADS_DIR = os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        "uploads",
    )

os.makedirs(UPLOADS_DIR, exist_ok=True)


# ============================================================
# FLASK APPLICATION
# ============================================================

app = Flask(__name__, static_folder=FRONTEND_DIR)


# ============================================================
# CORS
# ============================================================

@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET,PUT,POST,DELETE,OPTIONS"
    return response


# ============================================================
# STATIC & FRONTEND ROUTES
# ============================================================

@app.route("/")
def index():
    return send_from_directory(FRONTEND_DIR, "index.html")


@app.route("/assets/<path:filename>")
def serve_assets(filename):
    return send_from_directory(
        os.path.join(FRONTEND_DIR, "assets"),
        filename,
    )


@app.route("/css/<path:filename>")
def serve_css(filename):
    return send_from_directory(
        os.path.join(FRONTEND_DIR, "css"),
        filename,
        mimetype="text/css",
    )


@app.route("/js/<path:filename>")
def serve_js(filename):
    return send_from_directory(
        os.path.join(FRONTEND_DIR, "js"),
        filename,
        mimetype="application/javascript",
    )


@app.route("/uploads/<path:filename>")
def serve_uploads(filename):
    return send_from_directory(UPLOADS_DIR, filename)


# ============================================================
# ARTISAN PROFILE APIS
# ============================================================

@app.route("/api/artisans", methods=["GET", "POST"])
def handle_artisans():
    if request.method == "GET":
        artisans = ArtisanModel.get_all()
        return jsonify({
            "success": True,
            "artisans": artisans,
        })

    data = request.json or {}
    new_artisan = ArtisanModel.create(data)

    return jsonify({
        "success": True,
        "artisan": new_artisan,
    }), 201


@app.route("/api/artisans/<int:artisan_id>", methods=["GET"])
def get_artisan(artisan_id):
    artisan = ArtisanModel.get_by_id(artisan_id)

    if not artisan:
        return jsonify({
            "success": False,
            "error": "Artisan not found",
        }), 404

    return jsonify({
        "success": True,
        "artisan": artisan,
    })


# ============================================================
# PRODUCT APIS
# ============================================================

@app.route("/api/products", methods=["GET", "POST"])
def handle_products():
    if request.method == "GET":
        artisan_id = request.args.get("artisan_id", type=int)
        status = request.args.get("status")
        category = request.args.get("category")

        products = ProductModel.get_all(
            artisan_id=artisan_id,
            status=status,
            category=category,
        )

        return jsonify({
            "success": True,
            "products": products,
        })

    data = request.json or {}
    new_product = ProductModel.create(data)

    return jsonify({
        "success": True,
        "product": new_product,
    }), 201


@app.route("/api/products/<int:product_id>", methods=["GET", "PUT", "DELETE"])
def handle_single_product(product_id):
    if request.method == "GET":
        product = ProductModel.get_by_id(product_id)

        if not product:
            return jsonify({
                "success": False,
                "error": "Product not found",
            }), 404

        return jsonify({
            "success": True,
            "product": product,
        })

    elif request.method == "PUT":
        data = request.json or {}
        updated_product = ProductModel.update(product_id, data)

        return jsonify({
            "success": True,
            "product": updated_product,
        })

    elif request.method == "DELETE":
        success = ProductModel.delete(product_id)

        if not success:
            return jsonify({
                "success": False,
                "error": "Product not found",
            }), 404

        return jsonify({
            "success": True,
            "message": "Product deleted successfully",
        })


# ============================================================
# AI PRODUCT STUDIO: IMAGE ENHANCEMENT API
# ============================================================

@app.route("/api/enhance-image", methods=["POST"])
def enhance_image():
    uploaded_file = request.files.get("image")

    image_url = request.form.get("image_url")

    if not image_url and request.is_json:
        image_url = request.json.get("image_url")

    options_raw = request.form.get("options")

    if not options_raw and request.is_json:
        options_raw = request.json.get("options")

    options = {}

    if options_raw:
        if isinstance(options_raw, str):
            try:
                options = json.loads(options_raw)
            except Exception:
                options = {}

        elif isinstance(options_raw, dict):
            options = options_raw

    filepath = None
    orig_url = None

    # --------------------------------------------------------
    # Uploaded image
    # --------------------------------------------------------

    if uploaded_file and uploaded_file.filename:
        filename = (
            f"upload_{uuid.uuid4().hex[:8]}_"
            f"{secure_filename(uploaded_file.filename)}"
        )

        filepath = os.path.join(UPLOADS_DIR, filename)

        uploaded_file.save(filepath)

        orig_url = f"/uploads/{filename}"

    # --------------------------------------------------------
    # Existing image URL
    # --------------------------------------------------------

    elif image_url:
        clean_path = image_url.lstrip("/")

        if clean_path.startswith("assets/"):
            filepath = os.path.join(FRONTEND_DIR, clean_path)

        elif clean_path.startswith("uploads/"):
            filepath = os.path.join(
                UPLOADS_DIR,
                os.path.basename(clean_path),
            )

        else:
            filepath = os.path.join(
                UPLOADS_DIR,
                os.path.basename(clean_path),
            )

        orig_url = image_url

    # --------------------------------------------------------
    # Default demo image
    # --------------------------------------------------------

    else:
        filepath = os.path.join(
            FRONTEND_DIR,
            "assets",
            "raw_pottery_snap.jpg",
        )

        orig_url = "/assets/raw_pottery_snap.jpg"

    # --------------------------------------------------------
    # Enhancement service
    # --------------------------------------------------------

    res = imageEnhancementService(filepath, options)

    if res.get("success"):
        res["original_image_url"] = orig_url
        return jsonify(res)

    return jsonify(res), 500


# ============================================================
# VOICE → CATALOGUE APIS
# ============================================================

@app.route("/api/voice-presets", methods=["GET"])
def get_voice_presets():
    presets = getAvailableVoicePresets()

    return jsonify({
        "success": True,
        "presets": presets,
    })


@app.route("/api/speech-to-text", methods=["POST"])
def process_speech():
    data = request.json or {}

    lang = data.get("language_code", "te")
    preset_id = data.get("sample_preset_id")

    result = speechToTextService(
        language_code=lang,
        sample_preset_id=preset_id,
    )

    return jsonify(result)


@app.route("/api/generate-catalogue", methods=["POST"])
def generate_catalogue():
    data = request.json or {}

    transcript = data.get("transcript", "")
    lang = data.get("language_code", "te")
    category = data.get("craft_category")

    result = generateCatalogueService(
        transcript=transcript,
        language_code=lang,
        craft_category=category,
    )

    return jsonify(result)


@app.route("/api/translate-description", methods=["POST"])
def translate_description():
    data = request.json or {}

    text = data.get("text", "")
    source_lang = data.get("source_language", "hi")
    target_lang = data.get("target_language", "en")
    category = data.get("craft_category")

    result = translateProductDescriptionService(
        text,
        source_lang,
        target_lang,
        category,
    )

    return jsonify(result)


@app.route("/api/auto-fill-details", methods=["POST"])
def auto_fill_details():
    data = request.json or {}

    description = data.get("description", "")
    image_url = data.get("image_url", "")
    category = data.get("craft_category")

    result = autoFillProductDetailsService(
        description,
        image_url=image_url,
        craft_category=category,
    )

    return jsonify(result)


# ============================================================
# AI PRICING ASSISTANT API
# ============================================================

@app.route("/api/calculate-price", methods=["POST"])
def calculate_price():
    data = request.json or {}

    costs = data.get("costs") or {}

    if not isinstance(costs, dict):
        costs = {}

    if (
        "raw_material_cost" in data
        and "raw_material_cost" not in costs
    ):
        costs["raw_material_cost"] = data.get("raw_material_cost")

    if (
        "labour_hours" in data
        and "labour_hours" not in costs
    ):
        costs["labour_hours"] = data.get("labour_hours")

    if (
        "labour_rate_per_hour" in data
        and "labour_rate_per_hour" not in costs
    ):
        costs["labour_rate_per_hour"] = data.get(
            "labour_rate_per_hour"
        )

    category = (
        data.get("craft_category")
        or data.get("category")
        or "Handloom"
    )

    gi_tag = data.get(
        "gi_tag_certified",
        True,
    )

    experience_years = data.get(
        "experience_years",
        10,
    )

    result = calculatePriceRecommendation(
        costs,
        category,
        gi_tag,
        experience_years,
    )

    return jsonify(result)


# ============================================================
# BUYER ENQUIRY APIS
# ============================================================

@app.route("/api/enquiries", methods=["POST"])
def create_enquiry():
    data = request.json or {}

    enquiry = EnquiryModel.create(data)

    return jsonify({
        "success": True,
        "enquiry": enquiry,
    }), 201


@app.route("/api/artisans/<int:artisan_id>/enquiries", methods=["GET"])
def get_artisan_enquiries(artisan_id):
    enquiries = EnquiryModel.get_by_artisan(artisan_id)

    return jsonify({
        "success": True,
        "enquiries": enquiries,
    })


# ============================================================
# AI MARKET INSIGHTS API
# ============================================================

@app.route("/api/market-insights", methods=["GET"])
def get_market_insights():
    artisan_id = request.args.get(
        "artisan_id",
        type=int,
    )

    category = request.args.get("category")

    insights = generateMarketInsightsService(
        artisan_id=artisan_id,
        craft_category=category,
    )

    return jsonify(insights)


# ============================================================
# DATABASE INITIALIZATION
# ============================================================

# Initialize the local SQLite database only when running
# outside Vercel. Vercel uses its own serverless environment.
if not os.environ.get("VERCEL"):
    try:
        init_db()
    except Exception as exc:
        print("Database initialization warning:", exc)


# ============================================================
# MAIN ENTRY POINT
# ============================================================

if __name__ == "__main__":
    init_db()
    seed_database()

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=False,
    )