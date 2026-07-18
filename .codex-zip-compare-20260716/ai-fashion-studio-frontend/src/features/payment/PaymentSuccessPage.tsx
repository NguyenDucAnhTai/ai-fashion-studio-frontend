import { CheckCircle2, Download, RefreshCw, ShoppingBag } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Badge from "../../shared/components/Badge";
import Button from "../../shared/components/Button";
import Container from "../../shared/components/Container";
import ErrorState from "../../shared/components/ErrorState";
import Loading from "../../shared/components/Loading";
import { PAYMENT_STATUS, getPaymentStatusTone } from "../../shared/constants/paymentStatus";
import { formatCurrency } from "../../shared/utils/formatCurrency";
import { useAuthStore } from "../auth/authStore";
import { MISSING_CUSTOMER_MESSAGE, useOrderDetailQuery } from "../order/api";
import {
  getPaymentErrorMessage,
  useDownloadInvoicePdfMutation,
  useInvoiceByOrderQuery,
  usePaymentByOrderQuery,
  usePaymentQuery,
} from "./api";

const PENDING_PAYMENT_CALLBACK_KEY = "pendingPaymentCallback";

function readPendingPaymentCallback() {
  try {
    return JSON.parse(localStorage.getItem(PENDING_PAYMENT_CALLBACK_KEY) ?? "{}") as {
      orderId?: string;
      orderCode?: string;
      paymentId?: string;
    };
  } catch {
    return {};
  }
}

function downloadBlob(blob: Blob, filename: string) {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const pendingCallback = readPendingPaymentCallback();
  const callbackPaymentId =
    searchParams.get("paymentId") ??
    searchParams.get("id") ??
    pendingCallback.paymentId ??
    "";
  const callbackOrderId = searchParams.get("orderId") ?? pendingCallback.orderId ?? "";
  const orderCode = searchParams.get("orderCode") ?? pendingCallback.orderCode ?? "";
  const callbackStatus = searchParams.get("status")?.toUpperCase() ?? "";
  const callbackCancelled = searchParams.get("cancel") === "true";
  const userId = useAuthStore((state) => state.currentUser?.id ?? "");
  const paymentByIdQuery = usePaymentQuery(
    callbackPaymentId,
    Boolean(!callbackOrderId && callbackPaymentId && userId),
    true,
  );
  const paymentById = paymentByIdQuery.data?.data;
  const orderId = callbackOrderId || paymentById?.orderId || "";
  const orderQuery = useOrderDetailQuery(userId ? orderId : "", userId);
  const paymentQuery = usePaymentByOrderQuery(orderId, Boolean(orderId && userId), true);
  const order = orderQuery.data?.data;
  const payment = paymentQuery.data?.data ?? paymentById;
  const paid = payment?.paymentStatus === PAYMENT_STATUS.paid || order?.paymentStatus === PAYMENT_STATUS.paid;
  const invoiceQuery = useInvoiceByOrderQuery(orderId, Boolean(orderId && paid));
  const invoiceDownload = useDownloadInvoicePdfMutation();
  const invoice = invoiceQuery.data?.data;

  const handleDownloadInvoice = () => {
    if (!invoice?.invoiceId) {
      return;
    }

    invoiceDownload.mutate(invoice.invoiceId, {
      onSuccess: (response) => {
        downloadBlob(response.blob, response.filename);
      },
    });
  };

  useEffect(() => {
    if (callbackCancelled || callbackStatus === "CANCELLED") {
      const params = new URLSearchParams();

      if (orderId) {
        params.set("orderId", orderId);
      }

      if (orderCode) {
        params.set("orderCode", orderCode);
      }

      navigate(`/payment/cancel?${params.toString()}`, { replace: true });
    }
  }, [callbackCancelled, callbackStatus, navigate, orderCode, orderId]);

  useEffect(() => {
    if (paid) {
      localStorage.removeItem(PENDING_PAYMENT_CALLBACK_KEY);
    }
  }, [paid]);

  useEffect(() => {
    if (!paymentById?.orderId) {
      return;
    }

    localStorage.setItem(
      PENDING_PAYMENT_CALLBACK_KEY,
      JSON.stringify({
        orderId: paymentById.orderId,
        orderCode: paymentById.orderCode ?? orderCode,
        paymentId: paymentById.paymentId,
      }),
    );
  }, [orderCode, paymentById]);

  if (!userId) {
    return (
      <section className="min-h-screen bg-beige-50 pt-28 pb-20">
        <Container>
          <ErrorState
            title="Cannot load payment status"
            description={MISSING_CUSTOMER_MESSAGE}
          />
        </Container>
      </section>
    );
  }

  if (!orderId && paymentByIdQuery.isLoading) {
    return (
      <section className="min-h-screen bg-beige-50 pt-28 pb-20">
        <Loading label="Restoring payment status..." />
      </section>
    );
  }

  if (!orderId) {
    return (
      <section className="min-h-screen bg-beige-50 pt-28 pb-20">
        <Container>
          <ErrorState
            title="Cannot restore order"
            description="The payment provider returned without order information. Please open My orders to check the latest payment status."
          />
        </Container>
      </section>
    );
  }

  if (orderQuery.isLoading || paymentQuery.isLoading) {
    return (
      <section className="min-h-screen bg-beige-50 pt-28 pb-20">
        <Loading label="Loading payment status..." />
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
      <Container>
        <div className="mx-auto max-w-2xl rounded-3xl border border-primary-100 bg-white p-8 text-center shadow-soft sm:p-10">
          {paid ? (
            <CheckCircle2 className="mx-auto text-success-500" size={58} />
          ) : (
            <RefreshCw className="mx-auto animate-spin text-warning-500" size={58} />
          )}
          <h1 className="mt-5 font-display text-4xl font-semibold text-primary-950">
            {paid ? "Payment success" : "Payment is being confirmed"}
          </h1>
          <p className="mt-3 text-sm leading-7 text-primary-500">
            {paid
              ? "Your payment has been confirmed. You can view the order or download the invoice when it is available."
              : "The provider has returned to the store, but the payment webhook is still being confirmed."}
          </p>

          <div className="mt-8 rounded-2xl bg-beige-50 p-5 text-left">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-primary-500">Order</span>
              <span className="text-right font-semibold text-primary-950">{order?.orderCode ?? orderId}</span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-4">
              <span className="text-sm text-primary-500">Amount</span>
              <span className="font-semibold text-primary-950">{formatCurrency(payment?.amount ?? order?.totalAmount ?? 0)}</span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-4">
              <span className="text-sm text-primary-500">Payment</span>
              <Badge tone={getPaymentStatusTone(payment?.paymentStatus ?? order?.paymentStatus ?? "PENDING")}>
                {payment?.paymentStatus ?? order?.paymentStatus ?? "PENDING"}
              </Badge>
            </div>
            {invoice && (
              <div className="mt-3 flex items-center justify-between gap-4">
                <span className="text-sm text-primary-500">Invoice</span>
                <span className="font-semibold text-primary-950">{invoice.invoiceNumber || "Generated"}</span>
              </div>
            )}
          </div>

          {invoiceQuery.isError && (
            <p className="mt-5 rounded-2xl bg-warning-50 px-4 py-3 text-sm text-warning-700">
              {getPaymentErrorMessage(invoiceQuery.error)}
            </p>
          )}

          {invoiceDownload.isError && (
            <p className="mt-5 rounded-2xl bg-error-50 px-4 py-3 text-sm text-error-700">
              {getPaymentErrorMessage(invoiceDownload.error)}
            </p>
          )}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            {paid && (
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                loading={invoiceQuery.isLoading || invoiceDownload.isPending}
                disabled={!invoice?.invoiceId}
                onClick={handleDownloadInvoice}
              >
                <Download size={16} />
                Download invoice
              </Button>
            )}
            {!paid && (
              <Button type="button" variant="outline" className="flex-1" onClick={() => paymentQuery.refetch()}>
                <RefreshCw size={16} />
                Refresh
              </Button>
            )}
            <Link to={`/orders/${orderId}`} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-primary-900 px-6 py-3 text-sm font-semibold text-primary-900 transition hover:bg-primary-900 hover:text-white">
              Order detail
            </Link>
            <Link to="/orders/my" className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700">
              <ShoppingBag size={16} />
              My orders
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
