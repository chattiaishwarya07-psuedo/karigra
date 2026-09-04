# Karigra — AI Artisan Digital Business Manager
**Smart India Hackathon (SIH 26090)**

> Transform an authentic craft photograph and regional-language voice description into a market-ready, multilingual e-commerce digital listing with AI pricing.

---

## 🌟 Core Features & Screens

1. **Welcome / Onboarding**: Artisan profile creation with craft category, district, spoken languages (Telugu, Hindi, English), and quick demo persona switchers.
2. **Artisan Profile**: GI Tag certified profile, experience badges, craft lineage story, and performance metrics.
3. **Artisan Dashboard**: Active products count, real-time unread buyer enquiries, views, and quick access feature cards.
4. **AI Product Studio**: Image upload & interactive **Before vs After split slider** with studio lighting, sharpening, color vibrancy boost, and GI authenticity watermark stamps.
5. **Voice → Catalogue Studio**: Regional speech input in **Telugu (తెలుగు)**, **Hindi (हिन्दी)**, and **English** with real-time waveform visualizer, STT transcription, and structured e-commerce catalogue extraction.
6. **Multilingual Support**: Real-time sync across English, Telugu, and Hindi with Web Speech API text-to-speech pronunciation.
7. **AI Pricing Assistant**: Production cost breakdown (materials, labour hours, packaging, logistics) + algorithmic pricing engine factoring GI Tag authenticity and export market benchmarks.
8. **Product Approval & Publishing**: High-fidelity boutique preview card with bilingual specs, draft saving, and 1-click marketplace publishing.
9. **Buyer Catalogue & Enquiry**: Customer-facing marketplace with category filters, search, and direct enquiry submission that instantly alerts the artisan's dashboard.

---

## 🚀 Quick Start

### 1. Requirements
- Python 3.9+
- Flask, Pillow, requests

### 2. Start Application
```bash
python run.py
```
Open your browser to: **`http://localhost:5000`**

---

## 🏛️ Architecture & Modular AI Services

```
KALAVERSE/
├── backend/
│   ├── app.py                      # Flask REST API server
│   ├── database.py                 # SQLite database schema (PostgreSQL ready)
│   ├── models.py                   # Data access queries
│   ├── services/
│   │   ├── image_service.py        # imageEnhancementService() interface (Pillow / AI)
│   │   ├── speech_service.py       # speechToTextService() for Telugu, Hindi, English
│   │   ├── catalogue_service.py    # generateCatalogueService() AI listing extraction
│   │   └── pricing_service.py      # calculatePriceRecommendation() fair price engine
│   └── seed_data.py                # Initial artisans, products & buyer enquiries
├── frontend/
│   ├── index.html                  # Single-page container
│   ├── css/
│   │   ├── main.css                # Luxury artisanal design tokens & resets
│   │   ├── components.css          # Cards, buttons, step wizards, before-after slider
│   │   └── screens.css             # Layouts for all 9 screens
│   ├── js/
│   │   ├── api.js                  # Centralized REST API client
│   │   ├── state.js                # Global reactive state
│   │   ├── router.js               # Screen navigation
│   │   ├── speech.js               # Audio recording, waveform visualizer & TTS
│   │   ├── image_slider.js         # Interactive Before vs After comparison widget
│   │   └── screens/                # All 9 individual screen modules
│   └── assets/                     # High-res craft photos & assets
├── run.py                          # Single-command launcher
└── requirements.txt
```

---

## 🎯 Recommended SIH Demo Workflow

1. **Dashboard**: View active metrics for **K. Ramulu** (Pochampally Master Weaver).
2. **AI Product Studio**: Select the *Raw Terracotta Pot* preset or upload a phone snap, click **Enhance with AI Studio**, and drag the **Before/After slider** to show studio lighting correction and GI certification watermark.
3. **Voice → Catalogue**: Click the **Telugu preset** (`🎧 Telugu: K. Ramulu`) to simulate live Telugu speech; view live transcription and auto-generated English, Telugu, and Hindi structured catalogues.
4. **AI Pricing Assistant**: Review raw silk cost (₹3,800) and 60 hours of artisan labour; see the AI factor breakdown and adjust the final price slider.
5. **Publish**: Click **Publish to Buyer Marketplace**.
6. **Buyer Catalogue**: Switch to the Buyer Market, open the published item, and submit a **Buyer Enquiry**.
7. **Return to Dashboard**: Verify the new enquiry immediately appears in the artisan's unread notification feed with direct WhatsApp connectivity.
