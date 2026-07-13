import { FileText } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getApiErrorMessage } from "../../shared/api/httpClient";
import Button from "../../shared/components/Button";
import Container from "../../shared/components/Container";
import ErrorState from "../../shared/components/ErrorState";
import Loading from "../../shared/components/Loading";
import OrderStatusBadge from "../../shared/components/OrderStatusBadge";
import PaymentStatusBadge from "../../shared/components/PaymentStatusBadge";
import Textarea from "../../shared/components/Textarea";
import { getNextOrderStatus } from "../../shared/constants/orderStatus";
import { formatCurrency } from "../../shared/utils/formatCurrency";
import { useOrderDetailQuery, useUpdateOrderStatusMutation } from "../order/api";

export default function StaffOrderDetailPage() {
  const { orderId = "" } = useParams();
  const [note, setNote] = useState("");
  const orderQuery = useOrderDetailQuery(orderId);
  const updateStatus = useUpdateOrderStatusMutation(orderId);
  const order = orderQuery.data?.data;
  const nextStatus = order ? getNextOrderStatus(order.orderStatus) : null;

  const handleUpdate = () => {
    if (!nextStatus) {
      return;
    }

    updateStatus.mutate(
      { toStatus: nextStatus, note: note || undefined },
      {
        onSuccess: () => {
          setNote("");
          void orderQuery.refetch();
        },
      },
    );
  };

  if (orderQuery.isLoading) {
    return (
      <section className="min-h-screen bg-beige-50 pt-28 pb-20">
        <Loading label="Loading staff order..." />
      </section>
    );
  }

  if (!order) {
    return (
      <section className="min-h-screen bg-beige-50 pt-28 pb-20">
        <Container>
          <ErrorState title="Order not found" description="The staff order detail could not be loaded." />
        </Container>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
      <Container>
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-accent-600">Staff detail</p>
            <h1 className="mt-3 font-display text-4xl font-semibold text-primary-950">{order.orderCode}</h1>
            <div className="mt-4 flex flex-wrap gap-3">
              <PaymentStatusBadge status={order.paymentStatus} />
              <OrderStatusBadge status={order.orderStatus} />
            </div>
          </div>
          <Link to={`/staff/orders/${order.id}/print-info`}>
            <Button type="button" variant="outline">
              <FileText size={16} />
              Print info
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-3xl border border-primary-100 bg-white p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-primary-950">Order items</h2>
            <div className="mt-5 space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="rounded-2xl bg-beige-50 p-4">
                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="font-semibold text-primary-950">{item.productNameSnapshot}</p>
                      <p className="mt-1 text-sm text-primary-500">
                        {item.variantSnapshot.size} / {item.variantSnapshot.color} / {item.variantSnapshot.material}
                      </p>
                    </div>
                    <p className="font-semibold text-primary-950">{formatCurrency(item.totalPrice)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="rounded-3xl border border-primary-100 bg-white p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-primary-950">Update production</h2>
            <p className="mt-2 text-sm leading-6 text-primary-500">Allowed transitions follow the MVP order policy.</p>
            <Textarea label="Status note" value={note} onChange={(event) => setNote(event.target.value)} className="mt-5" />
            {updateStatus.isError && (
              <p className="mt-4 rounded-2xl bg-error-50 px-4 py-3 text-sm text-error-700">
                {getApiErrorMessage(updateStatus.error)}
              </p>
            )}
            <Button type="button" size="lg" className="mt-5 w-full" disabled={!nextStatus} loading={updateStatus.isPending} onClick={handleUpdate}>
              {nextStatus ? `Move to ${nextStatus}` : "No next action"}
            </Button>
          </aside>
        </div>
      </Container>
    </section>
  );
}
