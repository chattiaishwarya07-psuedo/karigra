/**
 * KALAVERSE / KalaMarket - Screen: Discover KalaMarket (Landing Page Overview)
 * Video showcase, Artisan and Buyer pathways, Lucide icons, and 100% i18n support
 */

import { State } from '../state.js';
import { Icons } from '../icons.js';
import { t } from '../i18n.js';

export function renderDiscoverScreen(container) {
  container.innerHTML = `
    <div class="animate-fade-in" style="max-width: 540px; margin: 0 auto; padding-bottom: 2rem;">
      <!-- Hero Headline -->
      <div style="text-align: center; margin: 1.25rem 0 1.5rem 0;">
        <div class="welcome-logo-badge" style="margin: 0 auto 0.75rem auto; display: flex; align-items: center; justify-content: center; width: 52px; height: 52px; border-radius: 50%; background: var(--color-terracotta-soft); color: var(--color-terracotta);">
          ${Icons.sparkles(24)}
        </div>
        <h1 style="font-family: var(--font-serif); font-size: 2rem; color: var(--color-terracotta); line-height: 1.25; margin-bottom: 0.5rem;">
          ${t('brand_name')}
        </h1>
        <p style="font-size: 0.95rem; color: var(--text-secondary); max-width: 400px; margin: 0 auto;">
          ${t('welcome_subtitle')}
        </p>
      </div>

      <!-- Video / Interactive Showcase Card -->
      <div class="card" style="padding: 0; overflow: hidden; margin-bottom: 1.5rem; box-shadow: var(--shadow-md);">
        <div style="position: relative; height: 210px; background: linear-gradient(135deg, #1C1917, #44403C); display: flex; align-items: center; justify-content: center; overflow: hidden;">
          <img src="/assets/ikat_saree.jpg" alt="Pochampally Weaving" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.65;">
          <div style="position: absolute; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 1rem; color: #FFFFFF;">
            <div style="width: 54px; height: 54px; border-radius: 50%; background: rgba(148, 75, 0, 0.9); display: flex; align-items: center; justify-content: center; margin-bottom: 0.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.3); cursor: pointer;" id="btn-play-video">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#FFFFFF" stroke="#FFFFFF"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
            <span style="font-weight: 800; font-size: 0.95rem; text-shadow: 0 1px 4px rgba(0,0,0,0.6);">Watch Heritage Artisan Stories</span>
            <span style="font-size: 0.75rem; opacity: 0.85;">2 min documentary • Bhoodan Pochampally</span>
          </div>
        </div>
      </div>

      <!-- Pathways Dual Cards: For Artisans & For Buyers -->
      <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem;">
        <!-- Artisan Pathway -->
        <div class="card" style="border-left: 4px solid var(--color-terracotta);">
          <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
            <div style="color: var(--color-terracotta); display: flex; align-items: center; margin-top: 2px;">
              ${Icons.user(24)}
            </div>
            <div style="flex: 1;">
              <h2 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.25rem;">
                ${t('artisan_view')}
              </h2>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.45; margin-bottom: 0.75rem;">
                ${t('join_subtitle')}
              </p>
              <button class="btn btn-sm btn-primary" id="btn-discover-artisan">
                <span>${t('new_artisan_register')}</span>
                <span>${Icons.arrowRight(14)}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Buyer Pathway -->
        <div class="card" style="border-left: 4px solid var(--color-indigo);">
          <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
            <div style="color: var(--color-indigo); display: flex; align-items: center; margin-top: 2px;">
              ${Icons.shoppingBag(24)}
            </div>
            <div style="flex: 1;">
              <h2 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.25rem;">
                ${t('buyer_view')}
              </h2>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.45; margin-bottom: 0.75rem;">
                ${t('festive_desc')}
              </p>
              <button class="btn btn-sm btn-indigo" id="btn-discover-buyer">
                <span>${t('buyer_view')}</span>
                <span>${Icons.arrowRight(14)}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Action Buttons -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
        <button class="btn btn-lg btn-outline-dark" id="btn-discover-login">
          <span>${Icons.user(16)}</span>
          <span>${t('log_in')}</span>
        </button>
        <button class="btn btn-lg btn-primary" id="btn-discover-welcome">
          <span>${Icons.globe(16)}</span>
          <span>${t('select_language')}</span>
        </button>
      </div>
    </div>
  `;

  // Attach handlers
  container.querySelector('#btn-play-video')?.addEventListener('click', () => {
    alert("Playing Heritage Artisan Story: 'The Legacy of Pochampally Double Ikat Weavers'.\nExperience the 500-year craft tradition.");
  });

  container.querySelector('#btn-discover-artisan')?.addEventListener('click', () => {
    State.setRoleMode('artisan');
    State.setScreen('onboarding');
  });

  container.querySelector('#btn-discover-buyer')?.addEventListener('click', () => {
    State.setRoleMode('buyer');
    State.setScreen('buyer_catalogue');
  });

  container.querySelector('#btn-discover-login')?.addEventListener('click', () => {
    State.setScreen('login');
  });

  container.querySelector('#btn-discover-welcome')?.addEventListener('click', () => {
    State.setScreen('welcome');
  });
}
