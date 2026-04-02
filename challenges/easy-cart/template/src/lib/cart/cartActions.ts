// 장바구니 액션 모듈
// 장바구니 아이템 추가, 수량 변경, 삭제 등

import { CartItem } from "../../types";
import { MAX_CART_ITEMS, MAX_ITEM_QUANTITY } from "../constants";

/**
 * 장바구니에 아이템 추가
 * @param cart - 현재 장바구니
 * @param item - 추가할 아이템
 * @returns 업데이트된 장바구니
 */
export function addToCart(cart: CartItem[], item: CartItem): CartItem[] {
  // 이미 장바구니에 있는 아이템인지 확인
  const existingIndex = cart.findIndex((i) => i.id === item.id);

  if (existingIndex >= 0) {
    // 기존 아이템 수량 증가
    return cart.map((i, idx) =>
      idx === existingIndex
        ? { ...i, quantity: Math.min(i.quantity + item.quantity, MAX_ITEM_QUANTITY) }
        : i
    );
  }

  // 장바구니 최대 아이템 수 확인
  if (cart.length >= MAX_CART_ITEMS) {
    return cart; // 추가 불가
  }

  return [...cart, item];
}

/**
 * 장바구니 아이템 수량 변경
 * @param cart - 현재 장바구니
 * @param itemId - 변경할 아이템 ID
 * @param quantity - 새 수량
 * @returns 업데이트된 장바구니
 *
 * 수량이 0이면 아이템이 비활성 처리됨
 */
export function updateQuantity(
  cart: CartItem[],
  itemId: string,
  quantity: number
): CartItem[] {
  // 수량 범위 제한
  const clampedQuantity = Math.max(0, Math.min(quantity, MAX_ITEM_QUANTITY));

  return cart.map((item) =>
    item.id === itemId ? { ...item, quantity: clampedQuantity } : item
  );
}

/**
 * 장바구니에서 아이템 제거
 * @param cart - 현재 장바구니
 * @param itemId - 제거할 아이템 ID
 * @returns 업데이트된 장바구니
 */
export function removeFromCart(cart: CartItem[], itemId: string): CartItem[] {
  return cart.filter((item) => item.id !== itemId);
}
