/**
 * Karigra - Screen: Welcome & Language Selection (Stitch Screen 1A)
 * Support for Indian regional languages, Lucide icons, and quick auth
 */

import { State } from '../state.js';
import { Icons } from '../icons.js';
import { t, SUPPORTED_LANGUAGES, changeLanguage } from '../i18n.js';

export function renderWelcomeScreen(container) {
  let selectedLang = State.activeLanguage || 'en';
  let isExpanded = false;

  function renderView() {
    const primaryLangs = SUPPORTED_LANGUAGES.slice(0, 4);
    const extraLangs = SUPPORTED_LANGUAGES.slice(4);

    container.innerHTML = `
      <div class="animate-fade-in" style="max-width: 480px; margin: 0 auto; padding-bottom: 2rem;">
        <!-- Hero Banner -->
        <div class="welcome-hero-banner">
          <div class="welcome-logo-badge" style="display: flex; align-items: center; justify-content: center; width: 52px; height: 52px; border-radius: 50%; background: rgba(255,255,255,0.18); margin: 0 auto 0.4rem auto;">
            ${Icons.sparkles(26)}
          </div>
          <h1 class="welcome-hero-title">${t('welcome_title')}</h1>
          <p class="welcome-hero-sub">${t('brand_name')}</p>
          <p style="font-size: 0.85rem; opacity: 0.85; margin-top: 2px;">${t('welcome_subtitle')}</p>
        </div>

        <!-- Select Language Section -->
        <div>
          <h2 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.4rem;">
            <span>${Icons.globe(18)}</span>
            <span>${t('select_language')}</span>
          </h2>

          <div class="language-grid" id="lang-grid">
            ${primaryLangs.map(l => `
              <button class="lang-btn ${selectedLang === l.code ? 'active' : ''}" data-lang="${l.code}">
                <div class="lang-native">${l.native}</div>
                <div class="lang-english">${l.english}</div>
              </button>
            `).join('')}

            ${isExpanded ? extraLangs.map(l => `
              <button class="lang-btn ${selectedLang === l.code ? 'active' : ''}" data-lang="${l.code}">
                <div class="lang-native">${l.native}</div>
                <div class="lang-english">${l.english}</div>
              </button>
            `).join('') : ''}
          </div>

          <button class="lang-expander-btn" id="expand-langs-btn" style="margin-top: 0.5rem;">
            ${isExpanded ? t('show_less_languages') : t('show_more_languages')}
          </button>
        </div>

        <!-- Log In / Sign Up Section -->
        <div style="margin-top: 1.25rem;">
          <h2 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.75rem;">
            ${t('login_signup')}
          </h2>

          <div class="auth-buttons-list">
            <button class="btn btn-lg btn-primary btn-block" id="btn-auth-phone">
              <span>${Icons.phone(18)}</span>
              <span>${t('continue_phone')}</span>
            </button>

            <button class="btn btn-lg btn-outline-dark btn-block" id="btn-auth-google">
              <span style="color: #EA4335; font-weight: 900; font-size: 1.1rem;">G</span>
              <span>${t('continue_google')}</span>
            </button>

            <button class="btn btn-lg btn-indigo-outline btn-block" id="btn-auth-email">
              <span>${Icons.mail(18)}</span>
              <span>${t('continue_email')}</span>
            </button>

            <!-- Sign Up / Register Button -->
            <button class="btn btn-lg btn-secondary btn-block" id="btn-auth-register" style="margin-top: 0.25rem;">
              <span>${Icons.sparkles(18)}</span>
              <span>${t('new_artisan_register')}</span>
            </button>
          </div>

          <p class="auth-terms-note">
            ${t('terms_note')}
          </p>
        </div>
      </div>
    `;

    // Language Selection Click Handlers
    container.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedLang = btn.dataset.lang;
        changeLanguage(selectedLang);
        renderView();
      });
    });

    // Expand / Collapse Languages
    container.querySelector('#expand-langs-btn')?.addEventListener('click', () => {
      isExpanded = !isExpanded;
      renderView();
    });

    // Auth Handlers
    container.querySelector('#btn-auth-phone')?.addEventListener('click', () => {
      State.setScreen('login', { mode: 'phone' });
    });

    container.querySelector('#btn-auth-google')?.addEventListener('click', () => {
      State.setRoleMode('artisan');
      State.setScreen('dashboard');
    });

    container.querySelector('#btn-auth-email')?.addEventListener('click', () => {
      State.setScreen('login', { mode: 'email' });
    });

    container.querySelector('#btn-auth-register')?.addEventListener('click', () => {
      State.setScreen('onboarding', { from: 'welcome' });
    });
  }

  renderView();
}
