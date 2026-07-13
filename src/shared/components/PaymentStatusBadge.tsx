import { getPaymentStatusTone, type PaymentStatus } from "../constants/paymentStatus";
import Badge from "./Badge";

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

export default function PaymentStatusBadge({ status, className }: PaymentStatusBadgeProps) {
  return (
    <Badge tone={getPaymentStatusTone(status)} className={className}>
      {status}
    </Badge>
  );
}
