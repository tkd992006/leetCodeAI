// 장바구니 기능 테스트

import { describe, test, expect } from "vitest";
import { addToCart, updateQuantity, removeFromCart } from "../src/lib/cart/cartActions";
import { removeIfZero, validateCart } from "../src/lib/cart/cartValidator";
import { calculateSubtotal } from "../src/lib/pricing/calculateSubtotal";
import { CartItem } from "../src/types";

// 테스트용 장바구니 데이터
const sampleCart: CartItem[] = [
  { id: "1", name: "맥북 프로", price: 2000000, quantity: 1 },
  { id: "2", name: "아이패드", price: 800000, quantity: 2 },
  { id: "3", name: "에어팟", price: 350000, quantity: 1 },
];

describe("장바구니 액션", () => {
  test("아이템 추가 및 수량 변경", () => {
    const newItem: CartItem = { id: "4", name: "키보드", price: 150000, quantity: 1 };
    const updated = addToCart(sampleCart, newItem);
    expect(updated).toHaveLength(4);

    const changed = updateQuantity(sampleCart, "2", 5);
    expect(changed.find((i) => i.id === "2")?.quantity).toBe(5);
  });

  test("수량을 0으로 변경하면 아이템이 제거되어야 함", () => {
    const updated = updateQuantity(sampleCart, "2", 0);
    expect(updated).toHaveLength(2);
    expect(updated.find((item) => item.id === "2")).toBeUndefined();
  });

  test("removeIfZero가 수량 0인 아이템 제거", () => {
    const cartWithZero: CartItem[] = [
      { id: "1", name: "맥북", price: 2000000, quantity: 1 },
      { id: "2", name: "아이패드", price: 800000, quantity: 0 },
    ];
    const cleaned = removeIfZero(cartWithZero);
    expect(cleaned).toHaveLength(1);
  });
});

describe("장바구니 소계 계산", () => {
  test("장바구니 소계 계산", () => {
    // 기존 API 호환 테스트: cart 객체에서 소계 계산
    const mockCart = {
      items: [{ id: "1", name: "맥북", price: 2000000, quantity: 1 }],
    };
    const result = calculateSubtotal(mockCart as any);
    expect(result).toBe(2000000);
  });

  test("여러 아이템 소계 계산", () => {
    const result = calculateSubtotal(sampleCart);
    // 2000000*1 + 800000*2 + 350000*1 = 3,950,000
    expect(result).toBe(3950000);
  });
});
