import {
  Copy,
  ExternalLink,
  QrCode,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Badge from "../../shared/components/Badge";
import Button from "../../shared/components/Button";
import Container from "../../shared/components/Container";
import ErrorState from "../../shared/components/ErrorState";
import Loading from "../../shared/components/Loading";
import { PAYMENT_STATUS, getPaymentStatusTone } from "../../shared/constants/paymentStatus";
import { formatCurrency } from "../../shared/utils/formatCurrency";
import { formatDate } from "../../shared/utils/formatDate";
import { useAuthStore } from "../auth/authStore";
import { MISSING_CUSTOMER_MESSAGE, useOrderDetailQuery } from "../order/api";
import {
  getPaymentErrorCode,
  getPaymentErrorMessage,
  useCreatePaymentMutation,
  usePaymentByOrderQuery,
} from "./api";
import type { PaymentInfo } from "./types";

const PENDING_PAYMENT_CALLBACK_KEY = "pendingPaymentCallback";

function getPaymentProvider(payment: PaymentInfo) {
  return payment.provider ?? payment.paymentMethod ?? "PAYOS";
}

function savePendingPaymentCallback(orderId: string, orderCode?: string, payment?: PaymentInfo | null) {
  localStorage.setItem(
    PENDING_PAYMENT_CALLBACK_KEY,
    JSON.stringify({
      orderId,
      orderCode: payment?.orderCode ?? orderCode,
      paymentId: payment?.paymentId,
    }),
  );
}

export default function PaymentPage() {
  const { orderId = "" } = useParams();
  const navigate = useNavigate();
  const [createdPayment, setCreatedPayment] = useState<PaymentInfo | null>(null);
  const [copied, setCopied] = useState(false);
  const userId = useAuthStore((state) => state.currentUser?.id ?? "");
  const orderQuery = useOrderDetailQuery(userId ? orderId : "", userId);
  const paymentQuery = usePaymentByOrderQuery(orderId, Boolean(orderId && userId), true);
  const createPayment = useCreatePaymentMutation();
  const order = orderQuery.data?.data;
  const payment = paymentQuery.data?.data ?? createdPayment;
  const hasPayment = Boolean(payment);
  const paymentProvider = payment ? getPaymentProvider(payment) : "PAYOS";

  useEffect(() => {
    if (order && payment) {
      savePendingPaymentCallback(orderId, order.orderCode, payment);
    }
  }, [order, orderId, payment]);

  useEffect(() => {
    if (
      order?.paymentStatus === PAYMENT_STATUS.paid ||
      payment?.paymentStatus === PAYMENT_STATUS.paid
    ) {
      navigate(`/payment/success?orderId=${orderId}`, { replace: true });
    }
  }, [navigate, order?.paymentStatus, orderId, payment?.paymentStatus]);

  const handleCreatePayment = () => {
    if (!order) {
      return;
    }

    const shortDescription = `Order ${order.orderCode ?? orderId}`.slice(0, 25);

    createPayment.mutate(
      {
        orderId,
        amount: order.totalAmount,
        description: shortDescription,
      },
      {
        onSuccess: (response) => {
          if (response.data) {
            setCreatedPayment(response.data);
            void paymentQuery.refetch();

            if (response.data.checkoutUrl) {
              savePendingPaymentCallback(orderId, order.orderCode, response.data);
              window.location.assign(response.data.checkoutUrl);
            }
          }
        },
        onError: (error) => {
          if (getPaymentErrorCode(error) === "PAYMENT_ALREADY_EXISTS") {
            void paymentQuery.refetch();
          }
        },
      },
    );
  };

  const handleCopyContent = async () => {
    if (!payment?.paymentContent) {
      return;
    }

    await navigator.clipboard?.writeText(payment.paymentContent);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  if (!orderId) {
    return (
      <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
        <Container>
          <ErrorState
            title="Missing order"
            description="Payment needs an orderId route parameter."
          />
        </Container>
      </section>
    );
  }

  if (!userId) {
    return (
      <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
        <Container>
          <ErrorState
            title="Cannot load payment"
            description={MISSING_CUSTOMER_MESSAGE}
          />
        </Container>
      </section>
    );
  }

  if (orderQuery.isLoading) {
    return (
      <section className="min-h-screen bg-beige-50 pt-28 pb-20">
        <Loading label="Loading payment..." />
      </section>
    );
  }

  if (!order) {
    return (
      <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
        <Container>
          <ErrorState
            title="Order not found"
            description="The order could not be loaded."
            onRetry={() => orderQuery.refetch()}
          />
        </Container>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
      <Container>
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-accent-600">Payment</p>
              <h1 className="mt-3 font-display text-4xl font-semibold text-primary-950">
                Pay for order {order.orderCode}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-primary-500">
                Create a PayOS checkout link or SePay transfer instruction. The
                page polls payment status while it is pending.
              </p>
            </div>
            <Link to={`/orders/${order.id}`}>
              <Button type="button" variant="outline">
                <ShoppingBag size={16} />
                View order
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
            <aside className="space-y-6">
              <section className="rounded-3xl border border-primary-100 bg-white p-6 shadow-soft">
                <h2 className="text-lg font-semibold text-primary-950">
                  Order summary
                </h2>
                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-primary-500">Amount</span>
                    <span className="font-semibold text-primary-950">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-primary-500">Payment</span>
                    <Badge tone={getPaymentStatusTone(order.paymentStatus)}>
                      {order.paymentStatus}
                    </Badge>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-primary-500">Receiver</span>
                    <span className="text-right font-semibold text-primary-950">
                      {order.receiverName}
                    </span>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-primary-100 bg-white p-6 shadow-soft">
                <p className="text-sm font-semibold text-primary-950">
                  Payment request
                </p>
                <p className="mt-2 text-xs leading-5 text-primary-500">
                  Create a payment request for this order using the backend payment API.
                </p>

                <Button
                  type="button"
                  size="lg"
                  className="mt-5 w-full"
                  loading={createPayment.isPending}
                  disabled={hasPayment}
                  onClick={handleCreatePayment}
                >
                  Create payment
                </Button>

                {paymentQuery.isError && !payment && (
                  <p className="mt-4 rounded-2xl bg-beige-50 px-4 py-3 text-sm text-primary-500">
                    No payment instruction is active yet. Create one to continue.
                  </p>
                )}

                {createPayment.isError && (
                  <p className="mt-4 rounded-2xl bg-error-50 px-4 py-3 text-sm text-error-700">
                    {getPaymentErrorMessage(createPayment.error)}
                  </p>
                )}
              </section>
            </aside>

            <section className="rounded-3xl border border-primary-100 bg-white p-6 shadow-soft">
              {!payment && (
                <div className="flex min-h-80 items-center justify-center rounded-3xl bg-beige-50 text-center">
                  <div>
                    <QrCode className="mx-auto text-primary-300" size={48} />
                    <p className="mt-4 text-sm font-semibold text-primary-800">
                      Payment instruction will appear here
                    </p>
                    <p className="mt-2 text-xs text-primary-400">
                      Create payment to show payment instructions.
                    </p>
                  </div>
                </div>
              )}

              {payment && (
                <div>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-primary-400">
                        {paymentProvider} payment
                      </p>
                      <p className="mt-1 text-3xl font-semibold text-primary-950">
                        {formatCurrency(payment.amount)}
                      </p>
                      {payment.expiresAt && (
                        <p className="mt-2 text-xs text-primary-400">
                          Expires {formatDate(payment.expiresAt)}
                        </p>
                      )}
                    </div>
                    <Badge tone={getPaymentStatusTone(payment.paymentStatus)}>
                      {payment.paymentStatus}
                    </Badge>
                  </div>

                  {payment.checkoutUrl && (
                    <a
                      href={payment.checkoutUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => savePendingPaymentCallback(orderId, order.orderCode, payment)}
                      className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
                    >
                      Pay now
                      <ExternalLink size={16} />
                    </a>
                  )}

                  {payment.qrCodeUrl && (
                    <div className="mt-6 rounded-3xl bg-beige-50 p-4 text-center">
                      <img
                        src={payment.qrCodeUrl}
                        alt="Payment QR"
                        className="mx-auto h-56 w-56 rounded-2xl object-contain"
                      />
                      <p className="mt-3 text-xs text-primary-500">
                        Scan QR or transfer using the instruction below.
                      </p>
                    </div>
                  )}

                  {payment.bankInfo && (
                    <dl className="mt-5 grid gap-3 rounded-2xl border border-primary-100 p-4 text-sm">
                      <div className="flex justify-between gap-4">
                        <dt className="text-primary-400">Bank</dt>
                        <dd className="text-right font-semibold text-primary-900">
                          {payment.bankInfo.bankName}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-primary-400">Account number</dt>
                        <dd className="font-semibold text-primary-900">
                          {payment.bankInfo.accountNumber}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-primary-400">Account name</dt>
                        <dd className="text-right font-semibold text-primary-900">
                          {payment.bankInfo.accountName}
                        </dd>
                      </div>
                    </dl>
                  )}

                  {payment.paymentContent && (
                    <div className="mt-5 rounded-2xl border border-primary-100 p-4">
                      <p className="text-xs font-semibold uppercase tracking-widest text-primary-400">
                        Payment content
                      </p>
                      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="font-semibold text-primary-950">
                          {payment.paymentContent}
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleCopyContent}
                        >
                          <Copy size={15} />
                          {copied ? "Copied" : "Copy"}
                        </Button>
                      </div>
                    </div>
                  )}

                  {payment.paymentStatus === PAYMENT_STATUS.pending && (
                    <p className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-warning-50 px-4 py-3 text-sm text-warning-700">
                      <RefreshCw size={16} className="animate-spin" />
                      Waiting for confirmation. Polling every 5 seconds.
                    </p>
                  )}

                  {(payment.paymentStatus === PAYMENT_STATUS.failed ||
                    payment.paymentStatus === PAYMENT_STATUS.cancelled) && (
                    <p className="mt-5 rounded-2xl bg-error-50 px-4 py-3 text-sm text-error-700">
                      Payment was not completed. You can retry from this order
                      after the provider allows a new instruction.
                    </p>
                  )}
                </div>
              )}
            </section>
          </div>
        </div>
      </Container>
    </section>
  );
}
