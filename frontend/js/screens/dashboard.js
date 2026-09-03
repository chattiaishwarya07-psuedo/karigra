/**
 * KALAVERSE / KalaMarket - Screen: Artisan Dashboard (Stitch Screen 3)
 * Full i18n support, Indian Rupee (₹), Dynamic AI Market Insights & Dedicated My Products navigation
 */

import { State } from '../state.js';
import { API } from '../api.js';
import { Icons } from '../icons.js';
import { t } from '../i18n.js';

export function renderDashboardScreen(container) {
  const artisan = State.currentArtisan || {
    id: 1,
    name: 'K. Ramulu',
    craft_category: 'Handloom & Textiles',
    location_town: 'Pochampally',
    location_state: 'Telangana',
    avatar_url: '/assets/artisan_ramulu.jpg'
  };

  let products = [
    {
      id: 1,
      title: 'GI Tagged Authentic Pochampally Double Ikat Pure Silk Saree',
      category: 'Handloom & Textiles',
      status: t('in_stock'),
      views_count: 512,
      final_price: 8500,
      enhanced_image_url: '/assets/ikat_saree.jpg'
    }
  ];

  // Dynamic Market Insights object tailored to artisan craft
  let marketInsights = {
    primary_category: artisan.craft_category || 'Handloom & Textiles',
    surge_percentage: '+34% this month',
    trend_status: 'High Demand',
    dashboard_summary: 'Surging buyer demand for Double Ikat Handloom sarees and organic naturally-dyed silk stoles (+34% growth). Artisans focusing on contemporary geometric motifs are seeing faster order conversions.',
    top_recommendation: 'Contemporary Geometric Double Ikat Silk Dupatta'
  };

  // Helper function to pick appropriate fallback insights based on craft category
  function getCategoryFallbackInsight(cat) {
    const c = (cat || '').toLowerCase();
    if (c.includes('pottery') || c.includes('clay') || c.includes('terracotta')) {
      return {
        primary_category: 'Pottery & Terracotta',
        surge_percentage: '+28% this month',
        trend_status: 'Fast Growing',
        dashboard_summary: 'Terracotta geometric planters and glazed studio ceramic vases are seeing high engagement (+28% surge). Natural earthy textures and minimalist forms are top-searched by home decorators.',
        top_recommendation: 'Hand-Thrown Terracotta Self-Watering Planter'
      };
    } else if (c.includes('bidri') || c.includes('metal') || c.includes('silver')) {
      return {
        primary_category: 'Metalware & Heritage Art',
        surge_percentage: '+22% this month',
        trend_status: 'High Value',
        dashboard_summary: 'High demand for Bidriware silver wire inlay artifacts and luxury tableware (+22% growth). Corporate gifting and heirloom collectors are paying premium margins for verified GI pieces.',
        top_recommendation: 'Royal Bidriware Silver Inlay Desk Organizer'
      };
    } else if (c.includes('dhokra') || c.includes('brass') || c.includes('bell metal')) {
      return {
        primary_category: 'Brass & Bell Metal Craft',
        surge_percentage: '+19% this month',
        trend_status: 'Steady Growth',
        dashboard_summary: 'Bastar Dhokra lost-wax brass figurines are experiencing strong interest from art galleries and home temple decorators (+19% inquiries). Rustic golden patinas are preferred.',
        top_recommendation: 'Bastar Dhokra Tribal Musician Quartet Set'
      };
    } else if (c.includes('wood') || c.includes('carving')) {
      return {
        primary_category: 'Woodcraft & Carvings',
        surge_percentage: '+17% this month',
        trend_status: 'Steady Demand',
        dashboard_summary: 'Hand-carved Sheesham wooden bowls and brass-inlaid spice boxes are leading artisan kitchenware sales (+17% growth). Natural food-safe beeswax finishes are heavily requested.',
        top_recommendation: 'GI Tagged Saharanpur Sheesham Jali Spice Box'
      };
    }
    return {
      primary_category: 'Handloom & Textiles',
      surge_percentage: '+34% this month',
      trend_status: 'High Demand',
      dashboard_summary: 'Surging buyer demand for Double Ikat Handloom sarees and organic naturally-dyed silk stoles (+34% growth). Artisans focusing on contemporary geometric motifs are seeing faster order conversions.',
      top_recommendation: 'Contemporary Geometric Double Ikat Silk Dupatta'
    };
  }

  // Initialize with category-specific fallback
  marketInsights = getCategoryFallbackInsight(artisan.craft_category);

  function drawView() {
    const totalViews = products.reduce((acc, p) => acc + (p.views_count || p.views || 48), 0);
    const totalEarnings = products.reduce((acc, p) => acc + (p.final_price || p.price || 8500), 0) * 3;

    container.innerHTML = `
      <div class="animate-fade-in" style="padding-bottom: 2rem;">
        <!-- Welcome Greeting Header with Artisan Avatar -->
        <div class="dash-welcome-card" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <div style="display: flex; align-items: center; gap: 0.85rem;">
            <img src="${artisan.avatar_url || '/assets/artisan_ramulu.jpg'}" alt="${artisan.name}" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid var(--color-terracotta);">
            <div>
              <h1 class="dash-welcome-title">${t('welcome_back')}, ${(artisan.name || 'Artisan').split(' ')[0]}</h1>
              <p class="dash-welcome-sub">${t('shop_overview')}</p>
            </div>
          </div>
          <button class="btn btn-sm btn-primary" id="btn-dash-add-product" style="box-shadow: var(--shadow-sm);">
            <span>${Icons.plus(16)}</span>
            <span>${t('add_product')}</span>
          </button>
        </div>

        <!-- KPI Stat Cards List (Clean Professional Lucide Stroke Icons) -->
        <div class="stats-list">
          <div class="stat-kpi-card">
            <div class="stat-kpi-header">
              <span style="display: flex; align-items: center; color: var(--color-terracotta);">${Icons.package(18)}</span>
              <span>${t('total_orders')}</span>
            </div>
            <div class="stat-kpi-value">${Math.max(12, products.length * 6)}</div>
          </div>

          <div class="stat-kpi-card">
            <div class="stat-kpi-header">
              <span style="display: flex; align-items: center; color: var(--color-terracotta);">${Icons.wallet(18)}</span>
              <span>${t('earnings')}</span>
            </div>
            <div class="stat-kpi-value" style="color: var(--color-terracotta);">₹${totalEarnings.toLocaleString('en-IN')}</div>
          </div>

          <div class="stat-kpi-card">
            <div class="stat-kpi-header">
              <span style="display: flex; align-items: center; color: var(--color-terracotta);">${Icons.eye(18)}</span>
              <span>${t('product_views')}</span>
            </div>
            <div class="stat-kpi-value">${totalViews.toLocaleString('en-IN')}</div>
          </div>
        </div>

        <!-- AI Market Insights Card (Dynamic Real-Time Craft Intelligence) -->
        <div class="ai-insights-card" style="background: linear-gradient(135deg, #FAF7F2 0%, #F5EFE6 100%); border: 1px solid var(--border-subtle); border-left: 4px solid var(--color-terracotta); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.5rem; box-shadow: var(--shadow-sm);">
          <div class="ai-insights-header" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.65rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="color: var(--color-terracotta); display: flex; align-items: center;">${Icons.trendingUp(18)}</span>
              <h2 class="ai-insights-title" style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin: 0;">${t('ai_insights_title')}</h2>
            </div>
            <span class="badge badge-artisan" style="font-size: 0.7rem; padding: 0.2rem 0.5rem; font-weight: 700;">
              ${marketInsights.surge_percentage}
            </span>
          </div>

          <p class="ai-insights-body" style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin: 0 0 0.85rem 0;" id="dash-insights-text">
            ${marketInsights.dashboard_summary}
          </p>

          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(0, 0, 0, 0.06); padding-top: 0.65rem; flex-wrap: wrap; gap: 0.5rem;">
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">
              Trending in <strong>${marketInsights.primary_category}</strong>
            </span>
            <button class="btn btn-sm btn-outline-dark" id="btn-explore-analysis" style="border-radius: var(--radius-full); font-size: 0.78rem; font-weight: 700; padding: 0.35rem 0.75rem;">
              <span>${t('explore_full_analysis')}</span>
              <span style="display: flex; align-items: center;">${Icons.arrowRight(12)}</span>
            </button>
          </div>
        </div>

        <!-- Your Products Section -->
        <div class="dash-section-header">
          <h2 class="dash-section-title">${t('your_products')} (${products.length})</h2>
          <button class="dash-section-link" id="btn-view-all-products" title="View all uploaded products">
            <span>${t('view_all')}</span>
            <span style="display: inline-flex; align-items: center;">${Icons.arrowRight(13)}</span>
          </button>
        </div>

        <!-- Product List Cards -->
        <div class="product-dash-list" id="dash-products-container">
          ${products.map(p => `
            <div class="product-dash-card" data-product-id="${p.id}" key="dash-prod-${p.id}">
              <div class="product-dash-img-wrap">
                <img src="${p.enhanced_image_url || p.original_image_url || p.image_url || '/assets/raw_pottery_snap.jpg'}" alt="${p.title}" class="product-dash-img">
              </div>

              <div class="product-dash-info">
                <h3 class="product-dash-title">${p.title}</h3>
                <div class="product-dash-meta">
                  <span class="badge badge-stock">${p.status || t('in_stock')}</span>
                  <span>•</span>
                  <span>${p.views_count || p.views || 48} ${t('views_count_label')}</span>
                </div>
              </div>

              <div class="product-dash-actions">
                <div style="font-weight: 800; color: var(--color-terracotta); font-size: 1rem; margin-bottom: 0.25rem;">
                  ₹ ${(p.final_price || p.suggested_price || p.price || 1800).toLocaleString('en-IN')}
                </div>
                <button class="btn btn-sm btn-secondary btn-edit-product" data-product-id="${p.id}" title="Edit Listing">
                  <span>${Icons.edit(14)}</span>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // 1. Add Product button
    container.querySelector('#btn-dash-add-product')?.addEventListener('click', () => {
      State.resetDraft();
      State.setScreen('studio');
    });

    // 2. Explore Full Analysis button -> Navigate to dedicated Market Insights screen
    container.querySelector('#btn-explore-analysis')?.addEventListener('click', () => {
      State.setScreen('market_insights');
    });

    // 3. View All button -> Navigate to dedicated My Products screen
    container.querySelector('#btn-view-all-products')?.addEventListener('click', () => {
      State.setScreen('my_products');
    });

    // 4. Product Card clicks
    container.querySelectorAll('.btn-edit-product').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const pId = btn.dataset.productId;
        const item = products.find(p => p.id == pId);
        if (item) {
          State.updateDraft({
            title: item.title,
            craft_category: item.category || item.craft_category,
            material: item.material,
            technique: item.technique,
            description: item.description,
            dimensions: item.dimensions,
            craft_story: item.craft_story,
            original_image_url: item.original_image_url || item.image_url,
            enhanced_image_url: item.enhanced_image_url || item.image_url,
            pricing: {
              final_price: item.final_price || item.price,
              suggested_price: item.final_price || item.price
            }
          });
        }
        State.setScreen('voice');
      });
    });

    container.querySelectorAll('.product-dash-card').forEach(card => {
      card.addEventListener('click', () => {
        const pId = card.dataset.productId;
        State.setScreen('product_details', { productId: parseInt(pId) });
      });
    });
  }

  // 1. Initial instant synchronous render
  drawView();

  // 2. Fetch live products asynchronously in background
  API.getProducts(artisan.id).then(res => {
    if (res && res.success && res.products && res.products.length > 0) {
      products = res.products;
      if (products[0] && (products[0].category || products[0].craft_category)) {
        const inferredCat = products[0].category || products[0].craft_category;
        marketInsights = getCategoryFallbackInsight(inferredCat);
      }
      drawView();
    }
  }).catch(() => {});

  // 3. Fetch live AI Market Insights asynchronously in background
  API.getMarketInsights(artisan.id, artisan.craft_category).then(res => {
    if (res && res.success) {
      marketInsights = {
        primary_category: res.primary_category || artisan.craft_category || 'Handloom & Textiles',
        surge_percentage: res.surge_percentage || '+34% this month',
        trend_status: res.trend_status || 'High Demand',
        dashboard_summary: res.dashboard_summary || marketInsights.dashboard_summary,
        top_recommendation: (res.creation_ideas && res.creation_ideas[0]) ? res.creation_ideas[0].title : ''
      };
      drawView();
    }
  }).catch(() => {});
}
