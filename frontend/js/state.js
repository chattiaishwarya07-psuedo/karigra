/**
 * KALAVERSE - Global Reactive State Store
 */

export const State = {
  currentArtisan: {
    id: 1,
    name: 'K. Ramulu',
    craft_category: 'Handloom & Textiles',
    location_state: 'Telangana',
    location_district: 'Yadadri Bhuvanagiri',
    location_town: 'Bhoodan Pochampally',
    languages: ['Telugu', 'Hindi', 'English'],
    experience_years: 28,
    bio: 'National Award Winning Master Weaver preserving the 500-year legacy of Pochampally Double Ikat on traditional wooden pit looms.',
    phone: '+91 94401 23456',
    avatar_url: '/assets/artisan_ramulu.jpg',
    gi_tag_certified: 1,
    heritage_badge: 'Master Ikat Weaver • National Awardee'
  },
  artisansList: [],
  activeScreen: 'dashboard',
  previousScreen: null,
  roleMode: 'artisan', // 'artisan' | 'buyer'
  activeLanguage: 'en', // 'en' | 'te' | 'hi' | 'bn' | 'mr' | 'ta' | 'kn' | 'gu'
  selectedProductId: 1,
  enquiries: [],
  unreadEnquiriesCount: 0,

  // Buyer Shopping Cart
  cart: [],

  // Active Draft Product being created in wizard
  draftProduct: {
    artisan_id: 1,
    original_image_url: '/assets/raw_pottery_snap.jpg',
    enhanced_image_url: '/assets/raw_pottery_snap.jpg',
    enhancement_metadata: null,
    audio_language: 'en',
    speech_transcript: '',
    title: '',
    craft_category: 'Handloom & Textiles',
    material: '',
    technique: '',
    dimensions: '',
    description: '',
    craft_story: '',
    tags: [],
    translations: {},
    costs: {
      raw_material_cost: 3500,
      labour_hours: 60,
      labour_rate_per_hour: 120,
      packaging_cost: 200,
      transport_cost: 300,
      other_cost: 150
    },
    pricing: {
      suggested_price: 16500,
      min_price: 14000,
      max_price: 20000,
      final_price: 16500,
      margin_percent: 32.5,
      factors_breakdown: []
    }
  },

  listeners: new Set(),

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },

  notify(event, payload) {
    this.listeners.forEach(cb => cb(event, payload));
  },

  setArtisan(artisan) {
    this.currentArtisan = artisan;
    if (artisan) {
      this.draftProduct.artisan_id = artisan.id;
    }
    this.notify('artisan_changed', artisan);
  },

  setScreen(screenName, payload = null) {
    if (this.activeScreen !== screenName) {
      this.previousScreen = this.activeScreen;
    }
    this.activeScreen = screenName;
    if (payload && payload.productId) {
      this.selectedProductId = payload.productId;
    }
    this.notify('screen_changed', { screen: screenName, payload });
  },

  setSelectedProduct(productId) {
    this.selectedProductId = productId;
  },

  setRoleMode(mode) {
    this.roleMode = mode;
    this.notify('role_changed', mode);
  },

  setLanguage(langCode) {
    this.activeLanguage = langCode;
    this.notify('language_changed', langCode);
  },

  updateDraft(updates) {
    this.draftProduct = { ...this.draftProduct, ...updates };
    this.notify('draft_updated', this.draftProduct);
  },

  resetDraft() {
    this.draftProduct = {
      artisan_id: this.currentArtisan ? this.currentArtisan.id : 1,
      original_image_url: '/assets/raw_pottery_snap.jpg',
      enhanced_image_url: '/assets/raw_pottery_snap.jpg',
      enhancement_metadata: null,
      audio_language: this.activeLanguage,
      speech_transcript: '',
      title: '',
      craft_category: this.currentArtisan ? this.currentArtisan.craft_category : 'Handloom & Textiles',
      material: '',
      technique: '',
      dimensions: '',
      description: '',
      craft_story: '',
      tags: [],
      translations: {},
      costs: {
        raw_material_cost: 3500,
        labour_hours: 60,
        labour_rate_per_hour: 120,
        packaging_cost: 200,
        transport_cost: 300,
        other_cost: 150
      },
      pricing: {
        suggested_price: 16500,
        min_price: 14000,
        max_price: 20000,
        final_price: 16500,
        margin_percent: 32.5,
        factors_breakdown: []
      }
    };
    this.notify('draft_reset', this.draftProduct);
  },

  // --- Cart Management Methods ---
  loadCart() {
    try {
      const saved = localStorage.getItem('kalamarket_cart');
      if (saved) {
        this.cart = JSON.parse(saved);
      }
    } catch (e) {}
    return this.cart;
  },

  saveCart() {
    try {
      localStorage.setItem('kalamarket_cart', JSON.stringify(this.cart));
    } catch (e) {}
    this.notify('cart_updated', this.cart);
  },

  addToCart(product, quantity = 1) {
    this.loadCart();
    const existingIndex = this.cart.findIndex(item => item.id === product.id);
    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
    } else {
      this.cart.push({
        id: product.id,
        title: product.title,
        artisan_name: product.artisan_name || 'Master Artisan',
        price: product.price || product.final_price || 1800,
        image_url: product.image_url || product.enhanced_image_url || product.original_image_url || '/assets/raw_pottery_snap.jpg',
        category: product.category || product.craft_category || 'Handicraft',
        quantity: quantity
      });
    }
    this.saveCart();
  },

  removeFromCart(productId) {
    this.loadCart();
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveCart();
  },

  updateCartQuantity(productId, delta) {
    this.loadCart();
    const item = this.cart.find(item => item.id === productId);
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) {
        this.cart = this.cart.filter(i => i.id !== productId);
      }
      this.saveCart();
    }
  },

  clearCart() {
    this.cart = [];
    this.saveCart();
  },

  getCartCount() {
    this.loadCart();
    return this.cart.reduce((total, item) => total + (item.quantity || 1), 0);
  },

  getCartTotal() {
    this.loadCart();
    return this.cart.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 1)), 0);
  }
};
