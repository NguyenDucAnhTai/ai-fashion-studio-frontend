import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { apiRequest, getApiErrorMessage, httpClient } from "../../shared/api/httpClient";
import type { ApiResponse } from "../../shared/api/apiResponse";
import type {
  BankInfo,
  CreatePaymentRequest,
  InvoicePdfDownload,
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

function readOptionalNumber(value: unknown) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : undefined;
}

function readFilenameFromContentDisposition(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  const utf8Match = /filename\*=UTF-8''([^;]+)/i.exec(value);

  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1].replace(/["]/g, ""));
  }

  const filenameMatch = /filename="?([^";]+)"?/i.exec(value);
  return filenameMatch?.[1]?.trim() ?? "";
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

  const orderCode = value.orderCode == null ? "" : String(value.orderCode);
  const paymentId =
    readString(value.paymentId) ||
    readString(value.id) ||
    readString(value.providerPaymentId) ||
    orderCode;
  const provider =
    normalizeProvider(value.provider) ?? normalizeProvider(value.paymentMethod);

  if (!paymentId && !readString(value.checkoutUrl)) {
    return null;
  }

  return {
    paymentId: paymentId || readString(value.checkoutUrl),
    orderId: readString(value.orderId),
    orderCode: orderCode || undefined,
    customerId: readString(value.customerId) || undefined,
    provider,
    paymentMethod: provider,
    amount: readNumber(value.amount),
    paymentStatus: readString(value.paymentStatus) || readString(value.status, "PENDING"),
    providerPaymentId: readNullableString(value.providerPaymentId),
    transactionCode: readNullableString(value.transactionCode),
    checkoutUrl: readNullableString(value.checkoutUrl),
    qrCodeUrl: readNullableString(value.qrCodeUrl),
    paymentContent: readNullableString(value.paymentContent) ?? readNullableString(value.qrCode),
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

  const invoiceId = readString(value.invoiceId) || readString(value.id);

  if (!invoiceId) {
    return null;
  }

  return {
    invoiceId,
    invoiceNumber: readString(value.invoiceNumber) || readString(value.invoiceCode) || invoiceId,
    orderId: readString(value.orderId) || undefined,
    totalAmount: readOptionalNumber(value.totalAmount),
    issuedAt: readString(value.issuedAt) || readString(value.createdAt) || undefined,
    invoicePdfUrl: readNullableString(value.invoicePdfUrl) ?? readNullableString(value.pdfUrl),
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

  const data = isRecord(response.data)
    ? { ...response.data, orderId: response.data.orderId ?? payload.orderId }
    : response.data;

  return mapApiResponse(response, normalizePaymentInfo(data));
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

export async function getPayment(paymentId: string) {
  const safePaymentId = paymentId.trim();

  if (!safePaymentId) {
    throw new Error("Payment id is required");
  }

  const response = await apiRequest<unknown>({
    url: `/payments/${safePaymentId}`,
    method: "GET",
  });

  return mapApiResponse(response, normalizePaymentInfo(response.data));
}

export function cancelPayment(orderCode: string) {
  const safeOrderCode = orderCode.trim();

  if (!safeOrderCode) {
    throw new Error("Order code is required");
  }

  return apiRequest<PaymentInfo>({
    url: `/payments/${safeOrderCode}/cancel`,
    method: "POST",
  });
}

export async function getInvoice(invoiceId: string) {
  const safeInvoiceId = invoiceId.trim();

  if (!safeInvoiceId) {
    throw new Error("Invoice id is required");
  }

  const response = await apiRequest<unknown>({
    url: `/invoices/${safeInvoiceId}`,
    method: "GET",
  });

  return mapApiResponse(response, normalizeInvoice(response.data));
}

export async function getInvoiceByOrder(orderId: string) {
  const safeOrderId = orderId.trim();

  if (!safeOrderId) {
    throw new Error("Order id is required");
  }

  const response = await apiRequest<unknown>({
    url: `/invoices/order/${safeOrderId}`,
    method: "GET",
  });

  return mapApiResponse(response, normalizeInvoice(response.data));
}

export async function downloadInvoicePdf(invoiceId: string): Promise<InvoicePdfDownload> {
  const safeInvoiceId = invoiceId.trim();

  if (!safeInvoiceId) {
    throw new Error("Invoice id is required");
  }

  const response = await httpClient.get<Blob>(`/invoices/${safeInvoiceId}/pdf`, {
    responseType: "blob",
  });
  const contentDisposition = response.headers["content-disposition"];
  const filename =
    readFilenameFromContentDisposition(contentDisposition) || `invoice-${safeInvoiceId}.pdf`;

  return {
    blob: response.data,
    filename,
  };
}

export function useCreatePaymentMutation() {
  return useMutation({ mutationFn: createPayment });
}

export function useCancelPaymentMutation() {
  return useMutation({ mutationFn: cancelPayment });
}

export function usePaymentQuery(
  paymentId: string,
  enabled: boolean,
  pollPending = false,
) {
  return useQuery<ApiResponse<PaymentInfo>>({
    queryKey: ["payments", paymentId],
    queryFn: () => getPayment(paymentId),
    enabled: Boolean(paymentId) && enabled,
    retry: false,
    refetchInterval: (query) => {
      const status = query.state.data?.data?.paymentStatus;
      return pollPending && status === "PENDING" ? 5000 : false;
    },
  });
}

export function useInvoiceMutation() {
  return useMutation({ mutationFn: getInvoice });
}

export function useDownloadInvoicePdfMutation() {
  return useMutation({ mutationFn: downloadInvoicePdf });
}

export function useInvoiceQuery(invoiceId: string, enabled: boolean) {
  return useQuery<ApiResponse<InvoiceResponse>>({
    queryKey: ["invoices", invoiceId],
    queryFn: () => getInvoice(invoiceId),
    enabled: Boolean(invoiceId) && enabled,
    retry: false,
  });
}

export function useInvoiceByOrderQuery(orderId: string, enabled: boolean) {
  return useQuery<ApiResponse<InvoiceResponse>>({
    queryKey: ["invoices", "order", orderId],
    queryFn: () => getInvoiceByOrder(orderId),
    enabled: Boolean(orderId) && enabled,
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
