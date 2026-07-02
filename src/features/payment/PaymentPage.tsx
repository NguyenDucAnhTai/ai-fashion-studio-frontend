import { ExternalLink, QrCode } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getApiErrorMessage } from "../../shared/api/httpClient";
import Badge from "../../shared/components/Badge";
import Button from "../../shared/components/Button";
import Container from "../../shared/components/Container";
import Select from "../../shared/components/Select";
import { PAYMENT_STATUS, getPaymentStatusTone } from "../../shared/constants/paymentStatus";
import { formatCurrency } from "../../shared/utils/formatCurrency";
import { useCreatePaymentMutation, usePaymentByOrderQuery } from "./api";
import type { PaymentInfo, PaymentProvider } from "./types";

export default function PaymentPage() {
  const { orderId = "" } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState<PaymentProvider>("PAYOS");
  const [createdPayment, setCreatedPayment] = useState<PaymentInfo | null>(null);
  const createPayment = useCreatePaymentMutation();
  const paymentQuery = usePaymentByOrderQuery(orderId, Boolean(createdPayment), true);
  const payment = paymentQuery.data?.data ?? createdPayment;
  const origin = useMemo(() => window.location.origin, []);

  useEffect(() => {
    if (paymentQuery.data?.data?.paymentStatus === PAYMENT_STATUS.paid) {
      navigate(`/payment/success?orderId=${orderId}`, { replace: true });
    }
  }, [navigate, orderId, paymentQuery.data?.data?.paymentStatus]);

  const handleCreatePayment = () => {
    createPayment.mutate(
      {
        orderId,
        provider,
        returnUrl: `${origin}/payment/success?orderId=${orderId}`,
        cancelUrl: `${origin}/payment/cancel?orderId=${orderId}`,
      },
      {
        onSuccess: (response) => {
          if (response.data) {
            setCreatedPayment(response.data);
          }
        },
      },
    );
  };

  return (
    <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
      <Container>
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <p className="text-sm font-semibold text-accent-600">Payment</p>
            <h1 className="mt-3 font-display text-4xl font-semibold text-primary-950">Pay for order {orderId.slice(0, 8)}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-primary-500">
              Create a PayOS checkout link or SePay transfer instruction, then poll payment status while pending.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="rounded-3xl border border-primary-100 bg-white p-6 shadow-soft">
              <Select
                label="Payment method"
                value={provider}
                disabled={Boolean(payment)}
                onChange={(event) => setProvider(event.target.value as PaymentProvider)}
              >
                <option value="PAYOS">PayOS checkout</option>
                <option value="SEPAY">SePay QR transfer</option>
              </Select>

              <Button type="button" size="lg" className="mt-5 w-full" loading={createPayment.isPending} disabled={Boolean(payment)} onClick={handleCreatePayment}>
                Create payment
              </Button>

              {createPayment.isError && (
                <p className="mt-4 rounded-2xl bg-error-50 px-4 py-3 text-sm text-error-700">
                  {getApiErrorMessage(createPayment.error)}
                </p>
              )}
            </aside>

            <div className="rounded-3xl border border-primary-100 bg-white p-6 shadow-soft">
              {!payment && (
                <div className="flex min-h-72 items-center justify-center rounded-3xl bg-beige-50 text-center">
                  <div>
                    <QrCode className="mx-auto text-primary-300" size={48} />
                    <p className="mt-4 text-sm font-semibold text-primary-800">Payment instruction will appear here</p>
                  </div>
                </div>
              )}

              {payment && (
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-primary-400">Amount</p>
                      <p className="mt-1 text-3xl font-semibold text-primary-950">{formatCurrency(payment.amount)}</p>
                    </div>
                    <Badge tone={getPaymentStatusTone(payment.paymentStatus)}>{payment.paymentStatus}</Badge>
                  </div>

                  {payment.checkoutUrl && (
                    <a
                      href={payment.checkoutUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
                    >
                      Open PayOS checkout
                      <ExternalLink size={16} />
                    </a>
                  )}

                  {payment.qrCodeUrl && (
                    <div className="mt-6 rounded-3xl bg-beige-50 p-4 text-center">
                      <img src={payment.qrCodeUrl} alt="Payment QR" className="mx-auto h-56 w-56 rounded-2xl object-contain" />
                      <p className="mt-3 text-xs text-primary-500">Scan QR or transfer using the instruction below.</p>
                    </div>
                  )}

                  {payment.bankInfo && (
                    <dl className="mt-5 grid gap-3 rounded-2xl border border-primary-100 p-4 text-sm">
                      <div className="flex justify-between gap-4">
                        <dt className="text-primary-400">Bank</dt>
                        <dd className="font-semibold text-primary-900">{payment.bankInfo.bankName}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-primary-400">Account</dt>
                        <dd className="font-semibold text-primary-900">{payment.bankInfo.accountNumber}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-primary-400">Content</dt>
                        <dd className="font-semibold text-primary-900">{payment.paymentContent}</dd>
                      </div>
                    </dl>
                  )}

                  {payment.paymentStatus === PAYMENT_STATUS.pending && (
                    <p className="mt-5 rounded-2xl bg-warning-50 px-4 py-3 text-sm text-warning-700">
                      Waiting for provider webhook. This page polls every 5 seconds.
                    </p>
                  )}
                  {(payment.paymentStatus === PAYMENT_STATUS.failed || payment.paymentStatus === PAYMENT_STATUS.cancelled) && (
                    <Button type="button" className="mt-5 w-full" variant="outline" onClick={() => setCreatedPayment(null)}>
                      Retry payment
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
