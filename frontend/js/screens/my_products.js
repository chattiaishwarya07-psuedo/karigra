/**
 * Karigra - Screen: My Products (Dedicated Artisan Craft Catalogue)
 * Displays all products uploaded or created by the current artisan with live search,
 * category filtering, status indicators, views analytics, and management actions.
 */

import { State } from '../state.js';
import { API } from '../api.js';
import { Icons } from '../icons.js';
import { t } from '../i18n.js';

export function renderMyProductsScreen(container) {
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
      enhanced_image_url: '/assets/ikat_saree.jpg',
      gi_certified: true
    }
  ];

  let activeCategory = 'All';
  let searchQuery = '';

  function getFilteredProducts() {
    let filtered = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.craft_category && p.craft_category.toLowerCase().includes(q)) ||
        (p.material && p.material.toLowerCase().includes(q))
      );
    }

    if (activeCategory !== 'All') {
      filtered = filtered.filter(p => {
        const cat = (p.category || p.craft_category || '').toLowerCase();
        if (activeCategory === 'Handloom & Silk') return cat.includes('handloom') || cat.includes('textile') || cat.includes('silk');
        if (activeCategory === 'Pottery') return cat.includes('pottery') || cat.includes('terracotta') || cat.includes('clay');
        if (activeCategory === 'Bidriware') return cat.includes('bidri') || cat.includes('metalware') || cat.includes('silver');
        if (activeCategory === 'Dhokra') return cat.includes('dhokra') || cat.includes('brass') || cat.includes('bell metal');
        if (activeCategory === 'Woodcraft') return cat.includes('wood') || cat.includes('carving');
        return cat.includes(activeCategory.toLowerCase());
      });
    }

    return filtered;
  }

  function drawView() {
    const filteredList = getFilteredProducts();
    const totalViews = products.reduce((acc, p) => acc + (p.views_count || p.views || 48), 0);

    container.innerHTML = `
      <div class="animate-fade-in" style="max-width: 680px; margin: 0 auto; padding-bottom: 5rem;">
        <!-- Screen Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <div style="display: flex; align-items: center; gap: 0.65rem;">
            <button class="header-icon-btn" id="btn-back-to-dashboard" title="Back to Dashboard" style="display: flex;">
              ${Icons.arrowLeft(18)}
            </button>
            <div>
              <h1 style="font-size: 1.35rem; font-weight: 800; color: var(--color-terracotta); margin: 0; line-height: 1.2;">
                ${t('your_products')}
              </h1>
              <p style="font-size: 0.82rem; color: var(--text-secondary); margin: 2px 0 0 0;">
                ${products.length} Craft Listing${products.length === 1 ? '' : 's'} • ${totalViews.toLocaleString('en-IN')} Total Views
              </p>
            </div>
          </div>

          <button class="btn btn-sm btn-primary" id="btn-add-new-listing" style="display: flex; align-items: center; gap: 4px; box-shadow: var(--shadow-sm); border-radius: var(--radius-full); padding: 0.45rem 0.9rem;">
            ${Icons.plus(16)}
            <span>${t('add_product')}</span>
          </button>
        </div>

        <!-- Search Bar & Filters -->
        <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.25rem;">
          <div class="search-bar-wrap" style="position: relative;">
            <div style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted); display: flex; align-items: center; pointer-events: none;">
              ${Icons.search(18)}
            </div>
            <input type="search" class="form-control" id="my-products-search" placeholder="Search your listings by name, category, material..." value="${searchQuery}" style="padding-left: 2.75rem; border-radius: var(--radius-full); font-size: 0.9rem; background-color: var(--bg-card); box-shadow: var(--shadow-xs);">
          </div>

          <!-- Category Filter Pills -->
          <div class="category-pills-row" style="margin-bottom: 0;">
            <button class="cat-pill ${activeCategory === 'All' ? 'active' : ''}" data-cat="All">
              <span style="display: flex; align-items: center;">${Icons.grid(14)}</span>
              <span>All (${products.length})</span>
            </button>
            <button class="cat-pill ${activeCategory === 'Handloom & Silk' ? 'active' : ''}" data-cat="Handloom & Silk">
              <span style="display: flex; align-items: center;">${Icons.layers(14)}</span>
              <span>Handloom</span>
            </button>
            <button class="cat-pill ${activeCategory === 'Pottery' ? 'active' : ''}" data-cat="Pottery">
              <span style="display: flex; align-items: center;">${Icons.pottery(14)}</span>
              <span>Pottery & Clay</span>
            </button>
            <button class="cat-pill ${activeCategory === 'Bidriware' ? 'active' : ''}" data-cat="Bidriware">
              <span style="display: flex; align-items: center;">${Icons.gem(14)}</span>
              <span>Bidriware</span>
            </button>
            <button class="cat-pill ${activeCategory === 'Dhokra' ? 'active' : ''}" data-cat="Dhokra">
              <span style="display: flex; align-items: center;">${Icons.bell(14)}</span>
              <span>Dhokra Brass</span>
            </button>
            <button class="cat-pill ${activeCategory === 'Woodcraft' ? 'active' : ''}" data-cat="Woodcraft">
              <span style="display: flex; align-items: center;">${Icons.treePine(14)}</span>
              <span>Woodcraft</span>
            </button>
          </div>
        </div>

        <!-- Products List -->
        ${filteredList.length === 0 ? `
          <div class="card" style="text-align: center; padding: 3rem 1.5rem; margin-top: 1rem;">
            <div style="display: flex; justify-content: center; margin-bottom: 0.75rem; color: var(--text-muted);">${Icons.package(48)}</div>
            <h2 style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.35rem;">
              No Listings Found
            </h2>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.25rem;">
              ${searchQuery ? 'No products match your current search criteria.' : 'You have not published any craft products in this category yet.'}
            </p>
            <button class="btn btn-primary" id="btn-empty-add-product">
              <span>${Icons.plus(16)}</span>
              <span>${t('add_product')}</span>
            </button>
          </div>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 0.85rem;">
            ${filteredList.map(p => {
              const pImg = p.enhanced_image_url || p.original_image_url || p.image_url || '/assets/raw_pottery_snap.jpg';
              const pPrice = p.final_price || p.suggested_price || p.price || 1800;
              const pViews = p.views_count || p.views || 48;
              const pCat = p.category || p.craft_category || 'Handicraft & Heritage';
              const isGi = p.gi_certified || p.gi_tag_certified;

              return `
                <div class="card" style="padding: 1rem; box-shadow: var(--shadow-sm); border-radius: var(--radius-md); transition: transform 0.2s ease;">
                  <div style="display: flex; gap: 1rem; align-items: flex-start;">
                    <!-- Product Thumbnail -->
                    <div style="width: 90px; height: 90px; min-width: 90px; border-radius: var(--radius-sm); overflow: hidden; background: #F3F4F6; position: relative; border: 1px solid var(--border-subtle); cursor: pointer;" class="listing-thumb-click" data-product-id="${p.id}">
                      <img src="${pImg}" alt="${p.title}" style="width: 100%; height: 100%; object-fit: cover;">
                      ${isGi ? `
                        <span class="badge badge-gi" style="position: absolute; bottom: 4px; left: 4px; font-size: 0.55rem; padding: 0.15rem 0.35rem;">
                          GI
                        </span>
                      ` : ''}
                    </div>

                    <!-- Product Details -->
                    <div style="flex: 1; min-width: 0;">
                      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.25rem;">
                        <h2 style="font-size: 0.98rem; font-weight: 800; color: var(--text-primary); line-height: 1.35; margin: 0; cursor: pointer;" class="listing-title-click" data-product-id="${p.id}">
                          ${p.title}
                        </h2>
                        <div style="font-size: 1.15rem; font-weight: 800; color: var(--color-terracotta); white-space: nowrap;">
                          ₹ ${pPrice.toLocaleString('en-IN')}
                        </div>
                      </div>

                      <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.5rem;">
                        ${pCat}
                      </div>

                      <!-- Badges and Performance Stats -->
                      <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
                        <span class="badge badge-stock" style="font-size: 0.7rem; padding: 0.2rem 0.5rem;">
                          ${p.status || t('in_stock')}
                        </span>
                        <span style="font-size: 0.75rem; color: var(--text-secondary); display: flex; align-items: center; gap: 4px;">
                          ${Icons.eye(13)}
                          <span>${pViews.toLocaleString('en-IN')} views</span>
                        </span>
                        <span style="font-size: 0.75rem; color: #16A34A; display: flex; align-items: center; gap: 4px; font-weight: 600;">
                          ${Icons.checkCheck(13)}
                          <span>Live in Boutique</span>
                        </span>
                      </div>

                      <!-- Action Buttons -->
                      <div style="display: flex; gap: 0.5rem; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 0.65rem;">
                        <button class="btn btn-sm btn-secondary btn-view-details" data-product-id="${p.id}" style="font-size: 0.75rem; padding: 0.35rem 0.7rem; border-radius: var(--radius-sm); display: flex; align-items: center; gap: 4px;">
                          ${Icons.eye(13)}
                          <span>View Listing</span>
                        </button>
                        <button class="btn btn-sm btn-secondary btn-edit-listing" data-product-id="${p.id}" style="font-size: 0.75rem; padding: 0.35rem 0.7rem; border-radius: var(--radius-sm); display: flex; align-items: center; gap: 4px;">
                          ${Icons.edit(13)}
                          <span>Edit</span>
                        </button>
                        <button class="btn btn-sm btn-secondary btn-delete-listing" data-product-id="${p.id}" style="font-size: 0.75rem; padding: 0.35rem 0.7rem; border-radius: var(--radius-sm); color: #DC2626; border-color: #FCA5A5; margin-left: auto;" title="Delete Listing">
                          ${Icons.trash2 ? Icons.trash2(13) : '✕'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>
    `;

    // 1. Back to Dashboard
    container.querySelector('#btn-back-to-dashboard')?.addEventListener('click', () => {
      State.setScreen('dashboard');
    });

    // 2. Add New Listing
    container.querySelector('#btn-add-new-listing')?.addEventListener('click', () => {
      State.resetDraft();
      State.setScreen('studio');
    });

    container.querySelector('#btn-empty-add-product')?.addEventListener('click', () => {
      State.resetDraft();
      State.setScreen('studio');
    });

    // 3. Search input
    const searchEl = container.querySelector('#my-products-search');
    searchEl?.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      drawView();
    });

    // 4. Category Pills
    container.querySelectorAll('.cat-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        activeCategory = btn.dataset.cat;
        drawView();
      });
    });

    // 5. Product Action Handlers
    container.querySelectorAll('.btn-view-details, .listing-thumb-click, .listing-title-click').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const pId = el.dataset.productId;
        State.setScreen('product_details', { productId: parseInt(pId) });
      });
    });

    container.querySelectorAll('.btn-edit-listing').forEach(btn => {
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

    container.querySelectorAll('.btn-delete-listing').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const pId = btn.dataset.productId;
        if (confirm("Are you sure you want to delete this product listing?")) {
          try {
            await API.deleteProduct(parseInt(pId));
            products = products.filter(p => p.id != pId);
            drawView();
          } catch (err) {
            products = products.filter(p => p.id != pId);
            drawView();
          }
        }
      });
    });
  }

  // Initial synchronous render
  drawView();

  // Async live fetch
  API.getProducts(artisan.id).then(res => {
    if (res && res.success && res.products && res.products.length > 0) {
      products = res.products;
      drawView();
    }
  }).catch(() => {});
}
