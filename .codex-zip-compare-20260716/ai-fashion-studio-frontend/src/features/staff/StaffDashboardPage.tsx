import { ClipboardList, Factory, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import Container from "../../shared/components/Container";
import EmptyState from "../../shared/components/EmptyState";
import ErrorState from "../../shared/components/ErrorState";
import Loading from "../../shared/components/Loading";
import OrderStatusBadge from "../../shared/components/OrderStatusBadge";
import { ORDER_STATUS } from "../../shared/constants/orderStatus";
import { formatCurrency } from "../../shared/utils/formatCurrency";
import { useStaffOrdersQuery } from "./api";

export default function StaffDashboardPage() {
  const ordersQuery = useStaffOrdersQuery({ status: ORDER_STATUS.paid, page: 1, pageSize: 5 });
  const orders = ordersQuery.data?.data?.items ?? [];

  return (
    <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
      <Container>
        <div className="mb-8">
          <p className="text-sm font-semibold text-accent-600">Staff operations</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-primary-950">Production dashboard</h1>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          {[
            { label: "Paid queue", value: orders.length, icon: ClipboardList, href: "/staff/orders" },
            { label: "Production flow", value: "3 steps", icon: Factory, href: "/staff/orders" },
            { label: "Feedback review", value: "PATCH", icon: MessageSquare, href: "/staff/feedbacks" },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <Link key={item.label} to={item.href} className="rounded-3xl border border-primary-100 bg-white p-6 shadow-soft transition hover:-translate-y-1">
                <Icon className="text-accent-500" size={24} />
                <p className="mt-4 text-sm text-primary-400">{item.label}</p>
                <p className="mt-1 text-2xl font-semibold text-primary-950">{item.value}</p>
              </Link>
            );
          })}
        </div>

        {ordersQuery.isLoading && <Loading label="Loading paid orders..." />}
        {ordersQuery.isError && <ErrorState description="Could not load staff orders." />}
        {!ordersQuery.isLoading && !ordersQuery.isError && orders.length === 0 && (
          <EmptyState title="No paid orders" description="There are no paid orders waiting for production right now." />
        )}
        {orders.length > 0 && (
          <div className="rounded-3xl border border-primary-100 bg-white p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-primary-950">Recent paid orders</h2>
            <div className="mt-5 space-y-3">
              {orders.map((order) => (
                <Link key={order.orderId} to={`/staff/orders/${order.orderId}`} className="flex flex-col gap-3 rounded-2xl bg-beige-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-primary-950">{order.orderCode}</p>
                    <p className="mt-1 text-sm text-primary-500">{formatCurrency(order.totalAmount)}</p>
                  </div>
                  <OrderStatusBadge status={order.orderStatus} />
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
