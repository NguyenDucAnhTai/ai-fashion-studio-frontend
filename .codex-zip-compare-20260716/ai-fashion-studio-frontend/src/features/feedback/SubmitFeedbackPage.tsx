import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { getApiErrorMessage } from "../../shared/api/httpClient";
import Button from "../../shared/components/Button";
import Container from "../../shared/components/Container";
import ErrorState from "../../shared/components/ErrorState";
import Input from "../../shared/components/Input";
import Loading from "../../shared/components/Loading";
import RatingInput from "../../shared/components/RatingInput";
import Textarea from "../../shared/components/Textarea";
import { ORDER_STATUS } from "../../shared/constants/orderStatus";
import { useAuthStore } from "../auth/authStore";
import { MISSING_CUSTOMER_MESSAGE, useOrderDetailQuery } from "../order/api";
import { useSubmitFeedbackMutation } from "./api";
import { addPendingFeedbackDraft } from "./pendingFeedbacks";
import { submitFeedbackSchema, type SubmitFeedbackFormValues } from "./schemas";

export default function SubmitFeedbackPage() {
  const { orderId = "" } = useParams();
  const navigate = useNavigate();
  const userId = useAuthStore((state) => state.currentUser?.id ?? "");
  const orderQuery = useOrderDetailQuery(userId ? orderId : "", userId);
  const submitFeedback = useSubmitFeedbackMutation();
  const order = orderQuery.data?.data;
  const firstItem = order?.items[0];
  const canSubmit = useMemo(() => order?.orderStatus === ORDER_STATUS.completed && Boolean(firstItem), [firstItem, order?.orderStatus]);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SubmitFeedbackFormValues>({
    resolver: zodResolver(submitFeedbackSchema),
    mode: "onBlur",
    defaultValues: { rating: 5, comment: "", imageUrl: "" },
  });
  const rating = watch("rating");

  const onSubmit = (values: SubmitFeedbackFormValues) => {
    if (!order || !firstItem) {
      return;
    }

    submitFeedback.mutate(
      {
        orderId: order.id,
        productId: firstItem.productId,
        rating: values.rating,
        comment: values.comment || undefined,
        imageUrl: values.imageUrl || undefined,
      },
      {
        onSuccess: (response) => {
          if (response.data) {
            addPendingFeedbackDraft({
              feedbackId: response.data.feedbackId,
              orderId: order.id,
              productId: firstItem.productId,
              rating: values.rating,
              comment: values.comment ?? "",
              createdAt: new Date().toISOString(),
            });

            navigate(`/orders/${order.id}`);
          }
        },
      },
    );
  };

  if (!userId) {
    return (
      <section className="min-h-screen bg-beige-50 pt-28 pb-20">
        <Container>
          <ErrorState
            title="Cannot load order"
            description={MISSING_CUSTOMER_MESSAGE}
          />
        </Container>
      </section>
    );
  }

  if (orderQuery.isLoading) {
    return (
      <section className="min-h-screen bg-beige-50 pt-28 pb-20">
        <Loading label="Loading order for feedback..." />
      </section>
    );
  }

  if (!order) {
    return (
      <section className="min-h-screen bg-beige-50 pt-28 pb-20">
        <Container>
          <ErrorState title="Order not found" description="Feedback requires a completed order." />
        </Container>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
      <Container>
        <form className="mx-auto max-w-2xl rounded-3xl border border-primary-100 bg-white p-8 shadow-soft sm:p-10" onSubmit={handleSubmit(onSubmit)} noValidate>
          <p className="text-sm font-semibold text-accent-600">Feedback</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-primary-950">Review order {order.orderCode}</h1>
          <p className="mt-3 text-sm leading-7 text-primary-500">
            Feedback is stored as PENDING first, then Staff/Admin can approve it for the public feedback page.
          </p>

          {!canSubmit && (
            <p className="mt-5 rounded-2xl bg-warning-50 px-4 py-3 text-sm text-warning-700">
              Feedback is only available after the order status is COMPLETED.
            </p>
          )}

          <div className="mt-7 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-primary-700">Rating</span>
              <RatingInput
                value={rating}
                onChange={(value) => setValue("rating", value, { shouldValidate: true })}
                disabled={!canSubmit}
              />
              {errors.rating && <span className="mt-1.5 block text-xs text-error-700">{errors.rating.message}</span>}
            </label>
            <Textarea label="Comment" disabled={!canSubmit} error={errors.comment?.message} {...register("comment")} />
            <Input label="Image URL" disabled={!canSubmit} error={errors.imageUrl?.message} {...register("imageUrl")} />
          </div>

          {submitFeedback.isError && (
            <p className="mt-5 rounded-2xl bg-error-50 px-4 py-3 text-sm text-error-700">
              {getApiErrorMessage(submitFeedback.error)}
            </p>
          )}

          <Button type="submit" size="lg" className="mt-7 w-full" disabled={!canSubmit} loading={submitFeedback.isPending}>
            Submit pending feedback
          </Button>
        </form>
      </Container>
    </section>
  );
}
