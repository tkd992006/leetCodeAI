// 소계 계산 테스트 (정상 테스트 — 전부 통과해야 함)

import { describe, test, expect } from "vitest";
import { calculateSubtotal } from "../src/lib/pricing/calculateSubtotal";
import { CartItem } from "../src/types";

describe("calculateSubtotal - 소계 계산", () => {
  test("장바구니 아이템들의 소계를 정확히 계산", () => {
    const items: CartItem[] = [
      { id: "1", name: "맥북 프로", price: 2000000, quantity: 1 },
      { id: "2", name: "아이패드", price: 800000, quantity: 2 },
    ];
    // 2000000 + 800000*2 = 3,600,000
    expect(calculateSubtotal(items)).toBe(3600000);
  });

  test("빈 장바구니와 잘못된 입력 처리", () => {
    expect(calculateSubtotal([])).toBe(0);
    expect(calculateSubtotal(null as any)).toBe(0);
    expect(calculateSubtotal(undefined as any)).toBe(0);
  });
});
