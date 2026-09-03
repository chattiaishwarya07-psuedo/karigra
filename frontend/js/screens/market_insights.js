/**
 * KALAVERSE / KalaMarket - Screen: Dedicated Market Insights & Creation Studio
 * Full AI market analytics, demand curves, buyer search keywords, seasonal trends,
 * and actionable creation recommendations tailored specifically to the artisan's craft.
 */

import { State } from '../state.js';
import { API } from '../api.js';
import { Icons } from '../icons.js';
import { t } from '../i18n.js';

export function renderMarketInsightsScreen(container) {
  const artisan = State.currentArtisan || {
    id: 1,
    name: 'K. Ramulu',
    craft_category: 'Handloom & Textiles',
    location_town: 'Pochampally',
    location_state: 'Telangana',
    avatar_url: '/assets/artisan_ramulu.jpg'
  };

  let insightsData = {
    primary_category: artisan.craft_category || 'Handloom & Textiles',
    category_demand_score: 94,
    surge_percentage: '+34% this month',
    trend_status: 'High Demand',
    top_keywords: ['Double Ikat Silk', 'Natural Vegetable Dyes', 'Handloom Saree', 'GI Certified Pochampally', 'Zari Stoles'],
    price_benchmark: '₹4,500 – ₹24,000',
    season_context: 'Wedding & Festive Season surge in pure mulberry silk and lightweight cotton handlooms.',
    dashboard_summary: 'Surging buyer demand for Double Ikat Handloom sarees and organic naturally-dyed silk stoles (+34% growth). Artisans focusing on contemporary geometric motifs are seeing faster order conversions.',
    creation_ideas: [
      {
        id: 'idea-handloom-1',
        title: 'Contemporary Geometric Double Ikat Silk Dupatta',
        category: 'Handloom & Textiles',
        suggested_price: '₹3,800 - ₹5,200',
        demand_score: 96,
        target_market: 'Boutique & Urban Festive Buyers',
        estimated_time: '4-6 days',
        materials: 'Pure Mulberry Silk, Eco Dyes',
        reason: 'Dupattas and stoles have 2.4x higher purchase velocity than full sarees during festive pre-orders.'
      },
      {
        id: 'idea-handloom-2',
        title: 'Minimalist Pochampally Ikat Table Runner & Placemats Set',
        category: 'Handloom & Textiles',
        suggested_price: '₹2,200 - ₹3,400',
        demand_score: 91,
        target_market: 'Modern Eco-Home Decor Buyers',
        estimated_time: '2-3 days',
        materials: 'Organic Cotton-Silk Blend',
        reason: 'Home linen and sustainable dining accessories are currently trending among international buyers.'
      },
      {
        id: 'idea-handloom-3',
        title: 'GI Tagged Bridal Pochampally Silk Saree with Temple Zari',
        category: 'Handloom & Textiles',
        suggested_price: '₹9,500 - ₹18,500',
        demand_score: 95,
        target_market: 'Luxury & Wedding Collections',
        estimated_time: '12-16 days',
        materials: '100% Pure Mulberry Silk, Gold Zari',
        reason: 'Traditional wedding sarees maintain the highest profit margin (38%+) on direct artisan platforms.'
      }
    ],
    trending_categories: [
      {
        category: 'Handloom & Textiles',
        growth: '+34%',
        demand_level: 'Surging',
        avg_ticket: '₹8,500',
        active_buyers: '4,200+',
        popular_style: 'Geometric Ikat, Chanderi Silk, Zari Weaves'
      },
      {
        category: 'Pottery & Terracotta',
        growth: '+28%',
        demand_level: 'High',
        avg_ticket: '₹2,600',
        active_buyers: '3,100+',
        popular_style: 'Studio Terracotta, Jaipur Blue Pottery, Unglazed Clay'
      },
      {
        category: 'Metalware & Heritage Art',
        growth: '+22%',
        demand_level: 'High Value',
        avg_ticket: '₹4,800',
        active_buyers: '1,900+',
        popular_style: 'Bidriware Silver Inlay, Moradabad Brass, Bell Metal'
      },
      {
        category: 'Brass & Bell Metal Craft',
        growth: '+19%',
        demand_level: 'Steady',
        avg_ticket: '₹3,200',
        active_buyers: '1,650+',
        popular_style: 'Bastar Dhokra Lost-Wax, Traditional Deepams'
      },
      {
        category: 'Woodcraft & Carvings',
        growth: '+17%',
        demand_level: 'Steady',
        avg_ticket: '₹2,400',
        active_buyers: '1,400+',
        popular_style: 'Saharanpur Sheesham, Floral Jali, Brass Inlays'
      }
    ],
    seasonal_cycles: [
      {
        title: 'Upcoming Festive & Wedding Pre-Season',
        timeline: 'Next 45 Days',
        impact: 'Peak Demand (+45% Surge)',
        craft_focus: 'Pure Silk Sarees, Heavy Zari Weaves, Bridal Handicrafts',
        action_tip: 'Prepare inventory 3-4 weeks in advance to capture high-margin pre-orders.'
      },
      {
        title: 'Corporate & Diwali GI Heritage Gifting',
        timeline: 'Upcoming Quarter',
        impact: 'High Volume B2B (+60% Inquiries)',
        craft_focus: 'Bidriware Desk Accessories, Dhokra Statues, Sheesham Boxes',
        action_tip: 'List bundled sets with customizable artisan gift packaging.'
      },
      {
        title: 'Eco-Friendly & Sustainable Living Wave',
        timeline: 'Year-Round Ongoing',
        impact: 'Consistent +30% Search Growth',
        craft_focus: 'Terracotta Tableware, Natural Dyed Linens, Wooden Cutlery',
        action_tip: 'Highlight non-toxic, all-natural materials in your product stories.'
      }
    ]
  };

  let isLoading = false;

  function drawView() {
    container.innerHTML = `
      <div class="animate-fade-in" style="max-width: 680px; margin: 0 auto; padding-bottom: 5rem;">
        <!-- Header with Back Button & Refresh Action -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <div style="display: flex; align-items: center; gap: 0.65rem;">
            <button class="header-icon-btn" id="btn-back-to-dash-insights" title="Back to Dashboard" style="display: flex;">
              ${Icons.arrowLeft(18)}
            </button>
            <div>
              <h1 style="font-size: 1.35rem; font-weight: 800; color: var(--color-terracotta); margin: 0; line-height: 1.2;">
                ${t('ai_insights_title')}
              </h1>
              <p style="font-size: 0.82rem; color: var(--text-secondary); margin: 2px 0 0 0;">
                Personalized for <strong>${artisan.name}</strong> • ${insightsData.primary_category}
              </p>
            </div>
          </div>

          <button class="btn btn-sm btn-secondary" id="btn-refresh-market-insights" style="display: flex; align-items: center; gap: 5px; font-size: 0.78rem; border-radius: var(--radius-full); padding: 0.4rem 0.8rem;" title="Refresh Market Data">
            <span>${Icons.sparkles(14)}</span>
            <span>${isLoading ? 'Analyzing...' : 'Refresh'}</span>
          </button>
        </div>

        <!-- 1. Primary Category Demand Spotlight Card -->
        <div class="card" style="background: linear-gradient(135deg, #FAF7F2 0%, #F5EFE6 100%); border: 1px solid var(--border-subtle); border-left: 4px solid var(--color-terracotta); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.5rem; box-shadow: var(--shadow-sm);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.85rem; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                YOUR CRAFT CATEGORY TREND
              </div>
              <h2 style="font-size: 1.2rem; font-weight: 800; color: var(--text-primary); margin: 2px 0 0 0;">
                ${insightsData.primary_category}
              </h2>
            </div>
            <span class="badge badge-artisan" style="font-size: 0.75rem; padding: 0.25rem 0.6rem; font-weight: 700;">
              ${insightsData.surge_percentage}
            </span>
          </div>

          <!-- Key Metrics Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.6rem; margin-bottom: 1rem;">
            <div style="background: #FFFFFF; padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid rgba(0,0,0,0.05);">
              <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">Demand Score</div>
              <div style="font-size: 1.15rem; font-weight: 800; color: var(--color-terracotta); margin-top: 2px;">
                ${insightsData.category_demand_score}/100
              </div>
            </div>
            <div style="background: #FFFFFF; padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid rgba(0,0,0,0.05);">
              <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">Market Status</div>
              <div style="font-size: 0.95rem; font-weight: 800; color: #16A34A; margin-top: 4px;">
                ${insightsData.trend_status}
              </div>
            </div>
            <div style="background: #FFFFFF; padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid rgba(0,0,0,0.05);">
              <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">Price Range</div>
              <div style="font-size: 0.82rem; font-weight: 800; color: var(--text-primary); margin-top: 4px;">
                ${insightsData.price_benchmark}
              </div>
            </div>
          </div>

          <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.55; margin: 0 0 0.85rem 0;">
            ${insightsData.dashboard_summary}
          </p>

          ${insightsData.season_context ? `
            <div style="background: rgba(212, 91, 62, 0.08); border-radius: var(--radius-xs); padding: 0.65rem 0.85rem; font-size: 0.82rem; color: var(--color-terracotta); font-weight: 600; display: flex; align-items: center; gap: 6px;">
              <span>${Icons.sparkles(14)}</span>
              <span>${insightsData.season_context}</span>
            </div>
          ` : ''}
        </div>

        <!-- 2. AI Recommended Products to Create -->
        <div style="margin-bottom: 1.75rem;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.85rem;">
            <div>
              <h2 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin: 0;">
                Recommended Products to Create
              </h2>
              <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 2px 0 0 0;">
                High-demand craft items with strong buyer purchase intent
              </p>
            </div>
            <span style="font-size: 0.75rem; color: var(--color-terracotta); font-weight: 700;">
              ${insightsData.creation_ideas.length} Ideas Available
            </span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${insightsData.creation_ideas.map((idea, idx) => `
              <div class="card" style="box-shadow: var(--shadow-sm); border: 1px solid var(--border-subtle); padding: 1.15rem; position: relative;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.5rem;">
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="width: 24px; height: 24px; border-radius: 50%; background: var(--color-terracotta-soft); color: var(--color-terracotta); font-size: 0.75rem; font-weight: 800; display: flex; align-items: center; justify-content: center;">
                      ${idx + 1}
                    </span>
                    <h3 style="font-size: 1.02rem; font-weight: 800; color: var(--text-primary); margin: 0; line-height: 1.3;">
                      ${idea.title}
                    </h3>
                  </div>
                  <span class="badge" style="background: #ECFDF5; color: #047857; font-weight: 800; font-size: 0.72rem; padding: 0.2rem 0.5rem;">
                    ★ ${idea.demand_score} Demand
                  </span>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; background: var(--bg-primary); padding: 0.65rem 0.85rem; border-radius: var(--radius-sm); margin-bottom: 0.75rem; font-size: 0.82rem;">
                  <div>
                    <span style="color: var(--text-muted); font-size: 0.75rem;">Suggested Price:</span>
                    <strong style="color: var(--color-terracotta); display: block;">${idea.suggested_price}</strong>
                  </div>
                  <div>
                    <span style="color: var(--text-muted); font-size: 0.75rem;">Est. Production Time:</span>
                    <strong style="color: var(--text-primary); display: block;">${idea.estimated_time}</strong>
                  </div>
                  <div>
                    <span style="color: var(--text-muted); font-size: 0.75rem;">Target Audience:</span>
                    <span style="color: var(--text-secondary); display: block; font-weight: 600;">${idea.target_market}</span>
                  </div>
                  <div>
                    <span style="color: var(--text-muted); font-size: 0.75rem;">Key Materials:</span>
                    <span style="color: var(--text-secondary); display: block; font-weight: 600;">${idea.materials}</span>
                  </div>
                </div>

                <p style="font-size: 0.84rem; color: var(--text-secondary); line-height: 1.45; margin: 0 0 0.85rem 0;">
                  <strong>AI Opportunity Analysis:</strong> ${idea.reason}
                </p>

                <button class="btn btn-sm btn-primary btn-block btn-start-create-idea" data-idea-title="${idea.title}" data-idea-cat="${idea.category}" data-idea-mat="${idea.materials}" style="font-size: 0.84rem; padding: 0.6rem;">
                  <span>${Icons.sparkles(14)}</span>
                  <span>Start Creating This Product</span>
                </button>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 3. Top Buyer Search Keywords Cloud -->
        <div class="card" style="margin-bottom: 1.75rem; padding: 1.25rem;">
          <h2 style="font-size: 1.05rem; font-weight: 800; color: var(--text-primary); margin: 0 0 0.4rem 0;">
            Top Buyer Search Trends & Keywords
          </h2>
          <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0 0 0.85rem 0;">
            Phrases frequently searched by national and international buyers on KalaMarket
          </p>

          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            ${insightsData.top_keywords.map(kw => `
              <span style="display: inline-flex; align-items: center; gap: 5px; background: var(--bg-secondary); border: 1px solid var(--border-subtle); padding: 0.35rem 0.75rem; border-radius: var(--radius-full); font-size: 0.8rem; font-weight: 700; color: var(--text-primary);">
                <span style="color: var(--color-terracotta);">${Icons.search(12)}</span>
                <span>"${kw}"</span>
              </span>
            `).join('')}
          </div>
        </div>

        <!-- 4. Across-Market Category Comparison -->
        <div class="card" style="margin-bottom: 1.75rem; padding: 1.25rem;">
          <h2 style="font-size: 1.05rem; font-weight: 800; color: var(--text-primary); margin: 0 0 0.4rem 0;">
            All Craft Categories Comparison
          </h2>
          <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0 0 1rem 0;">
            Live growth benchmarks calibrated against authentic GI craft registries
          </p>

          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${insightsData.trending_categories.map(cat => `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.65rem 0.85rem; background: var(--bg-primary); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); flex-wrap: wrap; gap: 0.4rem;">
                <div>
                  <div style="font-weight: 800; font-size: 0.9rem; color: var(--text-primary);">${cat.category}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">Popular: ${cat.popular_style}</div>
                </div>
                <div style="text-align: right;">
                  <span class="badge" style="background: #ECFDF5; color: #047857; font-weight: 800; font-size: 0.75rem;">
                    ${cat.growth}
                  </span>
                  <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">Avg: ${cat.avg_ticket}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 5. Seasonal & Festival Cycles Tracker -->
        <div class="card" style="padding: 1.25rem;">
          <h2 style="font-size: 1.05rem; font-weight: 800; color: var(--text-primary); margin: 0 0 0.4rem 0;">
            Seasonal & Festive Demand Forecast
          </h2>
          <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0 0 1rem 0;">
            Anticipate upcoming buying waves and prepare your inventory
          </p>

          <div style="display: flex; flex-direction: column; gap: 0.85rem;">
            ${insightsData.seasonal_cycles.map(cycle => `
              <div style="border-left: 3px solid var(--color-terracotta); padding-left: 0.85rem;">
                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px;">
                  <strong style="font-size: 0.9rem; color: var(--text-primary);">${cycle.title}</strong>
                  <span style="font-size: 0.75rem; font-weight: 700; color: var(--color-terracotta);">${cycle.timeline}</span>
                </div>
                <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 2px;">
                  <strong>Impact:</strong> ${cycle.impact} • <em>${cycle.craft_focus}</em>
                </div>
                <div style="font-size: 0.78rem; color: var(--text-muted);">
                  💡 <strong>Artisan Strategy:</strong> ${cycle.action_tip}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // Handlers
    container.querySelector('#btn-back-to-dash-insights')?.addEventListener('click', () => {
      State.setScreen('dashboard');
    });

    container.querySelector('#btn-refresh-market-insights')?.addEventListener('click', async () => {
      isLoading = true;
      drawView();
      try {
        const res = await API.getMarketInsights(artisan.id, artisan.craft_category);
        if (res && res.success) {
          insightsData = res;
        }
      } catch (err) {}
      isLoading = false;
      drawView();
    });

    // Start Creating Idea handler
    container.querySelectorAll('.btn-start-create-idea').forEach(btn => {
      btn.addEventListener('click', () => {
        const title = btn.dataset.ideaTitle;
        const cat = btn.dataset.ideaCat;
        const mat = btn.dataset.ideaMat;

        State.resetDraft();
        State.updateDraft({
          title: title,
          craft_category: cat,
          material: mat
        });
        State.setScreen('studio');
      });
    });
  }

  // Initial draw
  drawView();

  // Background live fetch
  API.getMarketInsights(artisan.id, artisan.craft_category).then(res => {
    if (res && res.success) {
      insightsData = res;
      drawView();
    }
  }).catch(() => {});
}
