// 장바구니 유효성 검증 모듈
// 장바구니 상태를 검증하고 정리하는 유틸리티 함수들

import { CartItem } from "../../types";
import { MAX_CART_ITEMS, MAX_ITEM_QUANTITY } from "../constants";

/**
 * 수량이 0인 아이템을 장바구니에서 제거
 *
 * @param cart - 장바구니 아이템 배열
 * @returns 수량이 0보다 큰 아이템만 포함된 배열
 */
export function removeIfZero(cart: CartItem[]): CartItem[] {
  return cart.filter((item) => item.quantity > 0);
}

/**
 * 장바구니 유효성 검증
 * @param cart - 검증할 장바구니
 * @returns 유효하면 true
 */
export function validateCart(cart: CartItem[]): boolean {
  // 빈 배열은 유효
  if (cart.length === 0) return true;

  // 최대 아이템 수 초과 확인
  if (cart.length > MAX_CART_ITEMS) return false;

  // 각 아이템 유효성 검증
  return cart.every((item) => {
    if (!item.id || !item.name) return false;
    if (item.price < 0) return false;
    if (item.quantity < 0 || item.quantity > MAX_ITEM_QUANTITY) return false;
    return true;
  });
}

/**
 * 중복 아이템 병합
 * @param cart - 장바구니
 * @returns 중복이 병합된 장바구니
 */
export function mergeDuplicates(cart: CartItem[]): CartItem[] {
  const merged = new Map<string, CartItem>();

  for (const item of cart) {
    if (merged.has(item.id)) {
      const existing = merged.get(item.id)!;
      merged.set(item.id, {
        ...existing,
        quantity: Math.min(existing.quantity + item.quantity, MAX_ITEM_QUANTITY),
      });
    } else {
      merged.set(item.id, { ...item });
    }
  }

  return Array.from(merged.values());
}
