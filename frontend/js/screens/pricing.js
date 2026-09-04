/**
 * Karigra - Screen 6: AI Pricing Assistant
 */

import { State } from '../state.js';
import { API } from '../api.js';
import { Icons } from '../icons.js';

export function renderPricingScreen(container) {
  const draft = State.draftProduct;
  const costs = draft.costs || {
    raw_material_cost: 3800,
    labour_hours: 60,
    labour_rate_per_hour: 120,
    packaging_cost: 250,
    transport_cost: 350,
    other_cost: 200
  };

  const pricing = draft.pricing || {
    suggested_price: 18500,
    min_price: 15500,
    max_price: 22000,
    final_price: 18500,
    margin_percent: 32.5,
    factors_breakdown: []
  };

  const calculateTotalCost = () => {
    return parseFloat(costs.raw_material_cost || 0) +
           (parseFloat(costs.labour_hours || 0) * parseFloat(costs.labour_rate_per_hour || 0)) +
           parseFloat(costs.packaging_cost || 0) +
           parseFloat(costs.transport_cost || 0) +
           parseFloat(costs.other_cost || 0);
  };

  container.innerHTML = `
    <div class="animate-fade-in">
      <!-- Wizard Step Header -->
      <div class="step-wizard">
        <div class="step-item completed" id="step-nav-studio">
          <span class="step-number">✓</span>
          <span>1. AI Image Studio</span>
        </div>
        <div class="step-divider"></div>
        <div class="step-item completed" id="step-nav-voice">
          <span class="step-number">✓</span>
          <span>2. Voice Catalogue</span>
        </div>
        <div class="step-divider"></div>
        <div class="step-item active">
          <span class="step-number">3</span>
          <span>AI Pricing</span>
        </div>
        <div class="step-divider"></div>
        <div class="step-item" id="step-nav-approval">
          <span class="step-number">4</span>
          <span>Publish Listing</span>
        </div>
      </div>

      <div class="pricing-layout">
        <!-- Left Panel: Cost Inputs -->
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <div class="card card-terracotta-glow">
            <div class="card-header">
              <div>
                <div class="card-title" style="display: flex; align-items: center; gap: 6px;">
                  <span>${Icons.calculator(18)}</span>
                  <span>Artisan Cost Breakdown</span>
                </div>
                <div class="card-subtitle">Input your raw materials and handcraft labour hours</div>
              </div>
              <span class="badge badge-artisan">Step 3 of 4</span>
            </div>

            <form id="costs-form">
              <div class="form-group">
                <label class="form-label">
                  <span>Raw Material Cost (₹) *</span>
                  <span style="color: var(--text-muted); font-size: 0.75rem;">Pure Silk / Alloy / Dyes / Clay</span>
                </label>
                <input type="number" class="form-control" id="cost-raw" value="${costs.raw_material_cost}" min="0" step="50">
              </div>

              <div class="form-grid-2">
                <div class="form-group">
                  <label class="form-label">Artisan Labour (Hours) *</label>
                  <input type="number" class="form-control" id="cost-hours" value="${costs.labour_hours}" min="1">
                </div>
                <div class="form-group">
                  <label class="form-label">Fair Hourly Wage (₹/hr) *</label>
                  <input type="number" class="form-control" id="cost-rate" value="${costs.labour_rate_per_hour}" min="50" step="10">
                </div>
              </div>

              <div class="form-grid-3">
                <div class="form-group">
                  <label class="form-label">Packaging (₹)</label>
                  <input type="number" class="form-control" id="cost-packaging" value="${costs.packaging_cost}" min="0">
                </div>
                <div class="form-group">
                  <label class="form-label">Transport / Freight (₹)</label>
                  <input type="number" class="form-control" id="cost-transport" value="${costs.transport_cost}" min="0">
                </div>
                <div class="form-group">
                  <label class="form-label">Other Misc (₹)</label>
                  <input type="number" class="form-control" id="cost-other" value="${costs.other_cost}" min="0">
                </div>
              </div>

              <div style="margin-top: 1rem; padding: 1rem; background: rgba(15,23,42,0.6); border-radius: var(--radius-md); border: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: 600; color: var(--text-secondary);">Total Base Production Cost:</span>
                <span style="font-size: 1.35rem; font-weight: 800; color: var(--text-primary);" id="total-cost-display">
                  ₹${calculateTotalCost().toLocaleString()}
                </span>
              </div>

              <button type="button" class="btn btn-lg btn-primary" id="recalculate-price-btn" style="width: 100%; margin-top: 1.25rem;">
                <span>${Icons.sparkles(18)}</span>
                <span>Calculate AI Fair Price Recommendation</span>
              </button>
            </form>
          </div>
        </div>

        <!-- Right Panel: AI Recommendation & Profit Simulator -->
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <div class="card card-gold-glow">
            <div class="card-header">
              <div>
                <div class="card-title" style="display: flex; align-items: center; gap: 6px;">
                  <span>${Icons.sparkles(18)}</span>
                  <span>AI Recommended Fair Price</span>
                </div>
                <div class="card-subtitle">Market-calibrated recommendation ensuring fair wages</div>
              </div>
              <span class="badge badge-gi">GI Authenticated</span>
            </div>

            <!-- Suggested Price Hero -->
            <div class="price-metric-hero">
              <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600; letter-spacing: 0.5px;">RECOMMENDED MARKET PRICE</div>
              <div class="suggested-price-large" id="hero-suggested-price">₹${pricing.suggested_price.toLocaleString()}</div>
              <div style="display: flex; justify-content: center; gap: 1rem; font-size: 0.85rem; color: #34D399; font-weight: 600;">
                <span id="hero-margin-tag" style="display: inline-flex; align-items: center; gap: 4px;">${Icons.trendingUp(14)} Profit Margin: ${pricing.margin_percent || 32}%</span>
                <span>• Fair Living Wage Protected</span>
              </div>

              <!-- Price Bounds -->
              <div class="price-range-pills">
                <div>
                  <div style="font-size: 0.72rem; color: var(--text-muted);">MINIMUM FLOOR PRICE</div>
                  <div style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary);" id="price-min">₹${pricing.min_price.toLocaleString()}</div>
                </div>
                <div style="border-left: 1px solid var(--border-subtle); padding-left: 1rem;">
                  <div style="font-size: 0.72rem; color: var(--text-muted);">PREMIUM BOUTIQUE TIER</div>
                  <div style="font-size: 1.05rem; font-weight: 700; color: var(--color-gold-light);" id="price-max">₹${pricing.max_price.toLocaleString()}</div>
                </div>
              </div>
            </div>

            <!-- Interactive Final Price Slider -->
            <div class="price-slider-wrapper">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <label class="form-label" style="margin: 0; font-size: 0.9rem; color: var(--text-primary);">
                  Artisan Final Listing Price Override:
                </label>
                <span style="font-size: 1.25rem; font-weight: 800; color: var(--color-gold-light);" id="slider-price-val">
                  ₹${(pricing.final_price || pricing.suggested_price).toLocaleString()}
                </span>
              </div>
              <input type="range" class="price-range-input" id="final-price-slider" 
                     min="${Math.round(pricing.min_price * 0.9)}" 
                     max="${Math.round(pricing.max_price * 1.2)}" 
                     step="100" 
                     value="${pricing.final_price || pricing.suggested_price}">
              <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">
                <span>Floor: ₹${pricing.min_price.toLocaleString()}</span>
                <span>Suggested: ₹${pricing.suggested_price.toLocaleString()}</span>
                <span>Boutique: ₹${pricing.max_price.toLocaleString()}</span>
              </div>
            </div>

            <!-- Key Influencing Factors Breakdown -->
            <div style="margin-top: 1rem;">
              <div style="font-weight: 700; font-size: 0.9rem; color: var(--text-primary); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 6px;">
                <span>${Icons.chartSpline(16)}</span>
                <span>Factors Influencing AI Recommendation:</span>
              </div>
              <div class="factors-list" id="factors-container">
                <div class="factor-item">
                  <div class="factor-impact-badge">Base Cost</div>
                  <div>
                    <div style="font-weight: 600; font-size: 0.85rem; color: var(--text-primary);">Material & Handcraft Labour Hours</div>
                    <div style="font-size: 0.75rem; color: var(--text-secondary);">Direct raw costs plus ${costs.labour_hours} hours of skilled artisan work.</div>
                  </div>
                </div>
                <div class="factor-item">
                  <div class="factor-impact-badge">+15% Premium</div>
                  <div>
                    <div style="font-weight: 600; font-size: 0.85rem; color: var(--text-primary);">Certified GI Tag Authenticity Bonus</div>
                    <div style="font-size: 0.75rem; color: var(--text-secondary);">Geographical Indication certification commands higher consumer trust.</div>
                  </div>
                </div>
                <div class="factor-item">
                  <div class="factor-impact-badge">High Demand</div>
                  <div>
                    <div style="font-weight: 600; font-size: 0.85rem; color: var(--text-primary);">E-Commerce & Export Market Index</div>
                    <div style="font-size: 0.75rem; color: var(--text-secondary);">Calibrated with benchmark prices on luxury artisanal platforms.</div>
                  </div>
                </div>
              </div>
            </div>

            <div style="display: flex; justify-content: flex-end; margin-top: 1.5rem;">
              <button class="btn btn-lg btn-emerald" id="proceed-to-approval-btn">
                <span>Proceed to Product Review & Publish (4/4)</span>
                <span>${Icons.arrowRight(16)}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Dynamic cost calculation & API call
  async function triggerPriceCalculation() {
    const rawVal = parseFloat(container.querySelector('#cost-raw').value) || 0;
    const hoursVal = parseFloat(container.querySelector('#cost-hours').value) || 0;
    const rateVal = parseFloat(container.querySelector('#cost-rate').value) || 0;
    const packVal = parseFloat(container.querySelector('#cost-packaging').value) || 0;
    const transVal = parseFloat(container.querySelector('#cost-transport').value) || 0;
    const otherVal = parseFloat(container.querySelector('#cost-other').value) || 0;

    const costsObj = {
      raw_material_cost: rawVal,
      labour_hours: hoursVal,
      labour_rate_per_hour: rateVal,
      packaging_cost: packVal,
      transport_cost: transVal,
      other_cost: otherVal
    };

    const totalCost = rawVal + (hoursVal * rateVal) + packVal + transVal + otherVal;
    container.querySelector('#total-cost-display').textContent = `₹${totalCost.toLocaleString()}`;

    const artisan = State.currentArtisan;
    const res = await API.calculatePrice(
      costsObj,
      draft.craft_category || (artisan ? artisan.craft_category : 'Handloom'),
      artisan ? artisan.gi_tag_certified : true,
      artisan ? artisan.experience_years : 15
    );

    if (res.success) {
      container.querySelector('#hero-suggested-price').textContent = `₹${res.suggested_price.toLocaleString()}`;
      container.querySelector('#hero-margin-tag').innerHTML = `${Icons.trendingUp(14)} Profit Margin: ${res.margin_percent}%`;
      container.querySelector('#price-min').textContent = `₹${res.min_price.toLocaleString()}`;
      container.querySelector('#price-max').textContent = `₹${res.max_price.toLocaleString()}`;

      const slider = container.querySelector('#final-price-slider');
      slider.min = Math.round(res.min_price * 0.9);
      slider.max = Math.round(res.max_price * 1.2);
      slider.value = res.final_price;
      container.querySelector('#slider-price-val').textContent = `₹${res.final_price.toLocaleString()}`;

      State.updateDraft({
        costs: costsObj,
        pricing: res
      });
    }
  }

  container.querySelector('#recalculate-price-btn').addEventListener('click', triggerPriceCalculation);

  // Slider change
  const slider = container.querySelector('#final-price-slider');
  slider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    container.querySelector('#slider-price-val').textContent = `₹${val.toLocaleString()}`;
    const draftPricing = State.draftProduct.pricing || {};
    draftPricing.final_price = val;
    State.updateDraft({ pricing: draftPricing });
  });

  // Step links & proceed
  container.querySelector('#proceed-to-approval-btn').addEventListener('click', () => {
    State.setScreen('approval');
  });

  container.querySelector('#step-nav-studio').addEventListener('click', () => State.setScreen('studio'));
  container.querySelector('#step-nav-voice').addEventListener('click', () => State.setScreen('voice'));
  container.querySelector('#step-nav-approval').addEventListener('click', () => State.setScreen('approval'));
}
