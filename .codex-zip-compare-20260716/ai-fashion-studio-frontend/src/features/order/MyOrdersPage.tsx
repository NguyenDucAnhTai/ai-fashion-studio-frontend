import { CreditCard, Eye } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Badge from "../../shared/components/Badge";
import Button from "../../shared/components/Button";
import Container from "../../shared/components/Container";
import EmptyState from "../../shared/components/EmptyState";
import ErrorState from "../../shared/components/ErrorState";
import Loading from "../../shared/components/Loading";
import { getOrderStatusTone } from "../../shared/constants/orderStatus";
import { PAYMENT_STATUS, getPaymentStatusTone } from "../../shared/constants/paymentStatus";
import { formatCurrency } from "../../shared/utils/formatCurrency";
import { formatDate } from "../../shared/utils/formatDate";
import { useAuthStore } from "../auth/authStore";
import {
  MISSING_CUSTOMER_MESSAGE,
  getOrderErrorMessage,
  useMyOrdersQuery,
} from "./api";

interface MyOrdersLocationState {
  createdOrderId?: string;
  message?: string;
}

export default function MyOrdersPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const location = useLocation();
  const routeState = (location.state ?? null) as MyOrdersLocationState | null;
  const userId = useAuthStore((state) => state.currentUser?.id ?? "");
  const ordersQuery = useMyOrdersQuery({ page, pageSize }, userId);
  const data = ordersQuery.data?.data;

  return (
    <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
      <Container>
        <div className="mb-8">
          <p className="text-sm font-semibold text-accent-600">Orders</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-primary-950">My orders</h1>
        </div>

        {routeState?.message && (
          <div className="mb-6 rounded-2xl border border-success-500/20 bg-success-50 px-4 py-3 text-sm font-semibold text-success-700">
            {routeState.message}
          </div>
        )}

        {!userId && (
          <ErrorState
            title="Cannot load orders"
            description={MISSING_CUSTOMER_MESSAGE}
          />
        )}
        {userId && ordersQuery.isLoading && <Loading label="Loading orders..." />}
        {userId && ordersQuery.isError && (
          <ErrorState
            title="Could not load your orders"
            description={getOrderErrorMessage(ordersQuery.error)}
            onRetry={() => ordersQuery.refetch()}
          />
        )}
        {userId && data && data.items.length === 0 && <EmptyState title="No orders yet" description="Saved designs can be checked out into orders." />}

        {userId && data && data.items.length > 0 && (
          <>
            <div className="space-y-4">
              {data.items.map((order) => {
                const id = order.id ?? order.orderId ?? "";
                const canPay =
                  id &&
                  (order.paymentStatus === PAYMENT_STATUS.pending ||
                    order.orderStatus === "PENDING_PAYMENT");

                return (
                  <article
                    key={id || order.orderCode}
                    className={[
                      "flex flex-col gap-4 rounded-3xl border bg-white p-5 shadow-soft lg:flex-row lg:items-center lg:justify-between",
                      routeState?.createdOrderId === id
                        ? "border-success-500/40"
                        : "border-primary-100",
                    ].join(" ")}
                  >
                    <div>
                      <h2 className="text-lg font-semibold text-primary-950">{order.orderCode}</h2>
                      {order.createdAt && <p className="mt-1 text-xs text-primary-400">{formatDate(order.createdAt)}</p>}
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge tone={getPaymentStatusTone(order.paymentStatus)}>{order.paymentStatus}</Badge>
                      <Badge tone={getOrderStatusTone(order.orderStatus)}>{order.orderStatus}</Badge>
                      <span className="text-sm font-semibold text-primary-950">{formatCurrency(order.totalAmount)}</span>
                      {id && (
                        <Link to={`/orders/${id}`} className="inline-flex items-center gap-2 rounded-full border border-primary-200 px-4 py-2 text-sm font-semibold text-primary-800 transition hover:border-primary-900">
                          <Eye size={15} />
                          Detail
                        </Link>
                      )}
                      {canPay && (
                        <Link to={`/payment/${id}`} className="inline-flex items-center gap-2 rounded-full bg-primary-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700">
                          <CreditCard size={15} />
                          Thanh toán
                        </Link>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-8 flex justify-between rounded-2xl border border-primary-100 bg-white px-4 py-3 shadow-soft">
              <p className="text-sm text-primary-500">
                Page {data.page} of {data.totalPages}
              </p>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>
                  Previous
                </Button>
                <Button type="button" variant="outline" size="sm" disabled={page >= data.totalPages} onClick={() => setPage((value) => value + 1)}>
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </Container>
    </section>
  );
}
