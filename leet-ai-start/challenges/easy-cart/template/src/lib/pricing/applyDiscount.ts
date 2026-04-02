// 할인 적용 모듈
// 쿠폰 할인 + 이벤트 할인을 합산하여 최종 할인 금액 계산
// eventChecker.ts → constants.ts 의존 체인

import { getEventDiscount } from "../../utils/eventChecker";
import { DISCOUNT_RULES } from "../constants";

/**
 * 소계에 할인을 적용하여 최종 금액 반환
 * @param subtotal - 할인 전 소계
 * @param couponCode - 쿠폰 코드 (선택)
 * @returns 할인 적용된 금액
 */
export function applyDiscount(subtotal: number, couponCode?: string): number {
  let discount = 0;

  // 쿠폰 할인 적용
  if (couponCode) {
    const coupon = DISCOUNT_RULES.coupons[couponCode];
    if (coupon) {
      // 최소 주문 금액 확인
      if (subtotal >= coupon.minOrderAmount) {
        discount += subtotal * (coupon.rate / 100);
      }
    }
  }

  // 이벤트 할인 적용 (eventChecker → constants 경로로 설정 읽음)
  const eventDiscount = getEventDiscount();
  discount += subtotal * (eventDiscount / 100);

  // 최종 금액 계산
  const result = subtotal - discount;
  return Math.round(result); // 비즈니스 요구사항: 원 단위 반올림
}
