import { Search } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../shared/components/Button";
import Container from "../../shared/components/Container";
import EmptyState from "../../shared/components/EmptyState";
import ErrorState from "../../shared/components/ErrorState";
import Input from "../../shared/components/Input";
import Loading from "../../shared/components/Loading";
import OrderStatusBadge from "../../shared/components/OrderStatusBadge";
import Select from "../../shared/components/Select";
import { ORDER_STATUS, type OrderStatus } from "../../shared/constants/orderStatus";
import { formatCurrency } from "../../shared/utils/formatCurrency";
import { useStaffOrdersQuery } from "./api";

export default function StaffOrderListPage() {
  const [status, setStatus] = useState<OrderStatus>(ORDER_STATUS.paid);
  const [keywordInput, setKeywordInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const ordersQuery = useStaffOrdersQuery({ status, keyword: keyword || undefined, page, pageSize: 10 });
  const data = ordersQuery.data?.data;

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setKeyword(keywordInput);
    setPage(1);
  };

  return (
    <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
      <Container>
        <div className="mb-8">
          <p className="text-sm font-semibold text-accent-600">Staff orders</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-primary-950">Production queue</h1>
        </div>

        <form className="mb-6 grid gap-3 rounded-3xl border border-primary-100 bg-white p-4 shadow-soft md:grid-cols-[220px_minmax(0,1fr)_auto]" onSubmit={handleSearch}>
          <Select value={status} onChange={(event) => setStatus(event.target.value)}>
            {[ORDER_STATUS.paid, ORDER_STATUS.inProduction, ORDER_STATUS.shipping, ORDER_STATUS.completed].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
          <Input value={keywordInput} onChange={(event) => setKeywordInput(event.target.value)} placeholder="Search order code" />
          <Button type="submit">
            <Search size={16} />
            Search
          </Button>
        </form>

        {ordersQuery.isLoading && <Loading label="Loading staff orders..." />}
        {ordersQuery.isError && <ErrorState description="Could not load staff order list." />}
        {data && data.items.length === 0 && (
          <EmptyState title="No orders found" description="Try a different status or search keyword." />
        )}
        {data && data.items.length > 0 && (
          <div className="overflow-hidden rounded-3xl border border-primary-100 bg-white shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-beige-50 text-xs uppercase tracking-wider text-primary-400">
                  <tr>
                    <th className="px-5 py-4">Order</th>
                    <th className="px-5 py-4">Customer</th>
                    <th className="px-5 py-4">Total</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary-100">
                  {data.items.map((order) => (
                    <tr key={order.orderId}>
                      <td className="px-5 py-4 font-semibold text-primary-950">{order.orderCode}</td>
                      <td className="px-5 py-4 text-primary-500">{order.customerId.slice(0, 8)}</td>
                      <td className="px-5 py-4 text-primary-700">{formatCurrency(order.totalAmount)}</td>
                      <td className="px-5 py-4">
                        <OrderStatusBadge status={order.orderStatus} />
                      </td>
                      <td className="px-5 py-4">
                        <Link to={`/staff/orders/${order.orderId}`} className="font-semibold text-primary-950 underline underline-offset-4">
                          View detail
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-primary-100 px-5 py-4">
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
          </div>
        )}
      </Container>
    </section>
  );
}
