import { getOrderStatusTone, type OrderStatus } from "../constants/orderStatus";
import Badge from "./Badge";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export default function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  return (
    <Badge tone={getOrderStatusTone(status)} className={className}>
      {status}
    </Badge>
  );
}
