import type { PaymentStatus } from "../../shared/constants/paymentStatus";

export type PaymentProvider = "PAYOS" | "SEPAY";

export interface BankInfo {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export interface CreatePaymentRequest {
  orderId: string;
  provider: PaymentProvider;
  returnUrl: string;
  cancelUrl: string;
}

export interface PaymentInfo {
  paymentId: string;
  orderId: string;
  customerId?: string;
  provider?: PaymentProvider;
  paymentMethod?: PaymentProvider;
  amount: number;
  paymentStatus: PaymentStatus;
  providerPaymentId?: string | null;
  transactionCode?: string | null;
  checkoutUrl?: string | null;
  qrCodeUrl?: string | null;
  paymentContent?: string | null;
  bankInfo?: BankInfo | null;
  invoiceNumber?: string | null;
  invoicePdfUrl?: string | null;
  paidAt?: string | null;
  expiresAt?: string | null;
}

export type CreatePaymentResponse = PaymentInfo;

export type PaymentByOrderResponse = PaymentInfo;

export interface InvoiceResponse {
  invoiceNumber: string;
  invoicePdfUrl: string;
}
