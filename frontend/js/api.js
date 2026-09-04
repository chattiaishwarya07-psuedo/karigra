/**
 * Karigra - API Client
 * Centralized async fetch client for REST endpoints.
 */

const API_BASE = '';

export const API = {
  // Artisans
  async getArtisans() {
    const res = await fetch(`${API_BASE}/api/artisans`);
    return await res.json();
  },

  async getArtisan(id) {
    const res = await fetch(`${API_BASE}/api/artisans/${id}`);
    return await res.json();
  },

  async createArtisan(data) {
    const res = await fetch(`${API_BASE}/api/artisans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  // Products
  async getProducts(params = {}) {
    let query = '';
    if (typeof params === 'number' || typeof params === 'string') {
      query = `artisan_id=${params}`;
    } else if (params && typeof params === 'object') {
      query = new URLSearchParams(params).toString();
    }
    const res = await fetch(`${API_BASE}/api/products${query ? '?' + query : ''}`);
    return await res.json();
  },

  async getProduct(id) {
    const res = await fetch(`${API_BASE}/api/products/${id}`);
    return await res.json();
  },

  async createProduct(data) {
    const res = await fetch(`${API_BASE}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async updateProduct(id, data) {
    const res = await fetch(`${API_BASE}/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async deleteProduct(id) {
    const res = await fetch(`${API_BASE}/api/products/${id}`, {
      method: 'DELETE'
    });
    return await res.json();
  },

  // Image Enhancement
  async enhanceImage(formDataOrData) {
    let options = { method: 'POST' };
    if (formDataOrData instanceof FormData) {
      options.body = formDataOrData;
    } else {
      options.headers = { 'Content-Type': 'application/json' };
      options.body = JSON.stringify(formDataOrData);
    }
    const res = await fetch(`${API_BASE}/api/enhance-image`, options);
    return await res.json();
  },

  // Voice & Catalogue
  async getVoicePresets() {
    const res = await fetch(`${API_BASE}/api/voice-presets`);
    return await res.json();
  },

  async processSpeech(langCode = 'te', presetId = null) {
    const res = await fetch(`${API_BASE}/api/speech-to-text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language_code: langCode, sample_preset_id: presetId })
    });
    return await res.json();
  },

  async generateCatalogue(transcript, langCode = 'te', category = null) {
    const res = await fetch(`${API_BASE}/api/generate-catalogue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript, language_code: langCode, craft_category: category })
    });
    return await res.json();
  },

  async translateDescription(text, sourceLang = 'hi', targetLang = 'en', category = null) {
    const res = await fetch(`${API_BASE}/api/translate-description`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, source_language: sourceLang, target_language: targetLang, craft_category: category })
    });
    return await res.json();
  },

  async autoFillDetails(data) {
    const res = await fetch(`${API_BASE}/api/auto-fill-details`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  // Pricing
  async calculatePrice(costs, category = 'Handloom', giTag = true, expYears = 10) {
    const res = await fetch(`${API_BASE}/api/calculate-price`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ costs, craft_category: category, gi_tag_certified: giTag, experience_years: expYears })
    });
    return await res.json();
  },

  async calculatePricing(data) {
    const res = await fetch(`${API_BASE}/api/calculate-price`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  // Enquiries
  async submitEnquiry(data) {
    const res = await fetch(`${API_BASE}/api/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async getArtisanEnquiries(artisanId) {
    const res = await fetch(`${API_BASE}/api/artisans/${artisanId}/enquiries`);
    return await res.json();
  },

  // AI Market Insights & Trends
  async getMarketInsights(artisanId = null, category = null) {
    let params = new URLSearchParams();
    if (artisanId) params.append('artisan_id', artisanId);
    if (category) params.append('category', category);
    const query = params.toString();
    const res = await fetch(`${API_BASE}/api/market-insights${query ? '?' + query : ''}`);
    return await res.json();
  }
};
