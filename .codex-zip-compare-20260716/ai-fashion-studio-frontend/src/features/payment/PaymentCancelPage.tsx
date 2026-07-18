import { XCircle } from "lucide-react";
import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Button from "../../shared/components/Button";
import Container from "../../shared/components/Container";
import { getPaymentErrorMessage, useCancelPaymentMutation } from "./api";

const PENDING_PAYMENT_CALLBACK_KEY = "pendingPaymentCallback";

function readPendingPaymentCallback() {
  try {
    return JSON.parse(localStorage.getItem(PENDING_PAYMENT_CALLBACK_KEY) ?? "{}") as {
      orderId?: string;
      orderCode?: string;
    };
  } catch {
    return {};
  }
}

export default function PaymentCancelPage() {
  const [searchParams] = useSearchParams();
  const pendingCallback = readPendingPaymentCallback();
  const orderId = searchParams.get("orderId") ?? pendingCallback.orderId ?? "";
  const orderCode = searchParams.get("orderCode") ?? pendingCallback.orderCode ?? "";
  const cancelPayment = useCancelPaymentMutation();

  useEffect(() => {
    if (!orderCode || cancelPayment.isPending || cancelPayment.isSuccess) {
      return;
    }

    cancelPayment.mutate(orderCode, {
      onSuccess: () => {
        localStorage.removeItem(PENDING_PAYMENT_CALLBACK_KEY);
      },
    });
  }, [cancelPayment, orderCode]);

  return (
    <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
      <Container>
        <div className="mx-auto max-w-xl rounded-3xl border border-primary-100 bg-white p-8 text-center shadow-soft sm:p-10">
          <XCircle className="mx-auto text-error-500" size={58} />
          <h1 className="mt-5 font-display text-4xl font-semibold text-primary-950">Payment not completed</h1>
          <p className="mt-3 text-sm leading-7 text-primary-500">
            {cancelPayment.isPending
              ? "Updating payment status with the store..."
              : "You can retry payment, inspect the order, or return to the landing page."}
          </p>
          {cancelPayment.isError && (
            <p className="mt-5 rounded-2xl bg-error-50 px-4 py-3 text-sm text-error-700">
              {getPaymentErrorMessage(cancelPayment.error)}
            </p>
          )}
          {cancelPayment.isSuccess && (
            <p className="mt-5 rounded-2xl bg-warning-50 px-4 py-3 text-sm text-warning-700">
              Payment was cancelled and the order status has been updated.
            </p>
          )}
          <div className="mt-7 flex flex-col gap-3">
            {orderId && (
              <>
                <Link to={`/payment/${orderId}`}>
                  <Button type="button" size="lg" className="w-full">
                    Retry payment
                  </Button>
                </Link>
                <Link to={`/orders/${orderId}`}>
                  <Button type="button" size="lg" variant="outline" className="w-full">
                    View order
                  </Button>
                </Link>
              </>
            )}
            <Link to="/">
              <Button type="button" size="lg" variant="ghost" className="w-full">
                Back home
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
