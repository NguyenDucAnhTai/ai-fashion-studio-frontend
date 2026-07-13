import {
  CreditCard,
  Download,
  MessageSquare,
  ReceiptText,
  WalletCards,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Badge from "../../shared/components/Badge";
import Button from "../../shared/components/Button";
import Container from "../../shared/components/Container";
import ErrorState from "../../shared/components/ErrorState";
import Loading from "../../shared/components/Loading";
import { ORDER_STATUS, getOrderStatusTone } from "../../shared/constants/orderStatus";
import { PAYMENT_STATUS, getPaymentStatusTone } from "../../shared/constants/paymentStatus";
import { formatCurrency } from "../../shared/utils/formatCurrency";
import { formatDate } from "../../shared/utils/formatDate";
import { useAuthStore } from "../auth/authStore";
import {
  getPaymentErrorMessage,
  useInvoiceMutation,
  usePaymentByOrderQuery,
} from "../payment/api";
import { MISSING_CUSTOMER_MESSAGE, useOrderDetailQuery } from "./api";

export default function OrderDetailPage() {
  const { orderId = "" } = useParams();
  const userId = useAuthStore((state) => state.currentUser?.id ?? "");
  const orderQuery = useOrderDetailQuery(userId ? orderId : "", userId);
  const paymentQuery = usePaymentByOrderQuery(orderId, Boolean(orderId && userId), false);
  const invoiceMutation = useInvoiceMutation();
  const order = orderQuery.data?.data;
  const payment = paymentQuery.data?.data;
  const isPaid =
    order?.paymentStatus === PAYMENT_STATUS.paid ||
    payment?.paymentStatus === PAYMENT_STATUS.paid;
  const canPay =
    Boolean(order) &&
    !isPaid &&
    (order?.orderStatus === ORDER_STATUS.pendingPayment ||
      order?.paymentStatus === PAYMENT_STATUS.pending ||
      payment?.paymentStatus === PAYMENT_STATUS.pending);

  const handleDownloadInvoice = () => {
    if (!payment?.paymentId) {
      return;
    }

    invoiceMutation.mutate(payment.paymentId, {
      onSuccess: (response) => {
        if (response.data?.invoicePdfUrl) {
          window.open(response.data.invoicePdfUrl, "_blank", "noopener,noreferrer");
        }
      },
    });
  };

  if (!userId) {
    return (
      <section className="min-h-screen bg-beige-50 pt-28 pb-20">
        <Container>
          <ErrorState
            title="Cannot load order"
            description={MISSING_CUSTOMER_MESSAGE}
          />
        </Container>
      </section>
    );
  }

  if (orderQuery.isLoading) {
    return (
      <section className="min-h-screen bg-beige-50 pt-28 pb-20">
        <Loading label="Loading order detail..." />
      </section>
    );
  }

  if (!order) {
    return (
      <section className="min-h-screen bg-beige-50 pt-28 pb-20">
        <Container>
          <ErrorState title="Order not found" description="The order could not be loaded." />
        </Container>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
      <Container>
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-accent-600">Order detail</p>
            <h1 className="mt-3 font-display text-4xl font-semibold text-primary-950">{order.orderCode}</h1>
            <div className="mt-4 flex flex-wrap gap-3">
              <Badge tone={getPaymentStatusTone(order.paymentStatus)}>{order.paymentStatus}</Badge>
              <Badge tone={getOrderStatusTone(order.orderStatus)}>{order.orderStatus}</Badge>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {canPay && (
              <Link to={`/payment/${order.id}`}>
                <Button type="button">
                  <CreditCard size={16} />
                  Thanh toán đơn hàng
                </Button>
              </Link>
            )}
            {order.orderStatus === ORDER_STATUS.completed && (
              <Link to={`/orders/${order.id}/feedback`}>
                <Button type="button" variant="outline">
                  <MessageSquare size={16} />
                  Submit feedback
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-primary-100 bg-white p-6 shadow-soft">
              <h2 className="text-lg font-semibold text-primary-950">Order items</h2>
              <div className="mt-5 space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-primary-100 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-primary-950">{item.productNameSnapshot}</p>
                        <p className="mt-1 text-sm text-primary-500">
                          {item.variantSnapshot.size} / {item.variantSnapshot.color} / {item.variantSnapshot.material}
                        </p>
                      </div>
                      <p className="font-semibold text-primary-950">{formatCurrency(item.totalPrice)}</p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-primary-500">
                      <span>Qty {item.quantity}</span>
                      <span>Design {item.designId.slice(0, 8)}</span>
                      <span>Unit {formatCurrency(item.unitPrice)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-primary-100 bg-white p-6 shadow-soft">
              <h2 className="text-lg font-semibold text-primary-950">Status timeline</h2>
              <div className="mt-5 space-y-3">
                {order.statusHistory.length === 0 && <p className="text-sm text-primary-500">No status history yet.</p>}
                {order.statusHistory.map((history, index) => (
                  <div key={`${history.toStatus}-${index}`} className="rounded-2xl bg-beige-50 p-4">
                    <Badge tone={getOrderStatusTone(history.toStatus)}>{history.toStatus}</Badge>
                    {history.note && <p className="mt-2 text-sm text-primary-600">{history.note}</p>}
                    {history.createdAt && <p className="mt-1 text-xs text-primary-400">{formatDate(history.createdAt)}</p>}
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-primary-100 bg-white p-6 shadow-soft">
              <h2 className="text-lg font-semibold text-primary-950">Shipping</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-primary-400">Receiver</dt>
                  <dd className="mt-1 font-semibold text-primary-900">{order.receiverName}</dd>
                </div>
                <div>
                  <dt className="text-primary-400">Phone</dt>
                  <dd className="mt-1 font-semibold text-primary-900">{order.receiverPhone}</dd>
                </div>
                <div>
                  <dt className="text-primary-400">Address</dt>
                  <dd className="mt-1 font-semibold leading-6 text-primary-900">{order.shippingAddress}</dd>
                </div>
              </dl>
            </section>

            <section className="rounded-3xl border border-primary-100 bg-white p-6 shadow-soft">
              <h2 className="text-lg font-semibold text-primary-950">Payment</h2>
              <p className="mt-2 text-3xl font-semibold text-primary-950">{formatCurrency(order.totalAmount)}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge tone={getPaymentStatusTone(payment?.paymentStatus ?? order.paymentStatus)}>
                  {payment?.paymentStatus ?? order.paymentStatus}
                </Badge>
              </div>

              {payment && (
                <dl className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-primary-400">Provider</dt>
                    <dd className="font-semibold text-primary-900">
                      {payment.provider ?? payment.paymentMethod ?? "-"}
                    </dd>
                  </div>
                  {payment.paymentContent && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-primary-400">Content</dt>
                      <dd className="text-right font-semibold text-primary-900">{payment.paymentContent}</dd>
                    </div>
                  )}
                  {payment.paidAt && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-primary-400">Paid at</dt>
                      <dd className="text-right font-semibold text-primary-900">{formatDate(payment.paidAt)}</dd>
                    </div>
                  )}
                </dl>
              )}

              {canPay && (
                <Link to={`/payment/${order.id}`} className="mt-5 inline-flex w-full">
                  <Button type="button" className="w-full">
                    <WalletCards size={16} />
                    Thanh toán đơn hàng
                  </Button>
                </Link>
              )}

              {isPaid && payment?.paymentId && (
                <Button
                  type="button"
                  variant="outline"
                  className="mt-5 w-full"
                  loading={invoiceMutation.isPending}
                  onClick={handleDownloadInvoice}
                >
                  <Download size={16} />
                  Download invoice
                </Button>
              )}

              {paymentQuery.isError && !payment && !canPay && (
                <p className="mt-4 rounded-2xl bg-warning-50 px-4 py-3 text-sm text-warning-700">
                  Payment information is not available yet.
                </p>
              )}

              {invoiceMutation.isError && (
                <p className="mt-4 rounded-2xl bg-error-50 px-4 py-3 text-sm text-error-700">
                  {getPaymentErrorMessage(invoiceMutation.error)}
                </p>
              )}

              {invoiceMutation.data?.data && (
                <div className="mt-4 rounded-2xl bg-success-50 px-4 py-3 text-sm text-success-700">
                  <div className="flex items-center gap-2 font-semibold">
                    <ReceiptText size={16} />
                    {invoiceMutation.data.data.invoiceNumber || "Invoice"}
                  </div>
                  <a
                    href={invoiceMutation.data.data.invoicePdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex font-semibold underline"
                  >
                    Open invoice PDF
                  </a>
                </div>
              )}
            </section>
          </aside>
        </div>
      </Container>
    </section>
  );
}
