// 할인 적용 테스트

import { describe, test, expect } from "vitest";
import { applyDiscount } from "../src/lib/pricing/applyDiscount";

describe("applyDiscount - 할인 적용", () => {
  test("쿠폰 없이 이벤트 할인만 적용", () => {
    // 소계 10000원, 이벤트 할인 1% → 10000 - 100 = 9900
    const result = applyDiscount(10000);
    expect(result).toBe(9900);
  });

  test("10% 쿠폰 적용 시 정확한 할인 계산", () => {
    // 소계 10000원, SAVE10 쿠폰 10% 할인
    // 10000 - 1000 = 9000
    const result = applyDiscount(10000, "SAVE10");
    expect(result).toBe(9000);
  });

  test("과도한 할인이 적용되어도 가격은 0 이상이어야 함", () => {
    // MEGA100 쿠폰 + 이벤트 할인 = 합산 할인 적용
    const result = applyDiscount(10000, "MEGA100");
    expect(result).toBeGreaterThanOrEqual(0);
  });

  test("최소 주문 금액 미달 시 쿠폰 미적용", () => {
    // SAVE10 최소 주문 금액: 5000원, 소계: 3000원
    // 쿠폰 미적용, 이벤트 1%만: 3000 - 30 = 2970
    const result = applyDiscount(3000, "SAVE10");
    expect(result).toBe(2970);
  });
});
