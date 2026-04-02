// 배송비 계산 모듈
// regionMapper.ts → constants.ts 의존 체인
// 지역 코드를 배송 유형으로 변환 후 배송비 테이블에서 조회

import { SHIPPING_TABLE, FREE_SHIPPING_THRESHOLD } from "../constants";
import { getShippingType } from "../../utils/regionMapper";

/**
 * 지역 코드에 따른 배송비 반환
 * @param regionCode - 지역 코드 (예: "SEL", "ISL")
 * @param orderAmount - 주문 금액 (무료 배송 기준 확인용, 선택)
 * @returns 배송비 (원)
 */
export function getShippingFee(regionCode: string, orderAmount?: number): number {
  // 무료 배송 기준 금액 이상이면 배송비 무료
  if (orderAmount && orderAmount >= FREE_SHIPPING_THRESHOLD) {
    return 0;
  }

  // 지역 코드 → 배송 유형 변환 (regionMapper 사용)
  const type = getShippingType(regionCode);

  // 배송비 테이블에서 조회
  return SHIPPING_TABLE[type];
}
