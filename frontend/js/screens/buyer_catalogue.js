/**
 * Karigra - Screen: Buyer Marketplace (Stitch Screen 8)
 * Dynamic category filters, price sorting, search, unique product keys, Add to Cart, and Cart Drawer integration
 */

import { State } from '../state.js';
import { API } from '../api.js';
import { Icons } from '../icons.js';
import { t } from '../i18n.js';
import { CartDrawer } from '../cart_drawer.js';

export function renderBuyerCatalogueScreen(container) {
  let allProducts = [
    {
      id: 1,
      title: 'GI Tagged Authentic Pochampally Double Ikat Pure Silk Saree',
      artisan_name: 'K. Ramulu (Master Weaver)',
      price: 8500,
      original_price: 10200,
      image_url: '/assets/ikat_saree.jpg',
      category: 'Handloom & Textiles',
      gi_certified: true,
      views_count: 512,
      in_stock: true
    },
    {
      id: 2,
      title: 'Royal Bidriware Handcrafted Silver Inlay Zinc-Copper Flower Vase',
      artisan_name: 'Mohd. Saleem',
      price: 4200,
      original_price: 5000,
      image_url: '/assets/bidriware_vase.jpg',
      category: 'Metalware & Heritage Art',
      gi_certified: true,
      views_count: 289,
      in_stock: true
    },
    {
      id: 3,
      title: 'Authentic Bastar Dhokra Lost-Wax Brass Tribal Musician Figurine',
      artisan_name: 'Budhram Baghel',
      price: 2600,
      original_price: 3100,
      image_url: '/assets/dhokra_brass.jpg',
      category: 'Brass & Bell Metal Craft',
      gi_certified: true,
      views_count: 195,
      in_stock: true
    },
    {
      id: 4,
      title: 'Traditional Jaipur Blue Pottery Hand-Painted Floral Ceramic Wall Plate',
      artisan_name: 'Sunita Devi',
      price: 1850,
      original_price: 2200,
      image_url: '/assets/blue_pottery.jpg',
      category: 'Pottery & Terracotta',
      gi_certified: true,
      views_count: 178,
      in_stock: true
    },
    {
      id: 5,
      title: 'Hand-Thrown Terracotta Geometric Studio Vase',
      artisan_name: 'Studio Earth',
      price: 4500,
      original_price: 5200,
      image_url: '/assets/raw_pottery_snap.jpg',
      category: 'Pottery & Terracotta',
      gi_certified: true,
      views_count: 420,
      in_stock: true
    },
    {
      id: 6,
      title: 'GI Tagged Saharanpur Hand-Carved Sheesham Wood Floral Heritage Bowl',
      artisan_name: 'Artisan Rahul',
      price: 1450,
      original_price: 1900,
      image_url: '/assets/woodcraft_bowl.jpg',
      category: 'Woodcraft & Carvings',
      gi_certified: true,
      views_count: 342,
      in_stock: true
    }
  ];

  let activeCategory = 'All';
  let activeSort = 'featured';
  let searchQuery = '';

  function getFilteredProducts() {
    let filtered = [...allProducts];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.artisan_name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (activeCategory !== 'All') {
      filtered = filtered.filter(p => {
        const cat = p.category.toLowerCase();
        if (activeCategory === 'Handloom & Silk') return cat.includes('handloom') || cat.includes('textile') || cat.includes('silk');
        if (activeCategory === 'Pottery') return cat.includes('pottery') || cat.includes('terracotta') || cat.includes('clay');
        if (activeCategory === 'Bidriware') return cat.includes('bidri') || cat.includes('metalware') || cat.includes('silver');
        if (activeCategory === 'Dhokra') return cat.includes('dhokra') || cat.includes('brass') || cat.includes('bell metal');
        if (activeCategory === 'Woodwork') return cat.includes('wood') || cat.includes('carving');
        return p.category === activeCategory;
      });
    }

    if (activeSort === 'gi_only') {
      filtered = filtered.filter(p => p.gi_certified);
    }

    if (activeSort === 'price_low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (activeSort === 'price_high') {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }

  function drawView() {
    const productsToDisplay = getFilteredProducts();
    const cartCount = State.getCartCount();

    container.innerHTML = `
      <div class="animate-fade-in" style="padding-bottom: 5rem;">
        <!-- Top Search Bar & Floating Cart Trigger Button -->
        <div style="display: flex; gap: 0.6rem; align-items: center; margin-bottom: 1rem;">
          <div class="search-bar-wrap" style="position: relative; flex: 1;">
            <div style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted); display: flex; align-items: center; pointer-events: none;">
              ${Icons.search(18)}
            </div>
            <input type="search" class="form-control" id="market-search-input" placeholder="${t('search_placeholder')}" value="${searchQuery}" style="padding-left: 2.75rem; border-radius: var(--radius-full); font-size: 0.9rem; background-color: var(--bg-card); box-shadow: var(--shadow-sm);">
          </div>
          
          <button class="btn btn-secondary" id="btn-market-open-cart" title="Open Shopping Cart" style="position: relative; border-radius: var(--radius-full); padding: 0.65rem 0.95rem; display: flex; align-items: center; gap: 0.4rem; box-shadow: var(--shadow-sm);">
            ${Icons.shoppingBag(18)}
            <span style="font-size: 0.82rem; font-weight: 700;">Cart</span>
            <span class="cart-count-badge" style="display: ${cartCount > 0 ? 'flex' : 'none'};">${cartCount}</span>
          </button>
        </div>

        <!-- Dynamic Category Filter Chips -->
        <div class="category-pills-row" style="margin-bottom: 0.75rem;">
          <button class="cat-pill ${activeCategory === 'All' ? 'active' : ''}" data-cat="All">
            <span style="display: flex; align-items: center;">${Icons.grid(15)}</span>
            <span>${t('all_categories')}</span>
          </button>
          <button class="cat-pill ${activeCategory === 'Handloom & Silk' ? 'active' : ''}" data-cat="Handloom & Silk">
            <span style="display: flex; align-items: center;">${Icons.layers(15)}</span>
            <span>Handloom & Silk</span>
          </button>
          <button class="cat-pill ${activeCategory === 'Pottery' ? 'active' : ''}" data-cat="Pottery">
            <span style="display: flex; align-items: center;">${Icons.pottery(15)}</span>
            <span>Pottery & Clay</span>
          </button>
          <button class="cat-pill ${activeCategory === 'Bidriware' ? 'active' : ''}" data-cat="Bidriware">
            <span style="display: flex; align-items: center;">${Icons.gem(15)}</span>
            <span>Bidriware Silver</span>
          </button>
          <button class="cat-pill ${activeCategory === 'Dhokra' ? 'active' : ''}" data-cat="Dhokra">
            <span style="display: flex; align-items: center;">${Icons.bell(15)}</span>
            <span>Dhokra Brass</span>
          </button>
          <button class="cat-pill ${activeCategory === 'Woodwork' ? 'active' : ''}" data-cat="Woodwork">
            <span style="display: flex; align-items: center;">${Icons.treePine(15)}</span>
            <span>Woodwork</span>
          </button>
        </div>

        <!-- Sort Chips & Reset Filter Row -->
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 1.25rem; flex-wrap: wrap;">
          <div style="display: flex; gap: 0.4rem; overflow-x: auto; scrollbar-width: none;">
            <button class="sort-chip ${activeSort === 'price_low' ? 'active' : ''}" data-sort="price_low">
              <span>${Icons.slidersHorizontal(14)}</span>
              <span>${t('sort_low_high')}</span>
            </button>
            <button class="sort-chip ${activeSort === 'price_high' ? 'active' : ''}" data-sort="price_high">
              <span>${Icons.slidersHorizontal(14)}</span>
              <span>${t('sort_high_low')}</span>
            </button>
            <button class="sort-chip ${activeSort === 'gi_only' ? 'active' : ''}" data-sort="gi_only">
              <span>${Icons.shieldCheck(14)}</span>
              <span>${t('filter_gi')}</span>
            </button>
          </div>

          <!-- Clear Filters Reset Button -->
          ${(activeCategory !== 'All' || activeSort !== 'featured' || searchQuery !== '') ? `
            <button class="btn-reset-filters" id="btn-clear-all-filters" title="${t('clear_filters')}">
              <span style="display: flex; align-items: center;">${Icons.rotateCcw(13)}</span>
              <span>${t('clear_filters')}</span>
            </button>
          ` : ''}
        </div>

        <!-- Festive Discount Banner -->
        <div class="market-hero-banner" style="margin-bottom: 1.5rem; background: linear-gradient(135deg, #1C1917 0%, #292524 100%); border-radius: var(--radius-md); padding: 1.5rem; color: #FFFFFF; position: relative; overflow: hidden; box-shadow: var(--shadow-md);">
          <div style="position: absolute; right: 10px; bottom: 10px; opacity: 0.12; color: #FFFFFF; pointer-events: none;">
            ${Icons.sparkles(96)}
          </div>
          <span class="badge badge-gi" style="margin-bottom: 0.65rem; background: #D97706; color: #FFFFFF; font-size: 0.75rem;">
            ${t('festive_tag')}
          </span>
          <h2 style="font-family: var(--font-serif); font-size: 1.35rem; font-weight: 700; margin-bottom: 0.4rem; line-height: 1.3;">
            ${t('festive_title')}
          </h2>
          <p style="font-size: 0.85rem; color: #D6D3D1; margin-bottom: 1rem; line-height: 1.4; max-width: 90%;">
            ${t('festive_desc')}
          </p>
          <button class="btn btn-primary" id="btn-claim-festive-offer" style="padding: 0.6rem 1.25rem; font-size: 0.85rem;">
            <span>${Icons.sparkles(16)}</span>
            <span>${t('claim_offer_btn')}</span>
          </button>
        </div>

        <!-- Section Header -->
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1rem;">
          <h2 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary);">
            ${t('curated_for_you')} (${productsToDisplay.length})
          </h2>
          <span style="font-size: 0.75rem; color: var(--text-muted);">
            ${t('showing_listings_label')}
          </span>
        </div>

        <!-- Product Cards Grid with Dual Options: "Add to Cart" and "Buy Now" -->
        ${productsToDisplay.length === 0 ? `
          <div class="card" style="text-align: center; padding: 3rem 1.5rem; margin-top: 1rem;">
            <div style="display: flex; justify-content: center; margin-bottom: 0.75rem; color: var(--text-muted);">${Icons.search(48)}</div>
            <h3 style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.35rem;">
              ${t('no_products_found')}
            </h3>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.25rem;">
              ${t('no_products_sub')}
            </p>
            <button class="btn btn-primary" id="btn-reset-filters-empty">
              <span>${t('clear_filters')}</span>
            </button>
          </div>
        ` : `
          <div class="product-grid-2">
            ${productsToDisplay.map(p => `
              <div class="product-card" data-product-id="${p.id}" key="product-${p.id}">
                <div class="product-card-img-wrapper">
                  <img src="${p.image_url}" alt="${p.title}" class="product-card-img" loading="lazy">
                  
                  <button class="wishlist-heart-btn" title="Add to Wishlist" data-product-id="${p.id}">
                    ${Icons.heart(16)}
                  </button>
                  
                  ${p.gi_certified ? `
                    <span class="badge badge-gi" style="position: absolute; bottom: 8px; left: 8px; font-size: 0.65rem; padding: 0.2rem 0.45rem; box-shadow: var(--shadow-sm);">
                      ${Icons.shieldCheck(12)}
                      <span>GI Certified</span>
                    </span>
                  ` : ''}
                </div>

                <div class="product-card-body">
                  <h3 class="product-card-title">${p.title}</h3>
                  <div class="product-card-artisan">by <strong>${p.artisan_name}</strong></div>

                  <!-- Price in Indian Rupees (₹) -->
                  <div class="product-card-price-row">
                    <div style="display: flex; align-items: baseline; gap: 0.4rem;">
                      <span class="product-card-price">₹ ${p.price.toLocaleString('en-IN')}</span>
                      ${p.original_price ? `<span class="product-card-strike">₹${p.original_price.toLocaleString('en-IN')}</span>` : ''}
                    </div>
                  </div>

                  <!-- Dual Action Buttons: Add to Cart & Buy Now -->
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.35rem; margin-top: 0.65rem;">
                    <button class="btn btn-sm btn-secondary btn-add-cart-card" data-product-id="${p.id}" title="Add to Cart">
                      <span>${Icons.shoppingBag(14)}</span>
                      <span>Add</span>
                    </button>
                    <button class="btn btn-sm btn-primary btn-buy-card" data-product-id="${p.id}" title="Buy Now Direct Checkout">
                      <span>${t('buy_now')}</span>
                    </button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;

    // 1. Live Search Input
    const searchInput = container.querySelector('#market-search-input');
    searchInput?.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      drawView();
      const newSearch = container.querySelector('#market-search-input');
      if (newSearch) {
        newSearch.focus();
        newSearch.setSelectionRange(searchQuery.length, searchQuery.length);
      }
    });

    // 2. Open Cart Drawer Button
    container.querySelector('#btn-market-open-cart')?.addEventListener('click', () => {
      CartDrawer.open();
    });

    // 3. Category Filter Click Handlers
    container.querySelectorAll('.cat-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        activeCategory = btn.dataset.cat;
        drawView();
      });
    });

    // 4. Sort Chip Click Handlers
    container.querySelectorAll('.sort-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const sortType = btn.dataset.sort;
        activeSort = activeSort === sortType ? 'featured' : sortType;
        drawView();
      });
    });

    // 5. Clear Filters Handlers
    container.querySelector('#btn-clear-all-filters')?.addEventListener('click', () => {
      activeCategory = 'All';
      activeSort = 'featured';
      searchQuery = '';
      drawView();
    });

    container.querySelector('#btn-reset-filters-empty')?.addEventListener('click', () => {
      activeCategory = 'All';
      activeSort = 'featured';
      searchQuery = '';
      drawView();
    });

    // 6. Card Clicks to View Product Details
    container.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.wishlist-heart-btn') || e.target.closest('.btn-buy-card') || e.target.closest('.btn-add-cart-card')) return;
        const pId = card.dataset.productId;
        State.setSelectedProduct(parseInt(pId));
        State.setScreen('product_details', { productId: parseInt(pId) });
      });
    });

    // 7. Add to Cart on Card (Adds item to cart and confirms without redirecting)
    container.querySelectorAll('.btn-add-cart-card').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const pId = btn.dataset.productId;
        const item = allProducts.find(p => p.id == pId);
        if (item) {
          State.addToCart(item, 1);
          drawView();
          alert(`Added to Cart!\n"${item.title}" (₹${item.price.toLocaleString('en-IN')})\n\nTotal in cart: ${State.getCartCount()} items.`);
        }
      });
    });

    // 8. Buy Now Quick Action (Direct Checkout)
    container.querySelectorAll('.btn-buy-card').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const pId = btn.dataset.productId;
        const item = allProducts.find(p => p.id == pId);
        if (item) {
          const address = prompt(`${t('checkout_prompt')} "${item.title}"\nTotal: ₹${item.price.toLocaleString('en-IN')}\n\n${t('enter_delivery_address')}`, "Plot 42, Jubilee Hills, Hyderabad 500033");
          if (address) {
            alert(t('order_confirmed_alert'));
          }
        }
      });
    });

    // 9. Festive Offer Banner
    container.querySelector('#btn-claim-festive-offer')?.addEventListener('click', () => {
      alert("30% Festive Discount voucher 'UTSAV2026' applied to your cart!");
    });
  }

  // 1. Instant synchronous render
  drawView();

  // 2. Fetch live data asynchronously in background, deduplicate by ID and preserve all products
  API.getProducts().then(res => {
    if (res && res.success && res.products && res.products.length > 0) {
      const seenIds = new Set();
      const mapped = [];

      for (const p of res.products) {
        if (!seenIds.has(p.id)) {
          seenIds.add(p.id);
          mapped.push({
            id: p.id,
            title: p.title,
            artisan_name: p.artisan_name || 'Master Artisan',
            price: p.final_price || p.suggested_price || 1800,
            original_price: p.original_price || Math.round((p.final_price || 1800) * 1.2),
            image_url: p.enhanced_image_url || p.original_image_url || '/assets/raw_pottery_snap.jpg',
            category: p.craft_category || 'Handloom & Textiles',
            gi_certified: p.gi_tag_certified !== 0,
            views_count: p.views_count || 120,
            in_stock: true
          });
        }
      }

      if (mapped.length > 0) {
        allProducts = mapped;
        drawView();
      }
    }
  }).catch(() => {});
}
