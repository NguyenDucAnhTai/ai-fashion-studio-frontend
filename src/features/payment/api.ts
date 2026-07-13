import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { apiRequest, getApiErrorMessage } from "../../shared/api/httpClient";
import type { ApiResponse } from "../../shared/api/apiResponse";
import type {
  BankInfo,
  CreatePaymentRequest,
  InvoiceResponse,
  PaymentInfo,
  PaymentProvider,
} from "./types";

const PAYMENT_ERROR_MESSAGES: Record<string, string> = {
  ORDER_NOT_FOUND: "Order not found.",
  ORDER_ACCESS_DENIED: "You do not have access to this order.",
  ORDER_ALREADY_PAID: "This order has already been paid.",
  PAYMENT_ALREADY_EXISTS: "Payment already exists for this order.",
  INVALID_PAYMENT_PROVIDER: "Invalid payment provider.",
  PAYMENT_PROVIDER_UNAVAILABLE: "Payment provider is unavailable.",
  PAYMENT_PROVIDER_ERROR: "Payment provider error.",
  PAYMENT_NOT_FOUND: "Payment not found.",
  PAYMENT_NOT_PAID: "Invoice is available after payment.",
  INVOICE_NOT_FOUND: "Invoice is not generated yet.",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readString(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function readNullableString(value: unknown) {
  const text = readString(value);
  return text || null;
}

function readNumber(value: unknown, fallback = 0) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function mapApiResponse<T>(
  response: ApiResponse<unknown>,
  data: T | null,
): ApiResponse<T> {
  return {
    ...response,
    data,
  };
}

function normalizeProvider(value: unknown): PaymentProvider | undefined {
  const provider = readString(value).toUpperCase();
  return provider === "PAYOS" || provider === "SEPAY"
    ? (provider as PaymentProvider)
    : undefined;
}

function normalizeBankInfo(value: unknown): BankInfo | null {
  if (!isRecord(value)) {
    return null;
  }

  return {
    bankName: readString(value.bankName),
    accountNumber: readString(value.accountNumber),
    accountName: readString(value.accountName),
  };
}

function normalizePaymentInfo(value: unknown): PaymentInfo | null {
  if (!isRecord(value)) {
    return null;
  }

  const paymentId = readString(value.paymentId) || readString(value.id);
  const provider =
    normalizeProvider(value.provider) ?? normalizeProvider(value.paymentMethod);

  if (!paymentId) {
    return null;
  }

  return {
    paymentId,
    orderId: readString(value.orderId),
    customerId: readString(value.customerId) || undefined,
    provider,
    paymentMethod: provider,
    amount: readNumber(value.amount),
    paymentStatus: readString(value.paymentStatus, "PENDING"),
    providerPaymentId: readNullableString(value.providerPaymentId),
    transactionCode: readNullableString(value.transactionCode),
    checkoutUrl: readNullableString(value.checkoutUrl),
    qrCodeUrl: readNullableString(value.qrCodeUrl),
    paymentContent: readNullableString(value.paymentContent),
    bankInfo: normalizeBankInfo(value.bankInfo),
    invoiceNumber: readNullableString(value.invoiceNumber),
    invoicePdfUrl: readNullableString(value.invoicePdfUrl),
    paidAt: readNullableString(value.paidAt),
    expiresAt: readNullableString(value.expiresAt),
  };
}

function normalizeInvoice(value: unknown): InvoiceResponse | null {
  if (!isRecord(value)) {
    return null;
  }

  const invoicePdfUrl = readString(value.invoicePdfUrl);

  if (!invoicePdfUrl) {
    return null;
  }

  return {
    invoiceNumber: readString(value.invoiceNumber),
    invoicePdfUrl,
  };
}

export function getPaymentErrorCode(error: unknown) {
  if (!axios.isAxiosError(error) || !isRecord(error.response?.data)) {
    return "";
  }

  const data = error.response.data;
  const errors = data.errors;

  if (Array.isArray(errors)) {
    const firstError = errors.find((item) => isRecord(item));
    return isRecord(firstError) ? readString(firstError.code) : "";
  }

  if (isRecord(errors)) {
    const firstValue = Object.values(errors)[0];
    if (Array.isArray(firstValue) && typeof firstValue[0] === "string") {
      return firstValue[0];
    }
  }

  return readString(data.code);
}

export function getPaymentErrorMessage(error: unknown) {
  const code = getPaymentErrorCode(error);
  return PAYMENT_ERROR_MESSAGES[code] ?? getApiErrorMessage(error);
}

export async function createPayment(payload: CreatePaymentRequest) {
  const response = await apiRequest<unknown>({
    url: "/payments",
    method: "POST",
    data: payload,
  });

  return mapApiResponse(response, normalizePaymentInfo(response.data));
}

export async function getPaymentByOrder(orderId: string) {
  const safeOrderId = orderId.trim();

  if (!safeOrderId) {
    throw new Error("Order id is required");
  }

  const response = await apiRequest<unknown>({
    url: `/payments/order/${safeOrderId}`,
    method: "GET",
  });

  return mapApiResponse(response, normalizePaymentInfo(response.data));
}

export async function getInvoice(paymentId: string) {
  const safePaymentId = paymentId.trim();

  if (!safePaymentId) {
    throw new Error("Payment id is required");
  }

  const response = await apiRequest<unknown>({
    url: `/payments/${safePaymentId}/invoice`,
    method: "GET",
  });

  return mapApiResponse(response, normalizeInvoice(response.data));
}

export function useCreatePaymentMutation() {
  return useMutation({ mutationFn: createPayment });
}

export function useInvoiceMutation() {
  return useMutation({ mutationFn: getInvoice });
}

export function useInvoiceQuery(paymentId: string, enabled: boolean) {
  return useQuery<ApiResponse<InvoiceResponse>>({
    queryKey: ["payments", paymentId, "invoice"],
    queryFn: () => getInvoice(paymentId),
    enabled: Boolean(paymentId) && enabled,
    retry: false,
  });
}

export function usePaymentByOrderQuery(
  orderId: string,
  enabled: boolean,
  pollPending = false,
) {
  return useQuery<ApiResponse<PaymentInfo>>({
    queryKey: ["payments", "order", orderId],
    queryFn: () => getPaymentByOrder(orderId),
    enabled: Boolean(orderId) && enabled,
    retry: false,
    refetchInterval: (query) => {
      const status = query.state.data?.data?.paymentStatus;
      return pollPending && status === "PENDING" ? 5000 : false;
    },
  });
}
