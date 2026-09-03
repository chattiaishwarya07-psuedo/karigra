/**
 * KALAVERSE / KalaMarket - Screen: Login & Authentication
 * Supports Phone OTP, Email/Password, Google 1-Tap & Demo Persona Switcher with Full i18n
 */

import { State } from '../state.js';
import { API } from '../api.js';
import { Icons } from '../icons.js';
import { t } from '../i18n.js';

export function renderLoginScreen(container, payload = {}) {
  let authMode = payload.mode || 'phone'; // 'phone' | 'email' | 'otp'
  let userRole = payload.role || 'artisan'; // 'artisan' | 'buyer'
  let enteredPhone = '9440199887';
  let generatedOtp = '5290';
  let countdownTimer = 30;
  let timerInterval = null;
  let formError = '';

  function startOtpCountdown() {
    if (timerInterval) clearInterval(timerInterval);
    countdownTimer = 30;
    timerInterval = setInterval(() => {
      countdownTimer--;
      const resendBtn = container.querySelector('#btn-resend-otp');
      const timerLabel = container.querySelector('#otp-countdown-label');
      if (timerLabel) {
        if (countdownTimer > 0) {
          timerLabel.textContent = `(${countdownTimer}s)`;
          if (resendBtn) resendBtn.disabled = true;
        } else {
          timerLabel.textContent = '';
          if (resendBtn) resendBtn.disabled = false;
          clearInterval(timerInterval);
        }
      }
    }, 1000);
  }

  function renderView() {
    container.innerHTML = `
      <div class="animate-fade-in" style="max-width: 480px; margin: 0 auto; padding-bottom: 2rem;">
        <!-- Top Back & Header -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
          <button class="btn btn-sm btn-secondary" id="btn-back-welcome">
            ${Icons.arrowLeft(16)}
            <span>${t('back')}</span>
          </button>
          <div style="font-weight: 800; color: var(--color-terracotta); font-size: 1.15rem;">
            ${t('brand_name')}
          </div>
          <div style="width: 60px;"></div>
        </div>

        <!-- Role Selector Tab (Artisan vs Buyer) -->
        <div class="card" style="padding: 0.4rem; display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem; margin-bottom: 1.25rem;">
          <button class="btn ${userRole === 'artisan' ? 'btn-primary' : 'btn-secondary'}" id="tab-auth-artisan" style="padding: 0.5rem; font-size: 0.85rem;">
            <span style="display: flex; align-items: center; gap: 6px;">${Icons.user(16)} ${t('artisan_login_tab')}</span>
          </button>
          <button class="btn ${userRole === 'buyer' ? 'btn-primary' : 'btn-secondary'}" id="tab-auth-buyer" style="padding: 0.5rem; font-size: 0.85rem;">
            <span style="display: flex; align-items: center; gap: 6px;">${Icons.shoppingBag(16)} ${t('buyer_login_tab')}</span>
          </button>
        </div>

        <!-- Main Auth Card -->
        <div class="card" style="box-shadow: var(--shadow-md);">
          <div class="card-header-clean">
            <h1 class="card-title" style="font-size: 1.35rem;">
              ${authMode === 'otp' ? t('enter_verification_code') : (authMode === 'email' ? t('login_email_title') : t('login_phone_title'))}
            </h1>
            <p class="card-subtitle">
              ${authMode === 'otp' ? `OTP: +91 ${enteredPhone}` : t('login_subtitle')}
            </p>
          </div>

          <!-- Error Alert Banner -->
          ${formError ? `
            <div style="background-color: #FEF2F2; border: 1px solid #F87171; border-radius: var(--radius-sm); padding: 0.75rem 1rem; color: #DC2626; font-size: 0.85rem; font-weight: 600; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
              <span>${Icons.alertCircle(18)}</span>
              <span>${formError}</span>
            </div>
          ` : ''}

          ${authMode === 'phone' ? `
            <!-- Phone Login Form -->
            <form id="phone-login-form" novalidate>
              <div class="form-group">
                <label class="form-label">${t('mobile_number')} *</label>
                <div style="display: flex; gap: 0.5rem;">
                  <span style="display: flex; align-items: center; padding: 0 0.85rem; background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); font-weight: 700; color: var(--text-primary); font-size: 0.95rem;">
                    +91
                  </span>
                  <input type="tel" class="form-control" id="login-phone-input" placeholder="94401 99887" value="${enteredPhone}" maxlength="10" required style="font-size: 1.05rem; font-weight: 700;">
                </div>
                <div class="form-error" id="phone-error-msg" style="display: none;">${t('phone_validation_error')}</div>
              </div>

              <button type="submit" class="btn btn-lg btn-primary btn-block" id="btn-send-otp" style="margin-top: 1.25rem;">
                <span>${t('send_otp')}</span>
                <span>${Icons.arrowRight(16)}</span>
              </button>
            </form>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.25rem; flex-wrap: wrap; gap: 0.5rem;">
              <button class="btn btn-sm btn-secondary" id="btn-switch-email">${t('use_email_instead')}</button>
              <button class="btn btn-sm btn-indigo-outline" id="btn-switch-signup">${t('create_account')}</button>
            </div>
          ` : (authMode === 'otp' ? `
            <!-- OTP Verification Form -->
            <form id="otp-verify-form" novalidate>
              <div class="form-group" style="text-align: center;">
                <label class="form-label" style="margin-bottom: 0.75rem;">${t('enter_otp')}</label>
                <div style="display: flex; justify-content: center; gap: 0.75rem; margin-bottom: 0.75rem;">
                  <input type="tel" maxlength="1" class="form-control otp-input-box" data-idx="0" value="5" style="width: 52px; height: 56px; text-align: center; font-size: 1.6rem; font-weight: 800;" autofocus>
                  <input type="tel" maxlength="1" class="form-control otp-input-box" data-idx="1" value="2" style="width: 52px; height: 56px; text-align: center; font-size: 1.6rem; font-weight: 800;">
                  <input type="tel" maxlength="1" class="form-control otp-input-box" data-idx="2" value="9" style="width: 52px; height: 56px; text-align: center; font-size: 1.6rem; font-weight: 800;">
                  <input type="tel" maxlength="1" class="form-control otp-input-box" data-idx="3" value="0" style="width: 52px; height: 56px; text-align: center; font-size: 1.6rem; font-weight: 800;">
                </div>
                
                <div style="background-color: #F0FDF4; border: 1px solid #BBF7D0; border-radius: var(--radius-xs); padding: 0.4rem 0.75rem; display: inline-block; font-size: 0.8rem; color: #15803D; font-weight: 700; margin-bottom: 1rem;">
                  ${t('demo_code_notice')} ${generatedOtp}
                </div>

                <div class="form-error" id="otp-error-msg" style="display: none; justify-content: center;">${t('otp_validation_error')}</div>
              </div>

              <button type="submit" class="btn btn-lg btn-primary btn-block" id="btn-verify-otp">
                <span>${t('verify_enter_dashboard')}</span>
                <span>${Icons.arrowRight(16)}</span>
              </button>

              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.25rem;">
                <button type="button" class="btn btn-sm btn-secondary" id="btn-change-phone">${t('change_phone_btn')}</button>
                <button type="button" class="btn btn-sm btn-secondary" id="btn-resend-otp" disabled>
                  <span>${t('resend_otp')}</span>
                  <span id="otp-countdown-label">(${countdownTimer}s)</span>
                </button>
              </div>
            </form>
          ` : `
            <!-- Email & Password Form -->
            <form id="email-login-form" novalidate>
              <div class="form-group">
                <label class="form-label">${t('email_address')} *</label>
                <input type="email" class="form-control" id="login-email-input" placeholder="artisan@kalamarket.org" value="ramulu.weaver@kalamarket.org" required>
                <div class="form-error" id="email-error-msg" style="display: none;">${t('email_validation_error')}</div>
              </div>

              <div class="form-group">
                <label class="form-label">${t('password')} *</label>
                <input type="password" class="form-control" id="login-pwd-input" placeholder="••••••••" value="kalamarket2026" minlength="6" required>
                <div class="form-error" id="pwd-error-msg" style="display: none;">${t('pwd_validation_error')}</div>
              </div>

              <button type="submit" class="btn btn-lg btn-primary btn-block" id="btn-email-submit" style="margin-top: 1.25rem;">
                <span>${t('log_in')}</span>
                <span>${Icons.arrowRight(16)}</span>
              </button>
            </form>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.25rem; flex-wrap: wrap; gap: 0.5rem;">
              <button class="btn btn-sm btn-secondary" id="btn-switch-phone">${t('use_phone_instead')}</button>
              <button class="btn btn-sm btn-indigo-outline" id="btn-switch-signup">${t('create_account')}</button>
            </div>
          `)}
        </div>

        <!-- Quick 1-Tap Google Login -->
        <div style="margin-bottom: 1.5rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
            <div style="flex: 1; height: 1px; background: var(--border-subtle);"></div>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">OR 1-CLICK AUTH</span>
            <div style="flex: 1; height: 1px; background: var(--border-subtle);"></div>
          </div>

          <button class="btn btn-lg btn-outline-dark btn-block" id="btn-google-1tap" style="box-shadow: var(--shadow-xs);">
            <span style="color: #EA4335; font-weight: 900; font-size: 1.15rem;">G</span>
            <span>${t('continue_google')}</span>
          </button>
        </div>

        <!-- Quick Demo Persona Switcher (For Evaluators & SIH Demo) -->
        <div class="card" style="background-color: var(--color-terracotta-soft); border-color: #EBD9C3;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.65rem;">
            <div style="font-weight: 800; font-size: 0.85rem; color: var(--color-terracotta); display: flex; align-items: center; gap: 6px;">
              <span>${Icons.sparkles(15)}</span>
              <span>${t('quick_demo_persona')}</span>
            </div>
            <span class="badge badge-gi" style="font-size: 0.65rem;">Verified</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.45rem;">
            <button class="btn btn-sm btn-secondary demo-login-btn" data-persona="ramulu" style="justify-content: flex-start; text-align: left; display: flex; align-items: center; gap: 0.65rem;">
              <span style="color: var(--color-terracotta); display: flex; align-items: center;">${Icons.layers(18)}</span>
              <div style="flex: 1;">
                <strong>K. Ramulu</strong> • Pochampally Double Ikat Master Weaver
              </div>
              <span>${Icons.arrowRight(14)}</span>
            </button>

            <button class="btn btn-sm btn-secondary demo-login-btn" data-persona="saleem" style="justify-content: flex-start; text-align: left; display: flex; align-items: center; gap: 0.65rem;">
              <span style="color: var(--color-terracotta); display: flex; align-items: center;">${Icons.sparkles(18)}</span>
              <div style="flex: 1;">
                <strong>Mohd. Saleem</strong> • Bidriware Silver Inlay Master
              </div>
              <span>${Icons.arrowRight(14)}</span>
            </button>

            <button class="btn btn-sm btn-secondary demo-login-btn" data-persona="budhram" style="justify-content: flex-start; text-align: left; display: flex; align-items: center; gap: 0.65rem;">
              <span style="color: var(--color-terracotta); display: flex; align-items: center;">${Icons.hammer(18)}</span>
              <div style="flex: 1;">
                <strong>Budhram Baghel</strong> • Lost-Wax Dhokra Tribal Master
              </div>
              <span>${Icons.arrowRight(14)}</span>
            </button>
          </div>
        </div>
      </div>
    `;

    // 1. Top Back Button
    container.querySelector('#btn-back-welcome')?.addEventListener('click', () => {
      State.setScreen('welcome');
    });

    // 2. Role Selector Tabs
    container.querySelector('#tab-auth-artisan')?.addEventListener('click', () => {
      userRole = 'artisan';
      formError = '';
      renderView();
    });

    container.querySelector('#tab-auth-buyer')?.addEventListener('click', () => {
      userRole = 'buyer';
      formError = '';
      renderView();
    });

    // 3. Switch Login Methods
    container.querySelector('#btn-switch-email')?.addEventListener('click', () => {
      authMode = 'email';
      formError = '';
      renderView();
    });

    container.querySelector('#btn-switch-phone')?.addEventListener('click', () => {
      authMode = 'phone';
      formError = '';
      renderView();
    });

    container.querySelector('#btn-change-phone')?.addEventListener('click', () => {
      authMode = 'phone';
      formError = '';
      renderView();
    });

    // 4. Switch to Sign Up
    container.querySelectorAll('#btn-switch-signup').forEach(btn => {
      btn.addEventListener('click', () => {
        State.setScreen('onboarding', { role: userRole, from: 'login' });
      });
    });

    // 5. Phone Form Validation & OTP Trigger
    const phoneForm = container.querySelector('#phone-login-form');
    if (phoneForm) {
      phoneForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const phoneInput = container.querySelector('#login-phone-input');
        const errorMsg = container.querySelector('#phone-error-msg');
        const cleanPhone = phoneInput.value.replace(/\D/g, '');

        if (cleanPhone.length !== 10 || !/^[6-9]/.test(cleanPhone)) {
          phoneInput.classList.add('is-invalid');
          if (errorMsg) errorMsg.style.display = 'flex';
          return;
        }

        phoneInput.classList.remove('is-invalid');
        phoneInput.classList.add('is-valid');
        if (errorMsg) errorMsg.style.display = 'none';

        enteredPhone = cleanPhone;
        authMode = 'otp';
        renderView();
        startOtpCountdown();
      });
    }

    // 6. OTP Boxes Auto-Advance Focus & Form Validation
    const otpBoxes = container.querySelectorAll('.otp-input-box');
    if (otpBoxes.length > 0) {
      otpBoxes.forEach((box, idx) => {
        box.addEventListener('input', (e) => {
          const val = e.target.value.replace(/\D/g, '');
          e.target.value = val;
          if (val && idx < otpBoxes.length - 1) {
            otpBoxes[idx + 1].focus();
          }
        });

        box.addEventListener('keydown', (e) => {
          if (e.key === 'Backspace' && !box.value && idx > 0) {
            otpBoxes[idx - 1].focus();
          }
        });
      });

      const otpForm = container.querySelector('#otp-verify-form');
      otpForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const enteredDigits = Array.from(otpBoxes).map(b => b.value).join('');
        const otpError = container.querySelector('#otp-error-msg');

        if (enteredDigits.length !== 4) {
          if (otpError) {
            otpError.textContent = t('otp_validation_error');
            otpError.style.display = 'flex';
          }
          return;
        }

        if (timerInterval) clearInterval(timerInterval);
        completeAuth(userRole === 'buyer');
      });

      const resendBtn = container.querySelector('#btn-resend-otp');
      resendBtn?.addEventListener('click', () => {
        alert(`✓ ${t('resend_otp')}: ${generatedOtp} (+91 ${enteredPhone})`);
        startOtpCountdown();
      });
    }

    // 7. Email Form Validation
    const emailForm = container.querySelector('#email-login-form');
    if (emailForm) {
      emailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = container.querySelector('#login-email-input');
        const pwdInput = container.querySelector('#login-pwd-input');
        const emailError = container.querySelector('#email-error-msg');
        const pwdError = container.querySelector('#pwd-error-msg');

        let isValid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(emailInput.value.trim())) {
          emailInput.classList.add('is-invalid');
          if (emailError) emailError.style.display = 'flex';
          isValid = false;
        } else {
          emailInput.classList.remove('is-invalid');
          emailInput.classList.add('is-valid');
          if (emailError) emailError.style.display = 'none';
        }

        if (pwdInput.value.length < 6) {
          pwdInput.classList.add('is-invalid');
          if (pwdError) pwdError.style.display = 'flex';
          isValid = false;
        } else {
          pwdInput.classList.remove('is-invalid');
          pwdInput.classList.add('is-valid');
          if (pwdError) pwdError.style.display = 'none';
        }

        if (isValid) {
          completeAuth(userRole === 'buyer');
        }
      });
    }

    // 8. Google 1-Tap
    container.querySelector('#btn-google-1tap')?.addEventListener('click', () => {
      completeAuth(userRole === 'buyer');
    });

    // 9. Demo Persona Login Clicks
    container.querySelectorAll('.demo-login-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const personaKey = btn.dataset.persona;
        const matched = State.artisansList.find(a => 
          personaKey === 'ramulu' ? a.name.includes('Ramulu') :
          personaKey === 'saleem' ? a.name.includes('Saleem') :
          a.name.includes('Budhram') || a.name.includes('Baghel')
        ) || State.artisansList[0];

        if (matched) {
          State.setArtisan(matched);
        }
        completeAuth(false);
      });
    });
  }

  function completeAuth(isBuyer) {
    try {
      localStorage.setItem('kalamarket_auth', JSON.stringify({
        authenticated: true,
        role: isBuyer ? 'buyer' : 'artisan',
        phone: enteredPhone,
        timestamp: Date.now()
      }));
    } catch (e) {}

    if (isBuyer) {
      State.setRoleMode('buyer');
      State.setScreen('buyer_catalogue');
    } else {
      State.setRoleMode('artisan');
      State.setScreen('dashboard');
    }
  }

  renderView();
}
