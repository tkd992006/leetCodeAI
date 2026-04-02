// 배송비 계산 테스트

import { describe, test, expect } from "vitest";
import { getShippingFee } from "../src/lib/pricing/getShippingFee";
import { getShippingType, isValidRegion } from "../src/utils/regionMapper";

describe("getShippingFee - 배송비 계산", () => {
  test("일반 지역 배송비", () => {
    expect(getShippingFee("SEL")).toBe(3000);
    expect(getShippingFee("MNT")).toBe(5000);
  });

  test("도서산간 지역 배송비는 유효한 숫자여야 함", () => {
    const fee = getShippingFee("ISL");
    expect(fee).not.toBeNaN();
    expect(fee).toBeGreaterThanOrEqual(5000);
  });

  test("무료 배송 기준 금액 이상이면 배송비 0원", () => {
    expect(getShippingFee("SEL", 60000)).toBe(0);
    expect(getShippingFee("SEL", 30000)).toBe(3000);
  });
});

describe("getShippingType - 지역 매핑", () => {
  test("지역 코드를 배송 유형으로 매핑", () => {
    expect(getShippingType("SEL")).toBe("standard");
    expect(getShippingType("MNT")).toBe("mountain");
    expect(getShippingType("ISL")).toBe("island");
    expect(getShippingType("UNKNOWN")).toBe("standard");
    expect(isValidRegion("SEL")).toBe(true);
    expect(isValidRegion("INVALID")).toBe(false);
  });
});
