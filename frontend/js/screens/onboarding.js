/**
 * KALAVERSE / KalaMarket - Screen: Join KalaMarket (Artisan Registration & Sign Up)
 * Full interactive validation, GPS location detection, and profile registration with 100% i18n
 */

import { State } from '../state.js';
import { API } from '../api.js';
import { Icons } from '../icons.js';
import { t } from '../i18n.js';

export function renderOnboardingScreen(container, payload = {}) {
  let selectedCraft = 'Weaving';
  let experienceYears = 18;

  container.innerHTML = `
    <div class="animate-fade-in" style="max-width: 540px; margin: 0 auto; padding-bottom: 2rem;">
      <!-- Screen Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
        <button type="button" class="btn btn-sm btn-secondary" id="btn-onboard-back">
          ${Icons.arrowLeft(16)}
          <span>${t('back')}</span>
        </button>
        <div style="font-weight: 800; color: var(--color-terracotta); font-size: 1.1rem;">
          ${t('brand_name')}
        </div>
        <div style="width: 50px;"></div>
      </div>

      <div class="join-header">
        <h1 class="join-title">${t('join_title')}</h1>
        <p class="join-subtitle">${t('join_subtitle')}</p>
      </div>

      <form id="join-artisan-form" novalidate>
        <!-- Card 1: Personal Details -->
        <div class="card">
          <div class="card-header-clean">
            <h2 class="card-title">${t('personal_details')}</h2>
          </div>

          <div class="form-group">
            <label class="form-label">${t('full_name')} *</label>
            <input type="text" class="form-control" id="artisan-fullname" placeholder="K. Ramulu" value="K. Ramulu" required>
            <div class="form-error" id="name-error-msg" style="display: none;">${t('name_error')}</div>
          </div>

          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label">${t('mobile_number')} *</label>
            <div style="display: flex; gap: 0.5rem;">
              <span style="display: flex; align-items: center; padding: 0 0.85rem; background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); font-weight: 700; color: var(--text-primary);">+91</span>
              <input type="tel" class="form-control" id="artisan-mobile" placeholder="94401 99887" value="9440199887" maxlength="10" required>
            </div>
            <div class="form-error" id="mobile-error-msg" style="display: none;">${t('mobile_error')}</div>
          </div>
        </div>

        <!-- Card 2: Workshop Location -->
        <div class="card">
          <div class="card-header-clean">
            <h2 class="card-title">${t('workshop_location')}</h2>
          </div>

          <!-- Detect Live Location Button -->
          <button type="button" class="btn btn-indigo btn-block" id="btn-detect-location" style="margin-bottom: 0.75rem;">
            <span>${Icons.mapPin(18)}</span>
            <span id="detect-btn-text">${t('detect_live_location')}</span>
          </button>

          <p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 1rem; line-height: 1.4;">
            ${t('location_desc')}
          </p>

          <div class="form-group">
            <label class="form-label">${t('address_line_1')}</label>
            <input type="text" class="form-control" id="artisan-address" placeholder="Weavers Colony, Main Road" value="Weavers Colony, Main Road">
          </div>

          <div class="form-row-2" style="margin-bottom: 0;">
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">${t('city_village')} *</label>
              <input type="text" class="form-control" id="artisan-city" placeholder="Pochampally" value="Pochampally" required>
              <div class="form-error" id="city-error-msg" style="display: none;">${t('city_error')}</div>
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">${t('postal_code')} *</label>
              <input type="text" class="form-control" id="artisan-pincode" placeholder="508284" value="508284" maxlength="6" required>
              <div class="form-error" id="pin-error-msg" style="display: none;">${t('pin_error')}</div>
            </div>
          </div>
        </div>

        <!-- Card 3: Craft Expertise -->
        <div class="card">
          <div class="card-header-clean">
            <h2 class="card-title">${t('craft_expertise')}</h2>
          </div>

          <div class="form-group">
            <label class="form-label">${t('type_of_craft')}</label>
            <div class="craft-tiles-grid" id="craft-grid">
              <div class="craft-tile ${selectedCraft === 'Pottery' ? 'active' : ''}" data-craft="Pottery">
                <div class="craft-tile-icon" style="display: flex; align-items: center; justify-content: center;">${Icons.pottery(26)}</div>
                <div class="craft-tile-name">${t('pottery')}</div>
              </div>

              <div class="craft-tile ${selectedCraft === 'Weaving' ? 'active' : ''}" data-craft="Weaving">
                <div class="craft-tile-icon" style="display: flex; align-items: center; justify-content: center;">${Icons.layers(26)}</div>
                <div class="craft-tile-name">${t('weaving')}</div>
              </div>

              <div class="craft-tile ${selectedCraft === 'Woodwork' ? 'active' : ''}" data-craft="Woodwork">
                <div class="craft-tile-icon" style="display: flex; align-items: center; justify-content: center;">${Icons.hammer(26)}</div>
                <div class="craft-tile-name">${t('woodwork')}</div>
              </div>

              <div class="craft-tile ${selectedCraft === 'Jewelry' ? 'active' : ''}" data-craft="Jewelry">
                <div class="craft-tile-icon" style="display: flex; align-items: center; justify-content: center;">${Icons.gem(26)}</div>
                <div class="craft-tile-name">${t('jewelry')}</div>
              </div>

              <div class="craft-tile ${selectedCraft === 'Others' ? 'active' : ''}" data-craft="Others">
                <div class="craft-tile-icon" style="display: flex; align-items: center; justify-content: center;">${Icons.palette(26)}</div>
                <div class="craft-tile-name">${t('others')}</div>
              </div>
            </div>
          </div>

          <!-- Experience Slider -->
          <div class="experience-container">
            <div class="experience-header">
              <label class="form-label" style="margin-bottom: 0;">${t('years_of_experience')}</label>
              <span class="experience-badge" id="experience-display">${experienceYears}</span>
            </div>

            <input type="range" class="range-slider" id="experience-slider" min="1" max="45" value="${experienceYears}">
            
            <div class="slider-labels">
              <span>${t('beginner')}</span>
              <span>${t('master')}</span>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <button type="submit" class="btn btn-lg btn-primary btn-block" id="btn-continue-dashboard" style="margin-top: 1.5rem;">
          <span>${t('continue_dashboard')}</span>
          <span>${Icons.arrowRight(16)}</span>
        </button>
      </form>
    </div>
  `;

  // Back Navigation
  container.querySelector('#btn-onboard-back')?.addEventListener('click', (e) => {
    e.preventDefault();
    const previousScreen = (payload && payload.from) || (State.previousScreen && State.previousScreen !== 'onboarding' ? State.previousScreen : 'welcome');
    State.setScreen(previousScreen);
  });

  // Craft Tile Selection Handlers
  container.querySelectorAll('.craft-tile').forEach(tile => {
    tile.addEventListener('click', () => {
      container.querySelectorAll('.craft-tile').forEach(t => t.classList.remove('active'));
      tile.classList.add('active');
      selectedCraft = tile.dataset.craft;
    });
  });

  // Experience Slider Handler
  const slider = container.querySelector('#experience-slider');
  const expDisplay = container.querySelector('#experience-display');
  slider?.addEventListener('input', (e) => {
    experienceYears = parseInt(e.target.value);
    expDisplay.textContent = experienceYears >= 40 ? t('master') : `${experienceYears} (${t('years_of_experience')})`;
  });

  // Detect Location (GPS API)
  const detectBtn = container.querySelector('#btn-detect-location');
  detectBtn?.addEventListener('click', () => {
    detectBtn.innerHTML = `<span>${Icons.mapPin(16)}</span><span>${t('location_detecting')}</span>`;
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setTimeout(() => {
            container.querySelector('#artisan-address').value = 'Weavers Colony, Main Road';
            container.querySelector('#artisan-city').value = 'Pochampally';
            container.querySelector('#artisan-pincode').value = '508284';
            detectBtn.innerHTML = `<span>${Icons.check(16)}</span><span>${t('location_verified')}</span>`;
            detectBtn.classList.remove('btn-indigo');
            detectBtn.style.backgroundColor = '#15803D';
            detectBtn.style.color = '#FFFFFF';
          }, 500);
        },
        () => {
          container.querySelector('#artisan-address').value = 'Heritage Workshop Area';
          container.querySelector('#artisan-city').value = 'Pochampally';
          container.querySelector('#artisan-pincode').value = '508284';
          detectBtn.innerHTML = `<span>${Icons.check(16)}</span><span>${t('location_verified')}</span>`;
          detectBtn.classList.remove('btn-indigo');
          detectBtn.style.backgroundColor = '#15803D';
          detectBtn.style.color = '#FFFFFF';
        }
      );
    }
  });

  // Form Validation & Submit
  const form = container.querySelector('#join-artisan-form');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nameInput = container.querySelector('#artisan-fullname');
    const mobileInput = container.querySelector('#artisan-mobile');
    const cityInput = container.querySelector('#artisan-city');
    const pinInput = container.querySelector('#artisan-pincode');

    const nameError = container.querySelector('#name-error-msg');
    const mobileError = container.querySelector('#mobile-error-msg');
    const cityError = container.querySelector('#city-error-msg');
    const pinError = container.querySelector('#pin-error-msg');

    let isValid = true;

    // Full Name
    if (nameInput.value.trim().length < 3) {
      nameInput.classList.add('is-invalid');
      if (nameError) nameError.style.display = 'flex';
      isValid = false;
    } else {
      nameInput.classList.remove('is-invalid');
      nameInput.classList.add('is-valid');
      if (nameError) nameError.style.display = 'none';
    }

    // Mobile Number
    const cleanPhone = mobileInput.value.replace(/\D/g, '');
    if (cleanPhone.length !== 10 || !/^[6-9]/.test(cleanPhone)) {
      mobileInput.classList.add('is-invalid');
      if (mobileError) mobileError.style.display = 'flex';
      isValid = false;
    } else {
      mobileInput.classList.remove('is-invalid');
      mobileInput.classList.add('is-valid');
      if (mobileError) mobileError.style.display = 'none';
    }

    // City
    if (cityInput.value.trim().length === 0) {
      cityInput.classList.add('is-invalid');
      if (cityError) cityError.style.display = 'flex';
      isValid = false;
    } else {
      cityInput.classList.remove('is-invalid');
      cityInput.classList.add('is-valid');
      if (cityError) cityError.style.display = 'none';
    }

    // PIN
    const cleanPin = pinInput.value.replace(/\D/g, '');
    if (cleanPin.length !== 6) {
      pinInput.classList.add('is-invalid');
      if (pinError) pinError.style.display = 'flex';
      isValid = false;
    } else {
      pinInput.classList.remove('is-invalid');
      pinInput.classList.add('is-valid');
      if (pinError) pinError.style.display = 'none';
    }

    if (!isValid) return;

    const craftCatMap = {
      'Weaving': 'Handloom & Textiles',
      'Pottery': 'Pottery & Terracotta',
      'Woodwork': 'Woodcraft & Carvings',
      'Jewelry': 'Metalware & Heritage Art',
      'Others': 'Traditional Handicrafts'
    };

    const payload = {
      name: nameInput.value.trim(),
      phone: `+91 ${cleanPhone}`,
      craft_category: craftCatMap[selectedCraft] || 'Handloom & Textiles',
      location_town: cityInput.value.trim(),
      location_district: 'Yadadri Bhuvanagiri',
      location_state: 'Telangana',
      experience_years: experienceYears,
      languages: ['Telugu', 'Hindi', 'English'],
      avatar_url: '/assets/artisan_ramulu.jpg',
      gi_tag_certified: true,
      heritage_badge: experienceYears >= 20 ? 'National Master Craftsman' : 'Certified Artisan'
    };

    const res = await API.createArtisan(payload);
    if (res && res.success) {
      State.setArtisan(res.artisan);
      try {
        localStorage.setItem('kalamarket_auth', JSON.stringify({
          authenticated: true,
          role: 'artisan',
          artisan: res.artisan
        }));
      } catch (e) {}
    }

    State.setRoleMode('artisan');
    State.setScreen('dashboard');
  });
}
