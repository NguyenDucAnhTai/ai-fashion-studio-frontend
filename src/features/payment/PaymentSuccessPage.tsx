import { CheckCircle2, Download, RefreshCw, ShoppingBag } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import Badge from "../../shared/components/Badge";
import Button from "../../shared/components/Button";
import Container from "../../shared/components/Container";
import ErrorState from "../../shared/components/ErrorState";
import Loading from "../../shared/components/Loading";
import { PAYMENT_STATUS, getPaymentStatusTone } from "../../shared/constants/paymentStatus";
import { formatCurrency } from "../../shared/utils/formatCurrency";
import { useAuthStore } from "../auth/authStore";
import { MISSING_CUSTOMER_MESSAGE, useOrderDetailQuery } from "../order/api";
import { getPaymentErrorMessage, useInvoiceQuery, usePaymentByOrderQuery } from "./api";

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId") ?? "";
  const userId = useAuthStore((state) => state.currentUser?.id ?? "");
  const orderQuery = useOrderDetailQuery(userId ? orderId : "", userId);
  const paymentQuery = usePaymentByOrderQuery(orderId, Boolean(orderId && userId), true);
  const order = orderQuery.data?.data;
  const payment = paymentQuery.data?.data;
  const paid = payment?.paymentStatus === PAYMENT_STATUS.paid || order?.paymentStatus === PAYMENT_STATUS.paid;
  const invoiceQuery = useInvoiceQuery(payment?.paymentId ?? "", Boolean(payment?.paymentId && paid));
  const invoice = invoiceQuery.data?.data;

  if (!orderId) {
    return (
      <section className="min-h-screen bg-beige-50 pt-28 pb-20">
        <Container>
          <ErrorState title="Missing order" description="Payment success needs an orderId query parameter." />
        </Container>
      </section>
    );
  }

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

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            {invoice?.invoicePdfUrl && (
              <a
                href={invoice.invoicePdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-primary-900 px-6 py-3 text-sm font-semibold text-primary-900 transition hover:bg-primary-900 hover:text-white"
              >
                <Download size={16} />
                Download invoice
              </a>
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
