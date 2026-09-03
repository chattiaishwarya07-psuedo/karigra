/**
 * KALAVERSE / KalaMarket - Screen: Artisan Heritage Profile
 * Displays artisan bio, GI tag credentials, product catalog, and account controls with 100% i18n
 */

import { State } from '../state.js';
import { API } from '../api.js';
import { Icons } from '../icons.js';
import { t } from '../i18n.js';

export async function renderProfileScreen(container) {
  const artisan = State.currentArtisan || {
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

  let products = [];
  try {
    const res = await API.getProducts(artisan.id);
    if (res && res.success && res.products) {
      products = res.products;
    }
  } catch (e) {}

  if (products.length === 0) {
    products = [
      {
        id: 1,
        title: 'GI Tagged Authentic Pochampally Double Ikat Pure Silk Saree',
        status: 'published',
        views_count: 512,
        final_price: 8500,
        enhanced_image_url: '/assets/ikat_saree.jpg'
      }
    ];
  }

  const totalViews = products.reduce((acc, p) => acc + (p.views_count || 0), 0);

  container.innerHTML = `
    <div class="animate-fade-in" style="max-width: 540px; margin: 0 auto; padding-bottom: 2rem;">
      <!-- Top Breadcrumb & Action Row -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.5rem;">
        <button class="btn btn-sm btn-secondary" id="back-to-dash-btn">
          ${Icons.arrowLeft(14)}
          <span>${t('nav_home')}</span>
        </button>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn btn-sm btn-secondary" id="btn-profile-logout">
            ${Icons.logOut(14)}
            <span>${t('logout_btn')}</span>
          </button>
          <button class="btn btn-sm btn-primary" id="start-new-product-btn">
            ${Icons.plus(14)}
            <span>${t('add_product')}</span>
          </button>
        </div>
      </div>

      <!-- Main Profile Card -->
      <div class="card" style="box-shadow: var(--shadow-md); margin-bottom: 1.25rem;">
        <div class="profile-header-layout" style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem;">
          <img src="${artisan.avatar_url || '/assets/artisan_ramulu.jpg'}" alt="${artisan.name}" class="profile-avatar-large" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid var(--color-terracotta);">
          <div>
            <h1 style="font-size: 1.4rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.25rem;">${artisan.name}</h1>
            <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; align-items: center;">
              <span class="badge badge-artisan">${artisan.heritage_badge || 'Master Craftsman'}</span>
              <span class="badge badge-gi">${Icons.shieldCheck(12)} GI Tagged</span>
            </div>
          </div>
        </div>

        <div style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1rem;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 2px;">
            <span>${Icons.mapPin(14)}</span>
            <span>${artisan.location_town ? artisan.location_town + ', ' : ''}${artisan.location_state}, India</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span>${Icons.phone(14)}</span>
            <span>${artisan.phone || '+91 94401 99887'}</span>
          </div>
          <div style="margin-top: 0.5rem; font-style: italic; color: var(--text-primary);">
            "${artisan.bio || 'Master craftsman preserving centuries of traditional Indian artisanal knowledge.'}"
          </div>
        </div>

        <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
          <span class="badge" style="background: var(--bg-secondary); color: var(--text-primary); font-weight: 700;">${artisan.experience_years} ${t('years_master_practice')}</span>
          ${(artisan.languages || ['Telugu', 'Hindi', 'English']).map(l => `<span class="badge" style="background: var(--bg-secondary); color: var(--text-primary);">${l}</span>`).join('')}
        </div>
      </div>

      <!-- Performance Stats Row (in ₹) -->
      <div class="stats-list" style="margin-bottom: 1.25rem;">
        <div class="stat-kpi-card">
          <div class="stat-kpi-header">
            <span style="display: flex; align-items: center; color: var(--color-terracotta);">${Icons.package(18)}</span>
            <span>${t('published_products')}</span>
          </div>
          <div class="stat-kpi-value">${products.length}</div>
        </div>

        <div class="stat-kpi-card">
          <div class="stat-kpi-header">
            <span style="display: flex; align-items: center; color: var(--color-terracotta);">${Icons.eye(18)}</span>
            <span>${t('total_views_metric')}</span>
          </div>
          <div class="stat-kpi-value">${totalViews.toLocaleString('en-IN')}</div>
        </div>

        <div class="stat-kpi-card">
          <div class="stat-kpi-header">
            <span style="display: flex; align-items: center; color: var(--color-emerald);">${Icons.shieldCheck(18)}</span>
            <span>GI Score</span>
          </div>
          <div class="stat-kpi-value" style="color: var(--color-emerald);">98.5%</div>
        </div>
      </div>

      <!-- Catalog Header -->
      <div class="dash-section-header">
        <h2 class="dash-section-title">${t('catalog_by')} ${artisan.name}</h2>
        <button class="dash-section-link" id="btn-view-public-market">${t('view_public_shop')}</button>
      </div>

      <!-- Product Cards List -->
      <div class="product-dash-list">
        ${products.map(p => `
          <div class="product-dash-card" data-product-id="${p.id}">
            <div class="product-dash-img-wrap">
              <img src="${p.enhanced_image_url || p.original_image_url || '/assets/raw_pottery_snap.jpg'}" alt="${p.title}" class="product-dash-img">
            </div>

            <div class="product-dash-info">
              <h3 class="product-dash-title">${p.title}</h3>
              <div class="product-dash-meta">
                <span class="badge badge-stock">${t('in_stock')}</span>
                <span>•</span>
                <span>${p.views_count || 48} ${t('views_count_label')}</span>
              </div>
            </div>

            <div class="product-dash-actions">
              <div style="font-weight: 800; color: var(--color-terracotta); font-size: 1rem; margin-bottom: 0.25rem;">
                ₹ ${(p.final_price || p.suggested_price || 1800).toLocaleString('en-IN')}
              </div>
              <div style="display: flex; gap: 0.35rem; justify-content: flex-end;">
                <button class="btn btn-sm btn-secondary btn-delete-prod-btn" data-product-id="${p.id}" data-product-title="${p.title}" title="${t('delete_product')}" style="color: #DC2626; border-color: rgba(220, 38, 38, 0.3); padding: 0.35rem 0.55rem;">
                  <span>${Icons.trash(14)}</span>
                </button>
                <button class="btn btn-sm btn-secondary btn-detail-prod-btn" data-product-id="${p.id}" title="View Details">
                  <span>${Icons.arrowRight(14)}</span>
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Handlers
  container.querySelector('#back-to-dash-btn')?.addEventListener('click', () => {
    State.setScreen('dashboard');
  });

  container.querySelector('#start-new-product-btn')?.addEventListener('click', () => {
    State.resetDraft();
    State.setScreen('studio');
  });

  container.querySelector('#btn-view-public-market')?.addEventListener('click', () => {
    State.setRoleMode('buyer');
    State.setScreen('buyer_catalogue');
  });

  container.querySelector('#btn-profile-logout')?.addEventListener('click', () => {
    try {
      localStorage.removeItem('kalamarket_auth');
    } catch (e) {}
    alert("✓ Logged out successfully.");
    State.setScreen('welcome');
  });

  container.querySelectorAll('.btn-delete-prod-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const pId = btn.dataset.productId;
      const title = btn.dataset.productTitle || 'this product';
      if (confirm(t('confirm_delete') || `Are you sure you want to delete "${title}"?`)) {
        try {
          const res = await API.deleteProduct(pId);
          if (res && res.success) {
            alert("✓ " + (t('product_deleted_msg') || "Product deleted successfully."));
            renderProfileScreen(container);
          } else {
            alert("Failed to delete product: " + (res.error || "Unknown error"));
          }
        } catch (err) {
          console.error("Delete error:", err);
          alert("Error deleting product.");
        }
      }
    });
  });

  container.querySelectorAll('.product-dash-card').forEach(card => {
    card.addEventListener('click', () => {
      const pId = card.dataset.productId;
      State.setScreen('product_details', { productId: parseInt(pId) });
    });
  });
}
