import { CheckCircle2, Download, ShoppingBag } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import Badge from "../../shared/components/Badge";
import Container from "../../shared/components/Container";
import ErrorState from "../../shared/components/ErrorState";
import Loading from "../../shared/components/Loading";
import { getPaymentStatusTone } from "../../shared/constants/paymentStatus";
import { formatCurrency } from "../../shared/utils/formatCurrency";
import { useOrderDetailQuery } from "../order/api";
import { usePaymentByOrderQuery } from "./api";

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId") ?? "";
  const orderQuery = useOrderDetailQuery(orderId);
  const paymentQuery = usePaymentByOrderQuery(orderId, Boolean(orderId), false);
  const order = orderQuery.data?.data;
  const payment = paymentQuery.data?.data;

  if (!orderId) {
    return (
      <section className="min-h-screen bg-beige-50 pt-28 pb-20">
        <Container>
          <ErrorState title="Missing order" description="Payment success needs an orderId query parameter." />
        </Container>
      </section>
    );
  }

  if (orderQuery.isLoading || paymentQuery.isLoading) {
    return (
      <section className="min-h-screen bg-beige-50 pt-28 pb-20">
        <Loading label="Loading payment success..." />
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
      <Container>
        <div className="mx-auto max-w-2xl rounded-3xl border border-primary-100 bg-white p-8 text-center shadow-soft sm:p-10">
          <CheckCircle2 className="mx-auto text-success-500" size={58} />
          <h1 className="mt-5 font-display text-4xl font-semibold text-primary-950">Payment success</h1>
          <p className="mt-3 text-sm leading-7 text-primary-500">
            Java Order Service updates the order after the C# PaymentSucceeded event.
          </p>

          <div className="mt-8 rounded-2xl bg-beige-50 p-5 text-left">
            <div className="flex items-center justify-between">
              <span className="text-sm text-primary-500">Order</span>
              <span className="font-semibold text-primary-950">{order?.orderCode ?? orderId}</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-primary-500">Amount</span>
              <span className="font-semibold text-primary-950">{formatCurrency(payment?.amount ?? order?.totalAmount ?? 0)}</span>
            </div>
            {payment && (
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-primary-500">Payment</span>
                <Badge tone={getPaymentStatusTone(payment.paymentStatus)}>{payment.paymentStatus}</Badge>
              </div>
            )}
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            {payment?.invoicePdfUrl && (
              <a
                href={payment.invoicePdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-primary-900 px-6 py-3 text-sm font-semibold text-primary-900 transition hover:bg-primary-900 hover:text-white"
              >
                <Download size={16} />
                Invoice PDF
              </a>
            )}
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
