// 가격 포맷 테스트 (정상 테스트 — 전부 통과해야 함)

import { describe, test, expect } from "vitest";
import { formatPrice, formatDiscountRate } from "../src/lib/pricing/formatPrice";

describe("formatPrice - 가격 포맷", () => {
  test("금액을 한국 원화 형식으로 포맷", () => {
    expect(formatPrice(1000)).toBe("1,000원");
    expect(formatPrice(2500000)).toBe("2,500,000원");
    expect(formatPrice(0)).toBe("0원");
    expect(formatPrice(-500)).toBe("0원");
    expect(formatPrice(NaN)).toBe("0원");
  });

  test("할인율을 퍼센트 형식으로 포맷", () => {
    expect(formatDiscountRate(10)).toBe("10%");
    expect(formatDiscountRate(50)).toBe("50%");
    expect(formatDiscountRate(-10)).toBe("0%");
  });
});
