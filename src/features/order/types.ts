import type { OrderStatus } from "../../shared/constants/orderStatus";
import type { PaymentStatus } from "../../shared/constants/paymentStatus";

export interface OrderVariantSnapshot {
  size: string;
  color: string;
  material: string;
}

export interface CreateOrderItemRequest {
  productId: string;
  productVariantId: string;
  designId: string;
  quantity: number;
}

export interface CreateOrderRequest {
  items: CreateOrderItemRequest[];
  receiverName: string;
  receiverPhone: string;
  shippingAddress: string;
}

export interface CreateOrderResponse {
  orderId: string;
  orderCode: string;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
}

export interface MyOrderListItem {
  id?: string;
  orderId?: string;
  orderCode: string;
  customerId?: string;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt?: string;
}

export type OrderSummary = MyOrderListItem;

export interface MyOrdersResponse {
  items: MyOrderListItem[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  productVariantId: string;
  designId: string;
  productNameSnapshot: string;
  variantSnapshot: OrderVariantSnapshot;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderStatusHistoryItem {
  fromStatus?: OrderStatus | null;
  toStatus: OrderStatus;
  note?: string | null;
  createdAt?: string;
}

export interface OrderDetail {
  id: string;
  orderCode: string;
  customerId: string;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  receiverName: string;
  receiverPhone: string;
  shippingAddress: string;
  items: OrderItem[];
  statusHistory: OrderStatusHistoryItem[];
}

export interface UpdateOrderStatusRequest {
  toStatus: OrderStatus;
  note?: string;
}

export interface UpdateOrderStatusResponse {
  orderId: string;
  fromStatus: OrderStatus;
  toStatus: OrderStatus;
}
