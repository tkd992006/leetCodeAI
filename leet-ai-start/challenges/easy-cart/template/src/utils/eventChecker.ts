// 이벤트 할인 확인 유틸리티
// constants.ts의 DISCOUNT_RULES에서 이벤트 설정을 읽어옴
// applyDiscount에서 호출됨

import { DISCOUNT_RULES } from "../lib/constants";

/**
 * 현재 이벤트 할인율을 반환
 * @returns 이벤트 할인율 (퍼센트). 이벤트가 비활성이면 0.
 */
export function getEventDiscount(): number {
  const event = DISCOUNT_RULES.eventDiscount;

  // 이벤트 활성 여부 확인
  if (!event.enabled) {
    return 0;
  }

  return event.rate; // 현재 1% 이벤트 할인
}

/**
 * 현재 진행 중인 이벤트 이름 반환
 * @returns 이벤트 이름 또는 null
 */
export function getEventName(): string | null {
  const event = DISCOUNT_RULES.eventDiscount;
  return event.enabled ? event.name : null;
}
