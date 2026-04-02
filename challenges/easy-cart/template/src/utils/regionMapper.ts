// 지역 코드를 배송 유형으로 매핑
// getShippingFee에서 사용됨 → constants.ts의 SHIPPING_TABLE과 연동

/** 지역 코드 → 배송 유형 매핑 */
const REGION_MAP: Record<string, string> = {
  "SEL": "standard",    // 서울
  "GYG": "standard",    // 경기
  "ICN": "standard",    // 인천
  "BSN": "standard",    // 부산
  "DGU": "standard",    // 대구
  "GWJ": "standard",    // 광주
  "DJN": "standard",    // 대전
  "MNT": "mountain",    // 산간 지역
  "ISL": "island",      // 도서산간
};

/**
 * 지역 코드를 배송 유형 문자열로 변환
 * @param regionCode - 지역 코드 (예: "SEL", "ISL")
 * @returns 배송 유형 (예: "standard", "mountain", "island")
 */
export function getShippingType(regionCode: string): string {
  // 지역 코드가 매핑에 없으면 기본값 "standard" 반환
  return REGION_MAP[regionCode] || "standard";
}

/**
 * 유효한 지역 코드인지 확인
 * @param regionCode - 확인할 지역 코드
 */
export function isValidRegion(regionCode: string): boolean {
  return regionCode in REGION_MAP;
}
