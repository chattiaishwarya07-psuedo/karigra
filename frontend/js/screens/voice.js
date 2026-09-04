/**
 * Karigra - Screen: Add Product - Step 2: Comprehensive Product Details & AI Voice
 * Structured product details with 100% i18n coverage across all 8 languages
 */

import { State } from '../state.js';
import { API } from '../api.js';
import { Icons } from '../icons.js';
import { t } from '../i18n.js';
import { SpeechHandler, LANGUAGE_NAMES } from '../speech.js';

export function renderVoiceScreen(container) {
  const draft = State.draftProduct;
  let isRecording = false;
  let selectedLang = draft.audio_language || State.activeLanguage || 'te';
  const speechHandler = new SpeechHandler();

  const defaultPlaceholderDesc = '';
  const initialTitle = draft.title || '';
  const initialCategory = draft.craft_category || 'Pottery & Terracotta';
  const initialMaterial = draft.material || '';
  const initialTechnique = draft.technique || '';
  const initialDimensions = draft.dimensions || '';
  const initialStory = draft.craft_story || '';
  const initialDescription = draft.description || '';

  const initialMatCost = draft.costs?.raw_material_cost !== undefined ? draft.costs.raw_material_cost : 650;
  const initialLaborHours = draft.costs?.labour_hours !== undefined ? draft.costs.labour_hours : 12;

  let initialMinPrice, initialMaxPrice, initialFinalPrice;
  if (draft.pricing && draft.pricing.min_price) {
    initialMinPrice = draft.pricing.min_price;
    initialMaxPrice = draft.pricing.max_price;
    initialFinalPrice = draft.pricing.final_price || draft.pricing.suggested_price;
  } else {
    const initBase = initialMatCost + (initialLaborHours * 120);
    const initSug = Math.max(initialMatCost, Math.round((initBase * 1.30) / 50) * 50);
    initialMinPrice = Math.max(initialMatCost, Math.round((initBase * 1.15) / 50) * 50);
    initialMaxPrice = Math.max(initSug, Math.round((initSug * 1.25) / 50) * 50);
    initialFinalPrice = initSug;
  }

  container.innerHTML = `
    <div class="animate-fade-in" style="max-width: 540px; margin: 0 auto; padding-bottom: 2rem;">
      <!-- Screen Header & Wizard -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <button class="header-icon-btn" id="btn-close-wizard-2" title="${t('cancel')}">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <h1 style="font-size: 1.35rem; font-weight: 800; color: var(--color-terracotta);">${t('add_product')}</h1>
        <div style="width: 36px;"></div>
      </div>

      <!-- Stitch Wizard Step Indicator -->
      <div class="wizard-steps">
        <div class="wizard-step completed">
          <div class="step-circle">✓</div>
          <span class="step-label">${t('step_photo')}</span>
        </div>
        <div class="wizard-line"></div>
        <div class="wizard-step active">
          <div class="step-circle">2</div>
          <span class="step-label">${t('step_details')}</span>
        </div>
        <div class="wizard-line"></div>
        <div class="wizard-step">
          <div class="step-circle">3</div>
          <span class="step-label">${t('step_price')}</span>
        </div>
      </div>

      <!-- Card 1: Product Specifications & Details -->
      <div class="card" style="box-shadow: var(--shadow-sm); margin-bottom: 1.25rem;">
        <div class="card-header-clean" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="color: var(--color-terracotta);">${Icons.edit ? Icons.edit(20) : '📝'}</span>
            <h2 class="card-title">${t('product_specs_title')}</h2>
          </div>
          <button type="button" class="btn btn-sm" id="btn-auto-fill-specs" style="display: flex; align-items: center; gap: 4px; padding: 0.35rem 0.75rem; font-size: 0.8rem; font-weight: 700; background: rgba(99, 102, 241, 0.08); color: var(--color-terracotta); border: 1px solid rgba(212, 91, 62, 0.3); border-radius: var(--radius-sm); cursor: pointer;" title="${t('ai_autofill_btn')}">
            <span>${Icons.sparkles(14)}</span>
            <span id="btn-auto-fill-text">${t('ai_autofill_btn')}</span>
          </button>
        </div>
        <p class="card-subtitle" style="margin-top: -0.25rem; margin-bottom: 0.75rem;">${t('product_specs_sub')}</p>

        <!-- AI Auto-Fill Feedback Notice -->
        <div id="autofill-feedback-notice" style="display: none; padding: 0.6rem 0.85rem; margin-bottom: 1rem; border-radius: var(--radius-sm); background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); color: #065f46; font-size: 0.8rem; font-weight: 600; align-items: center; gap: 6px;">
          <span>${Icons.sparkles(16)}</span>
          <span id="autofill-feedback-text">${t('ai_autofill_success')}</span>
        </div>

        <div class="form-group">
          <label class="form-label">${t('product_title_label')}</label>
          <input type="text" class="form-control" id="product-title-input" value="${initialTitle}" placeholder="${t('product_title_ph')}" required>
        </div>

        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label">${t('craft_category_label')}</label>
            <select class="form-control" id="product-category-select">
              <option value="Pottery & Terracotta" ${initialCategory === 'Pottery & Terracotta' ? 'selected' : ''}>Pottery & Terracotta</option>
              <option value="Handloom & Textiles" ${initialCategory === 'Handloom & Textiles' ? 'selected' : ''}>Handloom & Textiles</option>
              <option value="Metalware & Heritage Art" ${initialCategory === 'Metalware & Heritage Art' ? 'selected' : ''}>Metalware & Silver Inlay</option>
              <option value="Brass & Bell Metal Craft" ${initialCategory === 'Brass & Bell Metal Craft' ? 'selected' : ''}>Brass & Bell Metal (Dhokra)</option>
              <option value="Woodcraft & Carvings" ${initialCategory === 'Woodcraft & Carvings' ? 'selected' : ''}>Woodcraft & Carvings</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">${t('dimensions_label')}</label>
            <input type="text" class="form-control" id="product-dimensions-input" value="${initialDimensions}" placeholder="${t('dimensions_ph')}">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">${t('materials_label')}</label>
          <input type="text" class="form-control" id="product-materials-input" value="${initialMaterial}" placeholder="${t('materials_ph')}">
        </div>

        <div class="form-group">
          <label class="form-label">${t('technique_label')}</label>
          <input type="text" class="form-control" id="product-technique-input" value="${initialTechnique}" placeholder="${t('technique_ph')}">
        </div>

        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label">${t('story_label')}</label>
          <textarea class="form-control" id="product-story-input" rows="2" placeholder="${t('story_ph')}">${initialStory}</textarea>
        </div>
      </div>

      <!-- Card 2: Talk to Describe & AI Voice -->
      <div class="card" style="box-shadow: var(--shadow-sm); margin-bottom: 1.25rem;">
        <div class="card-header-clean">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="color: var(--color-terracotta);">${Icons.mic(20)}</span>
            <h2 class="card-title">${t('voice_input_title')}</h2>
          </div>
          <p class="card-subtitle">${t('voice_input_sub')}</p>
        </div>

        <!-- Language Selector Bar -->
        <div class="form-group" style="margin-bottom: 1rem;">
          <label class="form-label" style="font-size: 0.8rem; font-weight: 700; color: var(--color-terracotta);">${t('choose_voice_language')}</label>
          <div class="voice-language-bar" style="display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 0.25rem;">
            <button class="btn btn-sm voice-lang-btn ${selectedLang === 'te' ? 'btn-primary' : 'btn-secondary'}" data-lang="te">తెలుగు</button>
            <button class="btn btn-sm voice-lang-btn ${selectedLang === 'hi' ? 'btn-primary' : 'btn-secondary'}" data-lang="hi">हिन्दी</button>
            <button class="btn btn-sm voice-lang-btn ${selectedLang === 'en' ? 'btn-primary' : 'btn-secondary'}" data-lang="en">English</button>
            <button class="btn btn-sm voice-lang-btn ${selectedLang === 'bn' ? 'btn-primary' : 'btn-secondary'}" data-lang="bn">বাংলা</button>
            <button class="btn btn-sm voice-lang-btn ${selectedLang === 'mr' ? 'btn-primary' : 'btn-secondary'}" data-lang="mr">मराठी</button>
            <button class="btn btn-sm voice-lang-btn ${selectedLang === 'ta' ? 'btn-primary' : 'btn-secondary'}" data-lang="ta">தமிழ்</button>
            <button class="btn btn-sm voice-lang-btn ${selectedLang === 'kn' ? 'btn-primary' : 'btn-secondary'}" data-lang="kn">ಕನ್ನಡ</button>
            <button class="btn btn-sm voice-lang-btn ${selectedLang === 'gu' ? 'btn-primary' : 'btn-secondary'}" data-lang="gu">ગુજરાતી</button>
          </div>
        </div>

        <!-- Centered Voice Action Area -->
        <div class="voice-hero-card">
          <button class="mic-button-stitch" id="mic-action-btn" title="${t('tap_to_speak')}">
            <span id="mic-icon-stitch">${Icons.mic(34)}</span>
          </button>
          <p class="mic-instruction-label" id="mic-label">${t('tap_to_speak')}</p>
          <p class="mic-sub-label" id="mic-status">${t('tap_to_speak')}</p>

          <!-- Dynamic Audio Waveform -->
          <div class="audio-waveform-container" id="waveform-box" style="display: none; margin-top: 1rem;">
            <div class="waveform-bar"></div>
            <div class="waveform-bar"></div>
            <div class="waveform-bar"></div>
            <div class="waveform-bar"></div>
            <div class="waveform-bar"></div>
            <div class="waveform-bar"></div>
            <div class="waveform-bar"></div>
            <div class="waveform-bar"></div>
          </div>
        </div>

        <!-- Description Box -->
        <div class="form-group" style="margin-top: 1.25rem; margin-bottom: 0;">
          <label class="form-label">${t('product_description')}</label>
          <textarea class="form-control" id="product-description-field" rows="4" placeholder="${t('product_description_ph')}">${initialDescription}</textarea>
        </div>
      </div>

      <!-- Card 3: AI Pricing Assistant (in ₹) -->
      <div class="card" style="box-shadow: var(--shadow-sm);">
        <div class="card-header-clean">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="color: var(--color-terracotta);">${Icons.calculator(20)}</span>
            <h2 class="card-title">${t('ai_pricing_title')}</h2>
          </div>
          <p class="card-subtitle">${t('ai_pricing_sub')}</p>
        </div>

        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label">${t('material_cost')}</label>
            <input type="number" class="form-control" id="cost-materials" value="${initialMatCost}" min="0">
          </div>
          <div class="form-group">
            <label class="form-label">${t('labor_hours')}</label>
            <input type="number" class="form-control" id="cost-hours" value="${initialLaborHours}" min="1">
          </div>
        </div>

        <button type="button" class="btn btn-indigo btn-block" id="btn-calc-price" style="margin-bottom: 1rem;">
          <span>${Icons.sparkles(16)}</span>
          <span>${t('calculate_fair_price')}</span>
        </button>

        <!-- AI Suggested Price Banner Box -->
        <div class="pricing-suggested-box" id="suggested-price-box">
          <div class="pricing-suggested-label">${t('ai_suggested_price')}</div>
          <div class="pricing-suggested-amount" id="pricing-suggested-range">
            ₹${initialMinPrice.toLocaleString('en-IN')} - ₹${initialMaxPrice.toLocaleString('en-IN')}
          </div>
          <div class="pricing-disclaimer">
            <span style="display: inline-flex; align-items: center; gap: 4px;">${Icons.shieldCheck(14)} <span>${t('pricing_disclaimer')}</span></span>
          </div>

          <!-- Final Price Input -->
          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label" style="color: var(--color-terracotta);">${t('set_final_price')}</label>
            <input type="number" class="form-control" id="final-price-input" value="${initialFinalPrice}" style="font-size: 1.25rem; font-weight: 800; color: var(--color-terracotta);">
          </div>
        </div>
      </div>

      <!-- Navigation Actions -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-top: 1rem;">
        <button class="btn btn-lg btn-secondary" id="btn-back-step1">
          ${Icons.arrowLeft(16)}
          <span>${t('back')}</span>
        </button>
        <button class="btn btn-lg btn-primary" id="btn-next-step3">
          <span>${t('review_publish')}</span>
          <span>${Icons.arrowRight(16)}</span>
        </button>
      </div>
    </div>
  `;

  // UI Element References
  const micBtn = container.querySelector('#mic-action-btn');
  const micLabel = container.querySelector('#mic-label');
  const micStatus = container.querySelector('#mic-status');
  const waveformBox = container.querySelector('#waveform-box');
  const descField = container.querySelector('#product-description-field');
  const titleField = container.querySelector('#product-title-input');
  const categorySelect = container.querySelector('#product-category-select');

  // Helper to sync inputs with draft state
  descField?.addEventListener('input', () => {
    State.updateDraft({ description: descField.value });
  });
  titleField?.addEventListener('input', () => {
    State.updateDraft({ title: titleField.value });
  });

  // Language Selection
  container.querySelectorAll('.voice-lang-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      container.querySelectorAll('.voice-lang-btn').forEach(b => {
        b.classList.remove('btn-primary');
        b.classList.add('btn-secondary');
      });
      btn.classList.remove('btn-secondary');
      btn.classList.add('btn-primary');
      selectedLang = btn.dataset.lang;
      State.updateDraft({ audio_language: selectedLang });

      // If currently recording, restart recognition in the selected language
      if (isRecording) {
        speechHandler.stopRecording();
        await startActiveRecognition();
      }
    });
  });

  async function performAutoFill(showFeedback = true) {
    const desc = descField ? descField.value.trim() : '';
    const imgUrl = draft.enhanced_image_url || draft.original_image_url || '';
    const currentCategory = container.querySelector('#product-category-select')?.value;

    if (!desc && !imgUrl) {
      if (showFeedback) {
        alert("Please upload a product photo in Step 1 or describe your product first.");
      }
      return;
    }

    const autoFillBtn = container.querySelector('#btn-auto-fill-specs');
    const autoFillText = container.querySelector('#btn-auto-fill-text');
    const noticeBox = container.querySelector('#autofill-feedback-notice');

    if (autoFillBtn && showFeedback) {
      autoFillBtn.disabled = true;
      if (autoFillText) autoFillText.textContent = t('ai_autofill_loading') || 'Inferring...';
    }

    try {
      const res = await API.autoFillDetails({
        description: desc !== defaultPlaceholderDesc ? desc : '',
        image_url: imgUrl,
        craft_category: currentCategory
      });

      if (res && res.success) {
        if (res.title) {
          const tInput = container.querySelector('#product-title-input');
          if (tInput) tInput.value = res.title;
        }
        if (res.craft_category) {
          const select = container.querySelector('#product-category-select');
          if (select) {
            for (let i = 0; i < select.options.length; i++) {
              if (select.options[i].value === res.craft_category) {
                select.selectedIndex = i;
                break;
              }
            }
          }
        }
        if (res.material) {
          const mInput = container.querySelector('#product-materials-input');
          if (mInput) mInput.value = res.material;
        }
        if (res.technique) {
          const techInput = container.querySelector('#product-technique-input');
          if (techInput) techInput.value = res.technique;
        }
        if (res.craft_story) {
          const sInput = container.querySelector('#product-story-input');
          if (sInput) sInput.value = res.craft_story;
        }
        if (res.has_dimensions && res.dimensions) {
          const dInput = container.querySelector('#product-dimensions-input');
          if (dInput) dInput.value = res.dimensions;
        }

        if (noticeBox && showFeedback) {
          noticeBox.style.display = 'flex';
          setTimeout(() => {
            if (noticeBox) noticeBox.style.display = 'none';
          }, 6000);
        }
      }
    } catch (e) {
      console.error("Auto-Fill error:", e);
    } finally {
      if (autoFillBtn) {
        autoFillBtn.disabled = false;
        if (autoFillText) autoFillText.textContent = t('ai_autofill_btn');
      }
    }
  }

  container.querySelector('#btn-auto-fill-specs')?.addEventListener('click', () => {
    performAutoFill(true);
  });

  // Automatically infer details from the uploaded product image if specifications are not yet filled
  const uploadedImageSrc = draft.enhanced_image_url || draft.original_image_url || '';
  if (uploadedImageSrc && !draft.title) {
    performAutoFill(false);
  }

  async function translateAndApplyToDescription(regionalText, langCode) {
    if (!regionalText || regionalText === defaultPlaceholderDesc) return;
    const langName = LANGUAGE_NAMES[langCode] || langCode.toUpperCase();

    if (langCode === 'en') {
      descField.value = regionalText;
      State.updateDraft({
        description: regionalText,
        speech_transcript: regionalText,
        audio_language: 'en'
      });
      micStatus.textContent = `✓ ${t('voice_captured_msg')}`;
      await performAutoFill(true);
      return;
    }

    micStatus.textContent = `Translating from ${langName} to English...`;

    try {
      const res = await API.translateDescription(regionalText, langCode, 'en', categorySelect?.value);
      if (res && res.success && res.translated_text) {
        const translatedEnglish = res.translated_text;
        descField.value = translatedEnglish;
        const currentTranslations = State.draftProduct.translations || {};
        State.updateDraft({
          description: translatedEnglish,
          speech_transcript: regionalText,
          original_description: regionalText,
          audio_language: langCode,
          translations: {
            ...currentTranslations,
            en: {
              language_name: 'English',
              title: titleField.value || 'Handcrafted Heritage Masterpiece',
              description: translatedEnglish,
              craft_story: State.draftProduct.craft_story || ''
            },
            [langCode]: {
              language_name: langName,
              title: titleField.value || 'Handcrafted Heritage Masterpiece',
              description: regionalText,
              craft_story: State.draftProduct.craft_story || ''
            }
          }
        });
        micStatus.textContent = `✓ Translated from ${langName} to English!`;
        await performAutoFill(true);
      } else {
        console.error("Translation error: Invalid response from translation service", res);
        micStatus.textContent = `✓ ${t('voice_captured_msg')}`;
      }
    } catch (err) {
      console.error("Translation error:", err);
      micStatus.textContent = `✓ ${t('voice_captured_msg')}`;
    }
  }

  async function startActiveRecognition() {
    isRecording = true;
    micBtn.classList.add('recording');
    micLabel.textContent = t('listening_voice_msg');
    const langName = LANGUAGE_NAMES[selectedLang] || selectedLang.toUpperCase();
    micStatus.textContent = `${t('tap_finish_msg')} (${langName})`;
    waveformBox.style.display = 'flex';

    // Clear default placeholder description if user hasn't typed a custom one yet
    if (selectedLang === 'en' && descField.value.trim() === defaultPlaceholderDesc) {
      descField.value = '';
    }

    let hasReceivedFirstSpeech = false;

    await speechHandler.startRecording({
      languageCode: selectedLang,
      waveformEl: waveformBox,
      onStart: () => {
        micStatus.textContent = `${t('listening_voice_msg')} (${langName})`;
      },
      onInterim: ({ fullText, interimText }) => {
        if (fullText) {
          if (selectedLang === 'en') {
            if (!hasReceivedFirstSpeech && descField.value === defaultPlaceholderDesc) {
              descField.value = '';
            }
            hasReceivedFirstSpeech = true;
            descField.value = fullText;
          }
          micStatus.textContent = interimText || fullText || t('tap_finish_msg');
        }
      },
      onFinal: (accumulated) => {
        if (accumulated && selectedLang === 'en') {
          descField.value = accumulated;
        }
      },
      onError: (errMsg) => {
        console.warn("Voice capture notification:", errMsg);
        isRecording = false;
        micBtn.classList.remove('recording');
        waveformBox.style.display = 'none';
        micLabel.textContent = t('tap_to_speak');
        micStatus.textContent = errMsg;
      },
      onEnd: async (finalTranscript) => {
        isRecording = false;
        micBtn.classList.remove('recording');
        waveformBox.style.display = 'none';
        micLabel.textContent = t('tap_to_speak');
        const captured = finalTranscript || speechHandler.accumulatedTranscript || (selectedLang === 'en' ? descField.value.trim() : '');
        if (captured && captured !== defaultPlaceholderDesc) {
          await translateAndApplyToDescription(captured, selectedLang);
        } else {
          micStatus.textContent = `✓ ${t('voice_captured_msg')}`;
        }
      }
    });
  }

  // Voice Recording Toggle Action Handler
  micBtn?.addEventListener('click', async () => {
    if (!isRecording) {
      await startActiveRecognition();
    } else {
      isRecording = false;
      const transcript = speechHandler.stopRecording();
      micBtn.classList.remove('recording');
      micLabel.textContent = t('tap_to_speak');
      waveformBox.style.display = 'none';

      const captured = transcript || speechHandler.accumulatedTranscript || (selectedLang === 'en' ? descField.value.trim() : '');
      if (captured && captured !== defaultPlaceholderDesc) {
        await translateAndApplyToDescription(captured, selectedLang);
      } else {
        micStatus.textContent = `✓ ${t('voice_captured_msg')}`;
      }
    }
  });

  // Calculate Fair Price Handler
  const calcBtn = container.querySelector('#btn-calc-price');
  const calculateAndApplyPrice = async () => {
    const matInput = container.querySelector('#cost-materials');
    const hoursInput = container.querySelector('#cost-hours');
    const matCost = parseFloat(matInput ? matInput.value : 0) || 0;
    const hours = parseFloat(hoursInput ? hoursInput.value : 0) || 0;
    const category = container.querySelector('#product-category-select')?.value || 'Handloom & Textiles';

    if (calcBtn) {
      calcBtn.disabled = true;
      calcBtn.innerHTML = `<span>${Icons.sparkles(16)}</span><span>Calculating...</span>`;
    }

    try {
      const res = await API.calculatePrice(
        {
          raw_material_cost: matCost,
          labour_hours: hours,
          labour_rate_per_hour: 120
        },
        category
      );

      if (res && res.success) {
        const minP = res.min_price || Math.max(matCost, Math.round((matCost + hours * 120) * 1.15));
        const maxP = res.max_price || Math.max(minP, Math.round((res.suggested_price || (matCost + hours * 120) * 1.3) * 1.25));
        const sugP = res.suggested_price || Math.max(matCost, Math.round((matCost + hours * 120) * 1.30));

        const rangeEl = container.querySelector('#pricing-suggested-range');
        if (rangeEl) {
          rangeEl.textContent = `₹${minP.toLocaleString('en-IN')} - ₹${maxP.toLocaleString('en-IN')}`;
        }

        const finalInput = container.querySelector('#final-price-input');
        if (finalInput) {
          finalInput.value = sugP;
        }

        State.updateDraft({
          pricing: {
            ...res,
            suggested_price: sugP,
            min_price: minP,
            max_price: maxP,
            final_price: sugP
          },
          costs: { raw_material_cost: matCost, labour_hours: hours, labour_rate_per_hour: 120 }
        });
      }
    } catch (err) {
      console.error("Pricing calculation error:", err);
    } finally {
      if (calcBtn) {
        calcBtn.disabled = false;
        calcBtn.innerHTML = `<span>${Icons.sparkles(16)}</span><span>${t('calculate_fair_price')}</span>`;
      }
    }
  };

  calcBtn?.addEventListener('click', calculateAndApplyPrice);
  container.querySelector('#cost-materials')?.addEventListener('change', calculateAndApplyPrice);
  container.querySelector('#cost-hours')?.addEventListener('change', calculateAndApplyPrice);

  // Navigation handlers
  container.querySelector('#btn-close-wizard-2')?.addEventListener('click', () => {
    if (isRecording) speechHandler.stopRecording();
    State.setScreen('dashboard');
  });
  
  container.querySelector('#btn-back-step1')?.addEventListener('click', () => {
    if (isRecording) speechHandler.stopRecording();
    State.setScreen('studio');
  });
  
  container.querySelector('#btn-next-step3')?.addEventListener('click', () => {
    if (isRecording) speechHandler.stopRecording();

    const titleVal = container.querySelector('#product-title-input').value.trim() || 'Handcrafted Heritage Masterpiece';
    const categoryVal = container.querySelector('#product-category-select').value;
    const materialsVal = container.querySelector('#product-materials-input').value.trim();
    const techniqueVal = container.querySelector('#product-technique-input').value.trim();
    const dimensionsVal = container.querySelector('#product-dimensions-input').value.trim();
    const storyVal = container.querySelector('#product-story-input').value.trim();
    const descVal = container.querySelector('#product-description-field').value.trim();
    const finalPrice = parseFloat(container.querySelector('#final-price-input').value) || 2100;

    State.updateDraft({
      title: titleVal,
      craft_category: categoryVal,
      material: materialsVal,
      technique: techniqueVal,
      dimensions: dimensionsVal,
      craft_story: storyVal,
      description: descVal,
      audio_language: selectedLang,
      pricing: {
        ...State.draftProduct.pricing,
        final_price: finalPrice,
        suggested_price: finalPrice,
        min_price: Math.round(finalPrice * 0.85),
        max_price: Math.round(finalPrice * 1.25)
      }
    });

    State.setScreen('approval');
  });
}
