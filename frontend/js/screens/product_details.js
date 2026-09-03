/**
 * KALAVERSE / KalaMarket - Screen: Product Details & AI Description Translation
 * Displays full specifications, cultural heritage story, artisan portrait, and functional Add to Cart / Buy Now
 */

import { State } from '../state.js';
import { API } from '../api.js';
import { Icons } from '../icons.js';
import { t } from '../i18n.js';
import { CartDrawer } from '../cart_drawer.js';

export function renderProductDetailsScreen(container, payload = {}) {
  const productId = (payload && payload.productId) || State.selectedProductId || 1;
  let showOriginal = false;
  let buyerLang = State.activeLanguage || 'en';

  let p = {
    id: productId,
    title: 'GI Tagged Authentic Pochampally Double Ikat Pure Silk Saree',
    price: 8500,
    artisan_name: 'K. Ramulu (Master Weaver)',
    artisan_avatar: '/assets/artisan_ramulu.jpg',
    category: 'Handloom & Textiles',
    material: '100% Pure Mulberry Silk with Gold Zari Border',
    technique: 'Traditional Pochampally Double Ikat Handloom Weave',
    dimensions: 'Length: 6.3m (with 0.8m blouse), Width: 46 inches',
    craft_story: 'Pochampally Ikat from Telangana is a centuries-old Geographical Indication (GI) heritage craft renowned worldwide for its mathematically precise tie-and-dye patterns before weaving on pit looms.',
    description: 'Exquisite handcrafted Pochampally Ikat silk saree woven meticulously over 12 days by master weavers. Featuring iconic diamond geometric ikat motifs dyed with natural colors and enriched with an opulent golden zari border.',
    original_description: 'Exquisite handcrafted Pochampally Ikat silk saree woven meticulously over 12 days by master weavers. Featuring iconic diamond geometric ikat motifs dyed with natural colors and enriched with an opulent golden zari border.',
    original_language: 'en',
    main_image: '/assets/ikat_saree.jpg',
    thumbs: [
      '/assets/ikat_saree.jpg',
      '/assets/bidriware_vase.jpg',
      '/assets/woodcraft_bowl.jpg'
    ],
    gi_tag: true,
    translations: {}
  };

  function getDisplayedContent() {
    let displayedDescription = p.description;
    let displayedStory = p.craft_story;

    if (!showOriginal && p.translations && p.translations[buyerLang]) {
      const tr = p.translations[buyerLang];
      if (tr.description) displayedDescription = tr.description;
      if (tr.craft_story) displayedStory = tr.craft_story;
    }
    return { displayedDescription, displayedStory };
  }

  function drawView() {
    const { displayedDescription, displayedStory } = getDisplayedContent();

    container.innerHTML = `
      <div class="animate-fade-in" style="max-width: 540px; margin: 0 auto; padding-bottom: 5rem;">
        <!-- Top Nav Breadcrumb -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <button class="btn btn-sm btn-secondary" id="btn-back-market">
            ${Icons.arrowLeft(16)}
            <span>${t('back')}</span>
          </button>
          <span style="font-size: 0.85rem; font-weight: 700; color: var(--color-terracotta);">Heritage Boutique</span>
          <div style="display: flex; gap: 0.4rem; align-items: center;">
            <button class="btn btn-sm btn-secondary" id="btn-delete-product-header" title="${t('delete_product')}" style="color: #DC2626; border-color: rgba(220, 38, 38, 0.4); display: flex; align-items: center; gap: 4px; padding: 0.35rem 0.6rem;">
              <span>${Icons.trash(15)}</span>
              <span style="font-size: 0.78rem; font-weight: 600;">${t('delete_product')}</span>
            </button>
            <button class="header-icon-btn" id="btn-detail-view-cart" title="View Cart" style="position: relative; width: 36px; height: 36px;">
              ${Icons.shoppingBag(18)}
              <span class="cart-count-badge" style="display: ${State.getCartCount() > 0 ? 'flex' : 'none'};">${State.getCartCount()}</span>
            </button>
            <button class="wishlist-heart-btn" id="btn-detail-wishlist" style="position: static; width: 36px; height: 36px;">
              ${Icons.heart(18)}
            </button>
          </div>
        </div>

        <!-- 1. Main Large Hero Image -->
        <div class="product-gallery-main">
          <img src="${p.main_image}" alt="${p.title}" id="detail-main-img">
          ${p.gi_tag ? `
            <span class="badge badge-gi" style="position: absolute; bottom: 14px; left: 14px; box-shadow: var(--shadow-sm);">
              ${Icons.shieldCheck(14)}
              <span>GI Certified</span>
            </span>
          ` : ''}
        </div>

        <!-- 2. Gallery Thumbnails -->
        <div class="product-thumbs-row" id="thumbs-row">
          ${p.thumbs.map((thumb, idx) => `
            <div class="product-thumb-item ${idx === 0 ? 'active' : ''}" data-src="${thumb}">
              <img src="${thumb}" alt="Gallery thumbnail ${idx + 1}">
            </div>
          `).join('')}
        </div>

        <!-- 3. Title & Price in Indian Rupees (₹) -->
        <div style="margin: 1.25rem 0 0.5rem 0;">
          <h1 style="font-family: var(--font-sans); font-size: 1.35rem; font-weight: 800; color: var(--text-primary); line-height: 1.3; margin-bottom: 0.5rem;">
            ${p.title}
          </h1>

          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
            <div style="font-size: 1.6rem; font-weight: 800; color: var(--color-terracotta);">
              ₹ ${p.price.toLocaleString('en-IN')}
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <img src="${p.artisan_avatar || '/assets/artisan_ramulu.jpg'}" alt="${p.artisan_name}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover; border: 1.5px solid var(--color-terracotta);">
              <span style="font-size: 0.85rem; color: var(--text-secondary); font-weight: 600;">
                by <strong>${p.artisan_name}</strong>
              </span>
            </div>
          </div>
        </div>

        <!-- 4. Trust Badges Row -->
        <div class="trust-badges-row" style="display: flex; gap: 0.5rem; margin: 0.75rem 0 1rem 0; flex-wrap: wrap;">
          <span class="trust-badge-pill" style="display: inline-flex; align-items: center; gap: 4px; padding: 0.35rem 0.65rem; background: #FEF3C7; color: #92400E; border-radius: var(--radius-full); font-size: 0.78rem; font-weight: 700;">
            ${Icons.check(14)} ${t('authenticity_guaranteed')}
          </span>
          <span class="trust-badge-pill" style="display: inline-flex; align-items: center; gap: 4px; padding: 0.35rem 0.65rem; background: #DCFCE7; color: #166534; border-radius: var(--radius-full); font-size: 0.78rem; font-weight: 700;">
            ${Icons.check(14)} ${t('ships_in_days')}
          </span>
          <span class="trust-badge-pill" style="display: inline-flex; align-items: center; gap: 4px; padding: 0.35rem 0.65rem; background: #FDF1E6; color: var(--color-terracotta); border-radius: var(--radius-full); font-size: 0.78rem; font-weight: 700;">
            ${Icons.check(14)} ${t('only_few_left')}
          </span>
        </div>

        <!-- 5. Product Specifications Grid -->
        <div class="card" style="padding: 0.85rem 1rem; margin-bottom: 1.25rem; font-size: 0.85rem; background: var(--bg-card);">
          <div style="font-weight: 800; color: var(--text-primary); margin-bottom: 0.5rem; font-size: 0.95rem;">
            ${t('craft_specs_title')}
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.4rem; color: var(--text-secondary);">
            <div><strong>Category:</strong> ${p.category}</div>
            <div><strong>Materials:</strong> ${p.material}</div>
            <div><strong>Technique:</strong> ${p.technique}</div>
            <div><strong>Dimensions:</strong> ${p.dimensions}</div>
          </div>
        </div>

        <!-- 6. AI Description Translation Banner & Content -->
        <div class="card" style="margin-bottom: 1.25rem; box-shadow: var(--shadow-sm);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
            <div style="font-weight: 800; font-size: 0.95rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.35rem;">
              <span style="color: var(--color-terracotta); display: flex; align-items: center;">${Icons.palette(16)}</span>
              <span>${t('product_description')}</span>
            </div>

            <!-- AI Translation Toggle Button -->
            <button class="btn btn-sm btn-secondary" id="btn-toggle-translation" style="font-size: 0.75rem; padding: 0.3rem 0.6rem;">
              <span>${Icons.globe(14)}</span>
              <span>${showOriginal ? `${t('translate_to_btn')} ${buyerLang.toUpperCase()}` : t('view_original_btn')}</span>
            </button>
          </div>

          <div style="font-size: 0.75rem; color: var(--color-terracotta); font-weight: 700; margin-bottom: 0.5rem;">
            ${showOriginal ? t('showing_original_notice') : `✓ ${t('ai_translated_notice')}`}
          </div>

          <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6; margin: 0 0 1rem 0;">
            ${showOriginal ? p.original_description : displayedDescription}
          </p>

          ${p.craft_story ? `
            <div style="border-top: 1px solid var(--border-subtle); padding-top: 0.75rem;">
              <strong style="font-size: 0.85rem; color: var(--text-primary); display: block; margin-bottom: 0.25rem;">
                ${t('cultural_story_heading')}
              </strong>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; font-style: italic; margin: 0;">
                "${showOriginal ? p.craft_story : displayedStory}"
              </p>
            </div>
          ` : ''}
        </div>

        <!-- 7. Want it Customized? Card -->
        <div class="custom-order-card">
          <h3 class="custom-order-title">${t('want_customized')}</h3>
          <p class="custom-order-desc">
            ${t('custom_order_desc')}
          </p>
          <button class="btn btn-outline-dark btn-block" id="btn-request-custom">
            <span>${Icons.sparkles(16)}</span>
            <span>${t('request_custom_order')}</span>
          </button>
        </div>

        <!-- 8. Sticky Bottom Action Bar with Role-Aware Actions -->
        <div class="sticky-bottom-bar" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.65rem;">
          ${State.roleMode === 'artisan' ? `
            <button class="btn btn-lg btn-secondary" id="btn-back-profile" style="font-size: 0.95rem; padding: 0.85rem;">
              <span style="display: flex; align-items: center;">${Icons.arrowLeft(18)}</span>
              <span>${t('artisan_profile')}</span>
            </button>
            <button class="btn btn-lg btn-danger" id="btn-detail-delete" style="font-size: 0.95rem; padding: 0.85rem; background-color: #DC2626; color: #FFFFFF; border: none;">
              <span style="display: flex; align-items: center;">${Icons.trash(18)}</span>
              <span>${t('delete_product')}</span>
            </button>
          ` : `
            <button class="btn btn-lg btn-secondary" id="btn-detail-cart" style="font-size: 0.95rem; padding: 0.85rem;">
              <span style="display: flex; align-items: center;">${Icons.shoppingBag(18)}</span>
              <span>${t('add_to_cart')}</span>
            </button>
            <button class="btn btn-lg btn-primary" id="btn-detail-buy" style="font-size: 0.95rem; padding: 0.85rem;">
              <span>${t('buy_now')} • ₹${p.price.toLocaleString('en-IN')}</span>
            </button>
          `}
        </div>
      </div>
    `;

    // 1. Gallery Thumbnail Clicks
    const mainImg = container.querySelector('#detail-main-img');
    container.querySelectorAll('.product-thumb-item').forEach(item => {
      item.addEventListener('click', () => {
        container.querySelectorAll('.product-thumb-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        if (mainImg) {
          mainImg.src = item.dataset.src;
        }
      });
    });

    // 2. Back Button
    container.querySelector('#btn-back-market')?.addEventListener('click', () => {
      if (State.roleMode === 'artisan' || State.previousScreen === 'profile') {
        State.setScreen('profile');
      } else {
        State.setRoleMode('buyer');
        State.setScreen('buyer_catalogue');
      }
    });

    container.querySelector('#btn-back-profile')?.addEventListener('click', () => {
      State.setScreen('profile');
    });

    // Delete Product Handler
    const handleDeleteProduct = async () => {
      if (confirm(t('confirm_delete') || `Are you sure you want to delete "${p.title}"?`)) {
        try {
          const res = await API.deleteProduct(p.id);
          if (res && res.success) {
            alert("✓ " + (t('product_deleted_msg') || "Product deleted successfully."));
            State.setScreen(State.roleMode === 'artisan' ? 'profile' : 'buyer_catalogue');
          } else {
            alert("Failed to delete product: " + (res.error || "Unknown error"));
          }
        } catch (err) {
          console.error("Delete product error:", err);
          alert("Error deleting product.");
        }
      }
    };

    container.querySelector('#btn-detail-delete')?.addEventListener('click', handleDeleteProduct);
    container.querySelector('#btn-delete-product-header')?.addEventListener('click', handleDeleteProduct);

    // 3. View Cart Header Button
    container.querySelector('#btn-detail-view-cart')?.addEventListener('click', () => {
      CartDrawer.open();
    });

    // 4. AI Translation Toggle Handler
    container.querySelector('#btn-toggle-translation')?.addEventListener('click', async () => {
      showOriginal = !showOriginal;
      if (!showOriginal && !p.translations[buyerLang]) {
        try {
          const res = await API.translateDescription(p.original_description, 'hi', buyerLang, p.category);
          if (res && res.success && res.translated_text) {
            p.translations[buyerLang] = { description: res.translated_text };
          }
        } catch (err) {}
      }
      drawView();
    });

    // 5. Add to Cart (Adds item to state and confirms without redirecting)
    container.querySelector('#btn-detail-cart')?.addEventListener('click', () => {
      State.addToCart(p, 1);
      drawView();
      alert(`Added to Cart!\n"${p.title}" (₹${p.price.toLocaleString('en-IN')})\n\nTotal items in cart: ${State.getCartCount()}. You can continue browsing or open your cart.`);
    });

    // 6. Buy Now Checkout (Direct checkout)
    container.querySelector('#btn-detail-buy')?.addEventListener('click', () => {
      const address = prompt(`${t('checkout_prompt')} "${p.title}"\nTotal Amount: ₹${p.price.toLocaleString('en-IN')}\n\n${t('enter_delivery_address')}`, "Plot 42, Jubilee Hills, Hyderabad, Telangana 500033");
      if (address) {
        alert(t('order_confirmed_alert'));
      }
    });

    // 7. Custom Order Enquiry
    container.querySelector('#btn-request-custom')?.addEventListener('click', () => {
      const customNotes = prompt(`Direct Custom Enquiry to ${p.artisan_name}:\n${t('custom_enquiry_prompt')}`, 'Please make this with a deep indigo glaze and 35cm height.');
      if (customNotes) {
        alert(`✓ ${t('custom_enquiry_sent')}`);
      }
    });

    // 8. Wishlist Heart
    const heartBtn = container.querySelector('#btn-detail-wishlist');
    heartBtn?.addEventListener('click', () => {
      heartBtn.classList.toggle('active-heart');
      alert(`✓ ${t('saved_wishlist_alert')}`);
    });
  }

  // 1. Instant synchronous render
  drawView();

  // 2. Fetch live data asynchronously in background
  API.getProduct(productId).then(res => {
    if (res && res.success && res.product) {
      const prod = res.product;
      p.title = prod.title || p.title;
      p.price = prod.final_price || prod.suggested_price || p.price;
      p.artisan_name = prod.artisan_name || p.artisan_name;
      p.artisan_avatar = prod.avatar_url || prod.artisan_avatar || (prod.artisan_id === 2 ? '/assets/artisan_saleem.jpg' : prod.artisan_id === 3 ? '/assets/artisan_budhram.jpg' : prod.artisan_id === 4 ? '/assets/artisan_sunita.jpg' : prod.artisan_id === 5 ? '/assets/artisan_rahul.jpg' : '/assets/artisan_ramulu.jpg');
      p.category = prod.craft_category || p.category;
      p.material = prod.material || p.material;
      p.technique = prod.technique || p.technique;
      p.dimensions = prod.dimensions || p.dimensions;
      p.craft_story = prod.craft_story || p.craft_story;
      p.description = prod.description || p.description;
      p.original_description = prod.description || p.description;
      p.main_image = prod.enhanced_image_url || prod.original_image_url || p.main_image;
      p.thumbs = [p.main_image, prod.original_image_url || '/assets/bidriware_vase.jpg', '/assets/woodcraft_bowl.jpg'].filter(Boolean);
      p.translations = prod.translations || {};
      p.gi_tag = prod.gi_tag_certified !== 0;
      drawView();
    }
  }).catch(() => {});
}
