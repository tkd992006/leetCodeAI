// 할인 규칙 및 배송비 상수
// 여러 모듈에서 공통으로 사용하는 설정값

import { DiscountRules } from "../types";

/** 할인 규칙 — 쿠폰 및 이벤트 할인 설정 */
export const DISCOUNT_RULES: DiscountRules = {
  coupons: {
    "SAVE10": {
      code: "SAVE10",
      rate: 10,                // 10% 할인
      minOrderAmount: 5000,
      description: "10% 할인 쿠폰",
    },
    "HALF50": {
      code: "HALF50",
      rate: 50,                // 50% 할인
      minOrderAmount: 10000,
      description: "반값 할인 쿠폰",
    },
    "VIP20": {
      code: "VIP20",
      rate: 20,                // 20% 할인
      minOrderAmount: 30000,
      description: "VIP 전용 20% 할인",
    },
    "MEGA100": {
      code: "MEGA100",
      rate: 100,               // 100% 할인 (직원 전용 — 이벤트 할인과 중복 시 주의)
      minOrderAmount: 1000,
      description: "직원 전용 전액 할인",
    },
  },
  eventDiscount: {
    enabled: true,
    rate: 1,                   // 이벤트 기간 1% 추가 할인
    name: "봄맞이 감사 이벤트",
  },
};

/** 배송비 테이블 — 배송 유형별 금액 */
export const SHIPPING_TABLE: Record<string, number> = {
  "standard": 3000,            // 일반 배송
  "express": 5000,             // 특급 배송
  "mountain": 5000,            // 산간 지역
};

/** 무료 배송 기준 금액 */
export const FREE_SHIPPING_THRESHOLD = 50000;

/** 최대 장바구니 아이템 수 */
export const MAX_CART_ITEMS = 20;

/** 최대 단일 상품 수량 */
export const MAX_ITEM_QUANTITY = 99;
