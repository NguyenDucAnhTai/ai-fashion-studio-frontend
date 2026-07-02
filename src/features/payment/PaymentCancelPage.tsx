import { XCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import Button from "../../shared/components/Button";
import Container from "../../shared/components/Container";

export default function PaymentCancelPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId") ?? "";

  return (
    <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
      <Container>
        <div className="mx-auto max-w-xl rounded-3xl border border-primary-100 bg-white p-8 text-center shadow-soft sm:p-10">
          <XCircle className="mx-auto text-error-500" size={58} />
          <h1 className="mt-5 font-display text-4xl font-semibold text-primary-950">Payment not completed</h1>
          <p className="mt-3 text-sm leading-7 text-primary-500">
            You can retry payment, inspect the order, or return to the landing page.
          </p>
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
