/**
 * KALAVERSE / KalaMarket - Screen: Wholesale Raw Materials B2B Sourcing
 * All pricing in Indian Rupees (₹) with dynamic category, search filtering, and 100% i18n
 */

import { State } from '../state.js';
import { Icons } from '../icons.js';
import { t } from '../i18n.js';

export function renderWholesaleScreen(container) {
  const allMaterials = [
    {
      id: 1,
      sku: 'SKU: TK-WD-104',
      name: 'Premium Burmese Teak Lumber',
      desc: 'Grade A, kiln-dried seasoned wood. Ideal for high-end heritage furniture and temple carvings.',
      price: '₹1,450 / cu ft',
      price_raw: 1450,
      moq: '50 cu ft',
      category: 'Wood & Timber',
      in_stock: true,
      image_url: '/assets/teak_lumber.jpg'
    },
    {
      id: 2,
      sku: 'SKU: SLK-YD-055',
      name: 'Raw Organic Ahimsa Silk Yardage',
      desc: 'Unbleached, 44" width pure mulberry silk. Sourced ethically for conscious handloom fashion lines.',
      price: '₹950 / meter',
      price_raw: 950,
      moq: '25 meters',
      category: 'Silk & Fibers',
      in_stock: true,
      image_url: '/assets/ikat_saree.jpg'
    },
    {
      id: 3,
      sku: 'SKU: TC-PT-002',
      name: 'Unglazed Terracotta Planters (8")',
      desc: 'Hand-thrown, breathable river clay. Standard 8-inch diameter with natural water drainage hole.',
      price: '₹350 / unit',
      price_raw: 350,
      moq: '50 units',
      category: 'Clay & Ceramics',
      in_stock: true,
      image_url: '/assets/raw_pottery_snap.jpg'
    },
    {
      id: 4,
      sku: 'SKU: MT-SL-088',
      name: 'Pure Silver Wire Inlay Spools (0.5mm)',
      desc: '99.9% pure silver inlay wire spools crafted specifically for Bidriware and metallic heritage crafts.',
      price: '₹2,800 / spool',
      price_raw: 2800,
      moq: '5 spools',
      category: 'Metals & Inlay',
      in_stock: true,
      image_url: '/assets/silver_wire_spools.jpg'
    },
    {
      id: 5,
      sku: 'SKU: BR-DK-019',
      name: 'High-Grade Bell Metal Brass Pellets',
      desc: 'Traditional copper-tin bell metal alloy ingots formulated for lost-wax Dhokra tribal metal casting.',
      price: '₹620 / kg',
      price_raw: 620,
      moq: '20 kg',
      category: 'Metals & Inlay',
      in_stock: true,
      image_url: '/assets/dhokra_brass.jpg'
    }
  ];

  let activeCategory = 'All';
  let searchQuery = '';

  function getFilteredMaterials() {
    return allMaterials.filter(m => {
      const matchCat = (activeCategory === 'All') || (m.category === activeCategory);
      const matchSearch = searchQuery.trim() === '' || 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        m.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }

  function renderView() {
    const materials = getFilteredMaterials();
    const isFiltered = activeCategory !== 'All' || searchQuery.trim() !== '';

    container.innerHTML = `
      <div class="animate-fade-in" style="padding-bottom: 5rem;">
        <!-- Search by SKU or Name Input -->
        <div class="form-group" style="margin-bottom: 0.75rem;">
          <label class="form-label" style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; display: flex; justify-content: space-between;">
            <span>${t('wholesale_search')}</span>
            <span style="color: var(--color-terracotta); font-weight: 700;">Indian Rupees (₹)</span>
          </label>
          <div class="search-container" style="margin-bottom: 0;">
            <span class="search-icon">${Icons.search(18)}</span>
            <input type="search" class="search-input" id="wholesale-search" placeholder="${t('wholesale_search')}" value="${searchQuery}">
          </div>
        </div>

        <!-- Dynamic Category Chips & Reset Filter -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.5rem;">
          <div class="category-chips-row" style="margin-bottom: 0; flex: 1;">
            <button class="chip ${activeCategory === 'All' ? 'active' : ''}" data-cat="All">
              <span style="display: flex; align-items: center;">${Icons.grid(14)}</span>
              <span>${t('all_categories')}</span>
            </button>
            <button class="chip ${activeCategory === 'Wood & Timber' ? 'active' : ''}" data-cat="Wood & Timber">
              <span style="display: flex; align-items: center;">${Icons.treePine(14)}</span>
              <span>Wood & Timber</span>
            </button>
            <button class="chip ${activeCategory === 'Silk & Fibers' ? 'active' : ''}" data-cat="Silk & Fibers">
              <span style="display: flex; align-items: center;">${Icons.layers(14)}</span>
              <span>Silk & Fibers</span>
            </button>
            <button class="chip ${activeCategory === 'Clay & Ceramics' ? 'active' : ''}" data-cat="Clay & Ceramics">
              <span style="display: flex; align-items: center;">${Icons.pottery(14)}</span>
              <span>Clay & Ceramics</span>
            </button>
            <button class="chip ${activeCategory === 'Metals & Inlay' ? 'active' : ''}" data-cat="Metals & Inlay">
              <span style="display: flex; align-items: center;">${Icons.gem(14)}</span>
              <span>Metals & Inlay</span>
            </button>
          </div>

          ${isFiltered ? `
            <button class="btn-reset-filters" id="btn-clear-wholesale-filter" title="${t('clear_filters')}">
              <span style="display: flex; align-items: center;">${Icons.rotateCcw(13)}</span>
              <span>${t('clear_filters')}</span>
            </button>
          ` : ''}
        </div>

        <!-- Materials List -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <h2 style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary);">
            ${t('wholesale_title')} (${materials.length})
          </h2>
          <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">
            Direct Artisan Sourcing
          </span>
        </div>

        ${materials.length === 0 ? `
          <div class="card" style="text-align: center; padding: 2.5rem 1rem;">
            <div style="display: flex; justify-content: center; margin-bottom: 0.5rem; color: var(--text-muted);">${Icons.package(40)}</div>
            <h3 style="font-size: 1rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.25rem;">
              ${t('no_products_found')}
            </h3>
            <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 1rem;">
              ${t('no_products_sub')}
            </p>
            <button class="btn btn-sm btn-primary" id="btn-reset-wholesale-empty">
              <span style="display: flex; align-items: center;">${Icons.rotateCcw(13)}</span>
              <span>${t('clear_filters')}</span>
            </button>
          </div>
        ` : `
          <div class="wholesale-list">
            ${materials.map(m => `
              <div class="card wholesale-card" style="box-shadow: var(--shadow-sm); margin-bottom: 1rem;">
                <div class="wholesale-card-body">
                  <div class="wholesale-img-wrap" style="position: relative;">
                    <img src="${m.image_url}" alt="${m.name}" class="wholesale-img">
                    <span class="badge badge-stock" style="position: absolute; bottom: 6px; left: 6px; font-size: 0.65rem;">
                      ${t('in_stock')}
                    </span>
                  </div>

                  <div class="wholesale-info">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.25rem;">
                      <span class="wholesale-sku">${m.sku}</span>
                      <span class="badge badge-gi" style="font-size: 0.65rem;">Verified B2B</span>
                    </div>

                    <h3 class="wholesale-title">${m.name}</h3>
                    <p class="wholesale-desc">${m.desc}</p>

                    <div class="wholesale-meta-row">
                      <div class="wholesale-price-box">
                        <span class="wholesale-price-label">${t('price_per_unit')}</span>
                        <span class="wholesale-price-val">${m.price}</span>
                      </div>
                      <div class="wholesale-moq-box">
                        <span class="wholesale-moq-label">${t('moq')}</span>
                        <span class="wholesale-moq-val">${m.moq}</span>
                      </div>
                    </div>

                    <button class="btn btn-primary btn-block btn-request-quote" data-name="${m.name}" data-price="${m.price}">
                      <span style="display: flex; align-items: center;">${Icons.mail(15)}</span>
                      <span>${t('request_quote')}</span>
                    </button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;

    // Search Input Handler
    const searchInput = container.querySelector('#wholesale-search');
    searchInput?.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderView();
      const newSearch = container.querySelector('#wholesale-search');
      if (newSearch) {
        newSearch.focus();
        newSearch.setSelectionRange(searchQuery.length, searchQuery.length);
      }
    });

    // Category Chip Handlers
    container.querySelectorAll('.category-chips-row .chip').forEach(btn => {
      btn.addEventListener('click', () => {
        activeCategory = btn.dataset.cat;
        renderView();
      });
    });

    // Clear Filters Handlers
    container.querySelector('#btn-clear-wholesale-filter')?.addEventListener('click', () => {
      activeCategory = 'All';
      searchQuery = '';
      renderView();
    });

    container.querySelector('#btn-reset-wholesale-empty')?.addEventListener('click', () => {
      activeCategory = 'All';
      searchQuery = '';
      renderView();
    });

    // Request Quote Handlers
    container.querySelectorAll('.btn-request-quote').forEach(btn => {
      btn.addEventListener('click', () => {
        const matName = btn.dataset.name;
        const matPrice = btn.dataset.price;
        const qty = prompt(`${t('quote_qty_prompt')}\n\nItem: ${matName} (${matPrice})`, "100 units");
        if (qty) {
          alert(`✓ ${t('quote_sent_alert')}`);
        }
      });
    });
  }

  renderView();
}
