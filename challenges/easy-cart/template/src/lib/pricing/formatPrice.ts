// 가격 포맷 유틸리티
// 숫자 금액을 사용자에게 표시할 문자열로 변환

/**
 * 금액을 한국 원화 형식으로 포맷
 * @param price - 금액 (원)
 * @returns 포맷된 문자열 (예: "1,000원", "2,500,000원")
 */
export function formatPrice(price: number): string {
  // NaN이나 무한대 처리
  if (!Number.isFinite(price)) {
    return "0원";
  }

  // 음수 처리
  if (price < 0) {
    return "0원";
  }

  // 천 단위 콤마 추가
  const formatted = Math.round(price).toLocaleString("ko-KR");
  return `${formatted}원`;
}

/**
 * 할인율을 퍼센트 문자열로 포맷
 * @param rate - 할인율 (0~100)
 * @returns 포맷된 문자열 (예: "10%", "50%")
 */
export function formatDiscountRate(rate: number): string {
  if (!Number.isFinite(rate) || rate < 0) {
    return "0%";
  }
  return `${Math.round(rate)}%`;
}
