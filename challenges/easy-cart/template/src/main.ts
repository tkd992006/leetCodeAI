import products from "./data/products.json";
import { calculateSubtotal } from "./lib/pricing/calculateSubtotal";
import { applyDiscount } from "./lib/pricing/applyDiscount";
import { getShippingFee } from "./lib/pricing/getShippingFee";
import { formatPrice } from "./lib/pricing/formatPrice";
import {
  addToCart,
  updateQuantity,
  removeFromCart,
} from "./lib/cart/cartActions";
import type { CartItem } from "./types";

let cart: CartItem[] = [];
let couponCode = "";
let region = "SEL";

function render() {
  const app = document.getElementById("app")!;

  const subtotal = calculateSubtotal(cart);
  const afterDiscount = applyDiscount(subtotal, couponCode || undefined);
  const shipping = getShippingFee(region, afterDiscount);
  const total = afterDiscount + shipping;

  app.innerHTML = `
    <h2>상품 목록</h2>
    <div>
      ${products
        .map(
          (p) => `
        <div class="row">
          <span>${p.name} — ${formatPrice(p.price)}${!p.inStock ? ' <span class="error">(품절)</span>' : ""}</span>
          <button onclick="window.__cart.addProduct('${p.id}')"${!p.inStock ? " disabled" : ""}>담기</button>
        </div>
      `
        )
        .join("")}
    </div>

    <h2>장바구니 (${cart.length}개)</h2>
    <div>
      ${
        cart.length === 0
          ? '<p class="empty">비어있음</p>'
          : cart
              .map(
                (item) => `
        <div class="row">
          <span>${item.name} × ${item.quantity}</span>
          <div>
            <button onclick="window.__cart.changeQty('${item.id}', ${item.quantity - 1})">−</button>
            <button onclick="window.__cart.changeQty('${item.id}', ${item.quantity + 1})">+</button>
            <button onclick="window.__cart.removeItem('${item.id}')">삭제</button>
          </div>
        </div>
      `
              )
              .join("")
      }
    </div>

    <h2>쿠폰</h2>
    <div>
      <input id="coupon-input" value="${couponCode}" placeholder="쿠폰 코드 입력" style="width:200px">
      <button onclick="window.__cart.applyCoupon()">적용</button>
      <p class="hint">테스트 쿠폰: SAVE10 (10%), HALF50 (50%), VIP20 (20%), MEGA100 (100%)</p>
    </div>

    <h2>배송</h2>
    <div>
      <select id="region-select" onchange="window.__cart.changeRegion(this.value)">
        <option value="SEL" ${region === "SEL" ? "selected" : ""}>서울 (일반)</option>
        <option value="GYG" ${region === "GYG" ? "selected" : ""}>경기 (일반)</option>
        <option value="MNT" ${region === "MNT" ? "selected" : ""}>산간 지역</option>
        <option value="ISL" ${region === "ISL" ? "selected" : ""}>도서산간</option>
      </select>
    </div>

    <h2>결제</h2>
    <div>
      <div class="summary-row"><span>소계</span><span>${formatPrice(subtotal)}</span></div>
      <div class="summary-row"><span>할인 후</span><span class="${afterDiscount < subtotal ? "success" : ""}">${formatPrice(afterDiscount)}</span></div>
      <div class="summary-row"><span>배송비</span><span class="${isNaN(shipping) ? "error" : ""}">${isNaN(shipping) ? "NaN ⚠️" : formatPrice(shipping)}</span></div>
      <div class="summary-row summary-total">
        <span>합계</span>
        <span class="${total < 0 || isNaN(total) ? "error" : "success"}">${isNaN(total) ? "ERROR" : formatPrice(total)}</span>
      </div>
    </div>
  `;
}

// Global functions for onclick handlers
(window as any).__cart = {
  addProduct(id: string) {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    const existing = cart.find((item) => item.id === id);
    if (existing) {
      cart = updateQuantity(cart, id, existing.quantity + 1);
    } else {
      cart = addToCart(cart, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      });
    }
    render();
  },

  changeQty(id: string, qty: number) {
    cart = updateQuantity(cart, id, qty);
    render();
  },

  removeItem(id: string) {
    cart = removeFromCart(cart, id);
    render();
  },

  applyCoupon() {
    couponCode = (
      document.getElementById("coupon-input") as HTMLInputElement
    ).value;
    render();
  },

  changeRegion(value: string) {
    region = value;
    render();
  },
};

render();
