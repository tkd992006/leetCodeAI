// 장바구니 소계 계산
// CartItem 배열을 받아서 총 금액(소계)을 계산

import { CartItem } from "../../types";

/**
 * 장바구니 아이템들의 소계를 계산
 * @param items - 장바구니 아이템 배열 (CartItem[])
 * @returns 소계 금액 (원)
 */
export function calculateSubtotal(items: CartItem[]): number {
  // items가 배열이 아닌 경우 방어 처리
  if (!Array.isArray(items)) {
    return 0;
  }

  return items.reduce((total, item) => {
    // 가격과 수량이 유효한 숫자인지 확인
    const price = typeof item.price === "number" ? item.price : 0;
    const quantity = typeof item.quantity === "number" ? item.quantity : 0;
    return total + price * quantity;
  }, 0);
}
