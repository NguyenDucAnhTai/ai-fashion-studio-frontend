import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, EyeOff, XCircle, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { getApiErrorMessage } from "../../shared/api/httpClient";
import Badge from "../../shared/components/Badge";
import Button from "../../shared/components/Button";
import Container from "../../shared/components/Container";
import EmptyState from "../../shared/components/EmptyState";
import Input from "../../shared/components/Input";
import Textarea from "../../shared/components/Textarea";
import { useModerateFeedbackMutation } from "./api";
import { getPendingFeedbackDrafts, removePendingFeedbackDraft } from "./pendingFeedbacks";
import { moderateFeedbackSchema, type ModerateFeedbackFormValues } from "./schemas";
import type { FeedbackStatus } from "./types";

const ACTIONS = [
  { status: "APPROVED", label: "Approve", icon: CheckCircle2 },
  { status: "HIDDEN", label: "Hide", icon: EyeOff },
  { status: "REJECTED", label: "Reject", icon: XCircle },
] satisfies Array<{ status: FeedbackStatus; label: string; icon: LucideIcon }>;

export default function FeedbackModerationPage() {
  const [pendingDrafts, setPendingDrafts] = useState(getPendingFeedbackDrafts);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ModerateFeedbackFormValues>({
    resolver: zodResolver(moderateFeedbackSchema),
    mode: "onBlur",
    defaultValues: { feedbackId: "", note: "" },
  });
  const feedbackId = watch("feedbackId");
  const mutation = useModerateFeedbackMutation(feedbackId);

  const handleModerate = (status: FeedbackStatus, values: ModerateFeedbackFormValues) => {
    mutation.mutate(
      { status, note: values.note || undefined },
      {
        onSuccess: () => {
          removePendingFeedbackDraft(values.feedbackId);
          setPendingDrafts(getPendingFeedbackDrafts());
          reset({ feedbackId: "", note: "" });
        },
      },
    );
  };

  const onSubmit = (values: ModerateFeedbackFormValues) => handleModerate("APPROVED", values);

  return (
    <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
      <Container>
        <div className="mb-8">
          <p className="text-sm font-semibold text-accent-600">Staff/Admin</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-primary-950">Feedback moderation</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-primary-500">
            Backend doc exposes status PATCH for moderation. Pending items below come from successful submits in this browser session.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="rounded-3xl border border-primary-100 bg-white p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-primary-950">Pending session feedback</h2>
            <div className="mt-5 space-y-4">
              {pendingDrafts.length === 0 && <EmptyState title="No local pending feedback" description="Submit feedback from a completed order, or enter an ID manually." />}
              {pendingDrafts.map((draft) => (
                <button
                  key={draft.feedbackId}
                  type="button"
                  onClick={() => setValue("feedbackId", draft.feedbackId, { shouldValidate: true })}
                  className="block w-full rounded-2xl border border-primary-100 p-4 text-left transition hover:border-primary-300"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-primary-950">{draft.feedbackId}</p>
                    <Badge tone="warning">PENDING</Badge>
                  </div>
                  <p className="mt-2 text-sm text-primary-500">Rating {draft.rating}/5 for product {draft.productId.slice(0, 8)}</p>
                  {draft.comment && <p className="mt-2 text-sm leading-6 text-primary-700">{draft.comment}</p>}
                </button>
              ))}
            </div>
          </div>

          <form className="rounded-3xl border border-primary-100 bg-white p-6 shadow-soft" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Input label="Feedback ID" error={errors.feedbackId?.message} {...register("feedbackId")} />
            <Textarea label="Moderation note" error={errors.note?.message} className="mt-4" {...register("note")} />

            {mutation.isError && (
              <p className="mt-4 rounded-2xl bg-error-50 px-4 py-3 text-sm text-error-700">
                {getApiErrorMessage(mutation.error)}
              </p>
            )}

            <div className="mt-6 grid gap-3">
              {ACTIONS.map((action) => {
                const Icon = action.icon;

                return (
                  <Button
                    key={action.status}
                    type="button"
                    variant={action.status === "APPROVED" ? "primary" : "outline"}
                    loading={mutation.isPending}
                    disabled={!feedbackId}
                    onClick={handleSubmit((values) => handleModerate(action.status, values))}
                  >
                    <Icon size={16} />
                    {action.label}
                  </Button>
                );
              })}
            </div>
          </form>
        </div>
      </Container>
    </section>
  );
}
