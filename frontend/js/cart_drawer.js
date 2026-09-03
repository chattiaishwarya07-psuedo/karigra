/**
 * KALAVERSE / KalaMarket - Shopping Cart Slideout Drawer Component
 * Handles Cart items, quantity increment/decrement, item removal, live total in ₹, and checkout
 */

import { State } from './state.js';
import { Icons } from './icons.js';
import { t } from './i18n.js';

export const CartDrawer = {
  isOpen: false,

  init() {
    let container = document.getElementById('cart-modal-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'cart-modal-container';
      document.body.appendChild(container);
    }

    // Subscribe to cart changes to update badge and drawer if open
    State.subscribe((event) => {
      if (event === 'cart_updated') {
        this.updateBadge();
        if (this.isOpen) {
          this.render();
        }
      }
    });

    this.updateBadge();
  },

  updateBadge() {
    const count = State.getCartCount();
    const badges = document.querySelectorAll('.cart-count-badge');
    badges.forEach(badge => {
      if (count > 0) {
        badge.textContent = count > 99 ? '99+' : count;
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
    });
  },

  open() {
    this.isOpen = true;
    this.render();
    const backdrop = document.getElementById('cart-backdrop');
    if (backdrop) {
      setTimeout(() => backdrop.classList.add('open'), 10);
    }
  },

  close() {
    const backdrop = document.getElementById('cart-backdrop');
    if (backdrop) {
      backdrop.classList.remove('open');
      setTimeout(() => {
        this.isOpen = false;
        const container = document.getElementById('cart-modal-container');
        if (container) container.innerHTML = '';
      }, 300);
    } else {
      this.isOpen = false;
    }
  },

  render() {
    const container = document.getElementById('cart-modal-container');
    if (!container) return;

    const cartItems = State.loadCart();
    const count = State.getCartCount();
    const total = State.getCartTotal();

    container.innerHTML = `
      <div class="cart-modal-backdrop ${this.isOpen ? 'open' : ''}" id="cart-backdrop">
        <div class="cart-drawer" id="cart-drawer-panel">
          <!-- Cart Header -->
          <div class="cart-header">
            <div class="cart-title">
              <span>${Icons.shoppingBag(22)}</span>
              <span>Your Cart (${count})</span>
            </div>
            <button class="header-icon-btn" id="btn-close-cart" title="Close Cart" style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
              ${Icons.x(18)}
            </button>
          </div>

          <!-- Cart Body -->
          <div class="cart-body">
            ${cartItems.length === 0 ? `
              <div style="text-align: center; padding: 4rem 1.5rem; color: var(--text-muted);">
                <div style="display: flex; justify-content: center; margin-bottom: 1rem; color: var(--color-terracotta); opacity: 0.65;">
                  ${Icons.shoppingBag(48)}
                </div>
                <h3 style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.5rem;">Your Cart is Empty</h3>
                <p style="font-size: 0.85rem; line-height: 1.5; margin-bottom: 1.5rem;">Discover authentic handcrafted textiles, pottery, bidriware and woodcraft directly from master artisans.</p>
                <button class="btn btn-primary" id="btn-cart-explore-market">
                  <span>Explore Marketplace</span>
                </button>
              </div>
            ` : `
              <div style="display: flex; flex-direction: column; gap: 0.85rem;">
                ${cartItems.map(item => `
                  <div class="cart-item-card" key="cart-${item.id}">
                    <img src="${item.image_url}" alt="${item.title}" class="cart-item-img">
                    
                    <div class="cart-item-info">
                      <div class="cart-item-title" title="${item.title}">${item.title}</div>
                      <div class="cart-item-artisan">by ${item.artisan_name}</div>
                      <div class="cart-item-price">₹ ${(item.price * item.quantity).toLocaleString('en-IN')}</div>
                    </div>

                    <!-- Quantity Controls -->
                    <div class="cart-qty-ctrls">
                      <button class="cart-qty-btn btn-qty-minus" data-id="${item.id}" title="Decrease quantity">−</button>
                      <span class="cart-qty-num">${item.quantity}</span>
                      <button class="cart-qty-btn btn-qty-plus" data-id="${item.id}" title="Increase quantity">+</button>
                    </div>

                    <!-- Remove Item Button -->
                    <button class="cart-btn-remove btn-item-remove" data-id="${item.id}" title="Remove item">
                      ${Icons.trash(16)}
                    </button>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

          <!-- Cart Footer -->
          ${cartItems.length > 0 ? `
            <div class="cart-footer">
              <div class="cart-total-row">
                <span style="font-size: 0.95rem; color: var(--text-secondary);">Subtotal (${count} items):</span>
                <span style="color: var(--color-terracotta);">₹ ${total.toLocaleString('en-IN')}</span>
              </div>
              <div style="font-size: 0.75rem; color: #166534; font-weight: 700; display: flex; align-items: center; gap: 4px;">
                ${Icons.check(14)} Free insured shipping from artisan workshops across India
              </div>
              <button class="btn btn-primary btn-block" id="btn-cart-checkout" style="font-size: 1rem; padding: 0.85rem;">
                <span>Proceed to Checkout • ₹ ${total.toLocaleString('en-IN')}</span>
              </button>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    // Handlers
    container.querySelector('#btn-close-cart')?.addEventListener('click', () => this.close());
    
    container.querySelector('#cart-backdrop')?.addEventListener('click', (e) => {
      if (e.target.id === 'cart-backdrop') {
        this.close();
      }
    });

    container.querySelector('#btn-cart-explore-market')?.addEventListener('click', () => {
      this.close();
      State.setRoleMode('buyer');
      State.setScreen('buyer_catalogue');
    });

    container.querySelectorAll('.btn-qty-minus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.id);
        State.updateCartQuantity(id, -1);
      });
    });

    container.querySelectorAll('.btn-qty-plus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.id);
        State.updateCartQuantity(id, 1);
      });
    });

    container.querySelectorAll('.btn-item-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.id);
        State.removeFromCart(id);
      });
    });

    container.querySelector('#btn-cart-checkout')?.addEventListener('click', () => {
      const address = prompt(
        `Order Checkout (${count} items • Total: ₹${total.toLocaleString('en-IN')}):\n\nPlease enter your delivery address:`,
        "Plot 42, Jubilee Hills, Hyderabad, Telangana 500033"
      );
      if (address) {
        alert(`🎉 Thank you! Your order for ${count} handcrafted item(s) (₹${total.toLocaleString('en-IN')}) has been confirmed. Artisans are preparing your authentic pieces.`);
        State.clearCart();
        this.close();
      }
    });
  }
};
