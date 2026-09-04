/**
 * Karigra - Application Router & Screen Coordinator
 */

import { State } from './state.js';
import { renderDiscoverScreen } from './screens/discover.js';
import { renderWelcomeScreen } from './screens/welcome.js';
import { renderOnboardingScreen } from './screens/onboarding.js';
import { renderProfileScreen } from './screens/profile.js';
import { renderDashboardScreen } from './screens/dashboard.js';
import { renderStudioScreen } from './screens/studio.js';
import { renderVoiceScreen } from './screens/voice.js';
import { renderPricingScreen } from './screens/pricing.js';
import { renderApprovalScreen } from './screens/approval.js';
import { renderBuyerCatalogueScreen } from './screens/buyer_catalogue.js';
import { renderWholesaleScreen } from './screens/wholesale.js';
import { renderProductDetailsScreen } from './screens/product_details.js';
import { renderLoginScreen } from './screens/login.js';
import { renderMyProductsScreen } from './screens/my_products.js';
import { renderMarketInsightsScreen } from './screens/market_insights.js';

export const Router = {
  routes: {
    'discover': renderDiscoverScreen,
    'welcome': renderWelcomeScreen,
    'login': renderLoginScreen,
    'onboarding': renderOnboardingScreen,
    'profile': renderProfileScreen,
    'dashboard': renderDashboardScreen,
    'my_products': renderMyProductsScreen,
    'market_insights': renderMarketInsightsScreen,
    'studio': renderStudioScreen,
    'voice': renderVoiceScreen,
    'pricing': renderPricingScreen,
    'approval': renderApprovalScreen,
    'buyer_catalogue': renderBuyerCatalogueScreen,
    'wholesale': renderWholesaleScreen,
    'product_details': renderProductDetailsScreen
  },

  navigate(screenName, payload = null) {
    const outlet = document.getElementById('screen-outlet');
    if (!outlet) return;

    const renderFn = this.routes[screenName] || renderDashboardScreen;

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Render screen
    try {
      const res = renderFn(outlet, payload);
      if (res && typeof res.catch === 'function') {
        res.catch(err => {
          console.error("Screen render async error:", err);
        });
      }
    } catch (err) {
      console.error("Screen render error:", err);
    }

    // Update Bottom Nav active states
    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
      const target = item.dataset.screen;
      if (target === screenName || (screenName === 'product_details' && target === 'buyer_catalogue')) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update Back button visibility
    const backBtn = document.getElementById('header-back-btn');
    if (backBtn) {
      if (screenName === 'product_details' || screenName === 'onboarding' || screenName === 'studio' || screenName === 'voice' || screenName === 'approval' || screenName === 'my_products' || screenName === 'market_insights') {
        backBtn.style.display = 'flex';
      } else {
        backBtn.style.display = 'none';
      }
    }

    // Update FAB visibility (only visible on dashboard / artisan mode)
    const fab = document.getElementById('global-fab-btn');
    if (fab) {
      if (screenName === 'dashboard' || screenName === 'profile') {
        fab.style.display = 'flex';
      } else {
        fab.style.display = 'none';
      }
    }
  }
};
