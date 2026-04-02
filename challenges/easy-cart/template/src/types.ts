// 장바구니 관련 타입 정의

/** 상품 정보 */
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

/** 장바구니 아이템 */
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

/** 쿠폰 정보 */
export interface Coupon {
  code: string;
  rate: number; // 할인율 (퍼센트)
  minOrderAmount: number; // 최소 주문 금액
  description: string;
}

/** 할인 규칙 설정 */
export interface DiscountRules {
  coupons: Record<string, Coupon>;
  eventDiscount: {
    enabled: boolean;
    rate: number; // 이벤트 할인율 (퍼센트)
    name: string;
  };
}

/** 주문 요약 */
export interface OrderSummary {
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
}
