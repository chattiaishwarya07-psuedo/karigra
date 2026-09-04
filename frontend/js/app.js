/**
 * Karigra - Main App Entry Point & Bootstrap
 * Connects all screens, navigation events, language translations, cart drawer, and state listeners
 */

import { State } from './state.js';
import { API } from './api.js';
import { Router } from './router.js';
import { t, changeLanguage, SUPPORTED_LANGUAGES } from './i18n.js';
import { Icons } from './icons.js';
import { CartDrawer } from './cart_drawer.js';

function initApp() {
  // 1. Restore Language & Auth from localStorage safely
  try {
    const savedLang = localStorage.getItem('kalamarket_lang');
    if (savedLang) {
      State.activeLanguage = savedLang;
    }
    const savedAuth = localStorage.getItem('kalamarket_auth');
    if (savedAuth) {
      const parsed = JSON.parse(savedAuth);
      if (parsed.role) State.roleMode = parsed.role;
      if (parsed.artisan) State.currentArtisan = parsed.artisan;
    }
  } catch (e) {}

  // 2. Set default artisan with authentic portrait avatar if null or if avatar is a product/saree
  if (!State.currentArtisan || !State.currentArtisan.avatar_url || State.currentArtisan.avatar_url === '/assets/ikat_saree.jpg' || State.currentArtisan.avatar_url.includes('saree')) {
    State.currentArtisan = {
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
    };
    try {
      localStorage.setItem('kalamarket_auth', JSON.stringify({ role: State.roleMode, artisan: State.currentArtisan }));
    } catch (e) {}
  }

  // 3. Initialize Cart Drawer
  CartDrawer.init();

  // 4. Update Header and Bottom Nav Labels based on i18n
  function updateHeaderAndNavText() {
    const brandText = document.getElementById('header-brand-text');
    if (brandText) {
      brandText.textContent = t('brand_name');
    } else {
      const brandLink = document.getElementById('header-brand-link');
      if (brandLink) brandLink.textContent = t('brand_name');
    }

    const switchBtn = document.getElementById('switch-view-btn');
    if (switchBtn) {
      if (State.roleMode === 'artisan') {
        switchBtn.innerHTML = `<span style="display: flex; align-items: center; gap: 5px;">${Icons.user(14)} ${t('artisan_view')}</span>`;
        switchBtn.title = "Current: Artisan View (Click to switch to Buyer Market)";
      } else {
        switchBtn.innerHTML = `<span style="display: flex; align-items: center; gap: 5px;">${Icons.shoppingBag(14)} ${t('buyer_view')}</span>`;
        switchBtn.title = "Current: Buyer Market (Click to switch to Artisan View)";
      }
    }

    const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === State.activeLanguage) || SUPPORTED_LANGUAGES[0];
    const langLabel = document.getElementById('current-lang-label');
    if (langLabel) {
      langLabel.textContent = currentLang.english;
    }

    // Update bottom nav labels
    document.querySelectorAll('.bottom-nav [data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (key) el.textContent = t(key);
    });

    // Update active class on lang options
    document.querySelectorAll('.lang-opt-btn').forEach(btn => {
      if (btn.dataset.lang === State.activeLanguage) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update cart badge
    CartDrawer.updateBadge();
  }

  // 5. Subscribe to State changes
  State.subscribe((event, payload) => {
    if (event === 'screen_changed') {
      Router.navigate(payload.screen, payload.payload);
      updateHeaderAndNavText();
    } else if (event === 'role_changed') {
      if (payload === 'buyer') {
        State.setScreen('buyer_catalogue');
      } else {
        State.setScreen('dashboard');
      }
      updateHeaderAndNavText();
    } else if (event === 'language_changed') {
      updateHeaderAndNavText();
      Router.navigate(State.activeScreen);
    }
  });

  // 6. Bind Header Navigation Buttons
  const brandLink = document.getElementById('header-brand-link');
  if (brandLink) {
    brandLink.addEventListener('click', () => {
      State.setScreen(State.roleMode === 'buyer' ? 'buyer_catalogue' : 'dashboard');
    });
  }

  const backBtn = document.getElementById('header-back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (State.activeScreen === 'product_details') {
        State.setScreen(State.previousScreen || (State.roleMode === 'artisan' ? 'my_products' : 'buyer_catalogue'));
      } else if (State.activeScreen === 'my_products' || State.activeScreen === 'market_insights') {
        State.setScreen('dashboard');
      } else if (State.activeScreen === 'onboarding' || State.activeScreen === 'login') {
        State.setScreen('welcome');
      } else if (State.activeScreen === 'studio' || State.activeScreen === 'voice' || State.activeScreen === 'approval' || State.activeScreen === 'pricing') {
        State.setScreen('dashboard');
      } else {
        State.setScreen(State.roleMode === 'buyer' ? 'buyer_catalogue' : 'dashboard');
      }
    });
  }

  const switchViewBtn = document.getElementById('switch-view-btn');
  if (switchViewBtn) {
    switchViewBtn.addEventListener('click', () => {
      if (State.roleMode === 'artisan') {
        State.setRoleMode('buyer');
      } else {
        State.setRoleMode('artisan');
      }
    });
  }

  // 7. Bind Header Cart Button
  const headerCartBtn = document.getElementById('header-cart-btn');
  if (headerCartBtn) {
    headerCartBtn.addEventListener('click', () => {
      CartDrawer.open();
    });
  }

  // 8. Language Dropdown in Header
  const langSelectorBtn = document.getElementById('lang-selector-btn');
  const langMenu = document.getElementById('lang-dropdown-menu');

  if (langSelectorBtn && langMenu) {
    langSelectorBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      langMenu.style.display = (langMenu.style.display === 'none' || !langMenu.style.display) ? 'flex' : 'none';
    });

    document.addEventListener('click', () => {
      if (langMenu) langMenu.style.display = 'none';
    });

    document.querySelectorAll('.lang-opt-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const lang = btn.dataset.lang;
        changeLanguage(lang);
        if (langMenu) langMenu.style.display = 'none';
      });
    });
  }

  // 9. Bind Global Hamburger Menu (Quick Screen Jumper)
  const menuBtn = document.getElementById('header-menu-btn');
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      const choice = prompt(
        "Karigra Quick Screen Navigator:\n" +
        "1. Discover Karigra (Landing Overview)\n" +
        "2. Welcome & Language Selection (Stitch Screen 1A)\n" +
        "3. Login (Phone OTP / Email / Google / Demo)\n" +
        "4. Join Karigra Onboarding / Sign Up (Stitch Screen 1B)\n" +
        "5. Artisan Dashboard (Stitch Screen 3)\n" +
        "6. Add Product: AI Photo Studio (Stitch Screen 4)\n" +
        "7. Add Product: Voice & AI Pricing (Stitch Screen 6)\n" +
        "8. Add Product: Publish Approval\n" +
        "9. Buyer Marketplace (Stitch Screen 8)\n" +
        "10. Wholesale Raw Materials Sourcing (Stitch Screen 7)\n" +
        "11. Product Details & Custom Order (Stitch Screen 4)\n" +
        "12. Artisan Profile\n\nEnter number (1-12):",
        "5"
      );

      const map = {
        "1": "discover",
        "2": "welcome",
        "3": "login",
        "4": "onboarding",
        "5": "dashboard",
        "6": "studio",
        "7": "voice",
        "8": "approval",
        "9": "buyer_catalogue",
        "10": "wholesale",
        "11": "product_details",
        "12": "profile"
      };

      if (choice && map[choice.trim()]) {
        State.setScreen(map[choice.trim()]);
      }
    });
  }

  // 10. Bind Global FAB Button (Add Product)
  const fabBtn = document.getElementById('global-fab-btn');
  if (fabBtn) {
    fabBtn.addEventListener('click', () => {
      State.resetDraft();
      State.setScreen('studio');
    });
  }

  // 11. Bind Bottom Navigation Bar Items
  document.querySelectorAll('.bottom-nav .nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetScreen = btn.dataset.screen;
      if (targetScreen) {
        if (targetScreen === 'buyer_catalogue') {
          State.setRoleMode('buyer');
        } else if (targetScreen === 'dashboard') {
          State.setRoleMode('artisan');
        }
        State.setScreen(targetScreen);
      }
    });
  });

  // 12. Instant Initial Render
  updateHeaderAndNavText();
  Router.navigate(State.activeScreen);

  // 13. Background load of artisans list
  API.getArtisans().then(res => {
    if (res && res.success && res.artisans && res.artisans.length > 0) {
      State.artisansList = res.artisans;
    }
  }).catch(() => {});
}

// Start application when DOM is ready or immediately if already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
