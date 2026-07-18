import type { OrderStatus } from "../../shared/constants/orderStatus";
import type { PaymentStatus } from "../../shared/constants/paymentStatus";

export interface StaffOrderSummary {
  orderId: string;
  orderCode: string;
  customerId: string;
  totalAmount: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
}

export interface StaffOrderParams {
  status?: OrderStatus;
  keyword?: string;
  page: number;
  pageSize: number;
}

export interface StaffPrintInfoItem {
  orderItemId: string;
  productName: string;
  variant: {
    size: string;
    color: string;
    material: string;
  };
  quantity: number;
  designId: string;
  previewImageUrl?: string | null;
  printFileUrl?: string | null;
}

export interface StaffPrintInfo {
  orderId: string;
  orderCode: string;
  items: StaffPrintInfoItem[];
}
