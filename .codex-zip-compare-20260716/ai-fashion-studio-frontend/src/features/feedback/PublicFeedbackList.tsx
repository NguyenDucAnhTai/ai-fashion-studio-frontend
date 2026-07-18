import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Container from "../../shared/components/Container";
import EmptyState from "../../shared/components/EmptyState";
import Loading from "../../shared/components/Loading";
import RatingInput from "../../shared/components/RatingInput";
import { formatDate } from "../../shared/utils/formatDate";
import { usePublicFeedbackQuery } from "./api";
import { MOCK_PUBLIC_FEEDBACKS } from "./mockData";

const PAGE_SIZE = 10;

export default function PublicFeedbackList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");
  const productId = searchParams.get("productId") ?? undefined;
  const params = useMemo(() => ({ productId, page, pageSize: PAGE_SIZE }), [productId, page]);
  const feedbackQuery = usePublicFeedbackQuery(params);
  const fallbackData = useMemo(() => {
    const filtered = productId ? MOCK_PUBLIC_FEEDBACKS.filter((item) => item.productId === productId) : MOCK_PUBLIC_FEEDBACKS;
    const start = (page - 1) * PAGE_SIZE;
    return {
      items: filtered.slice(start, start + PAGE_SIZE),
      page,
      pageSize: PAGE_SIZE,
      totalItems: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)),
    };
  }, [page, productId]);
  const data = feedbackQuery.data?.data ?? (feedbackQuery.isError ? fallbackData : null);

  const goToPage = (nextPage: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(nextPage));
    setSearchParams(next);
  };

  return (
    <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
      <Container>
        <div className="mb-12 max-w-3xl">
          <p className="mb-3 text-[10px] font-medium uppercase tracking-widest text-primary-400">Public Feedback</p>
          <h1 className="font-display text-4xl font-semibold text-primary-950 sm:text-5xl">Approved customer reviews</h1>
          <p className="mt-5 text-base leading-8 text-primary-500">
            Public feedback is shown only after moderation, matching the backend rule that approved feedback is visible to guests and customers.
          </p>
        </div>

        {feedbackQuery.isLoading && <Loading label="Loading public feedback..." />}

        {feedbackQuery.isError && data && (
          <div className="mb-6 rounded-2xl border border-warning-500/20 bg-warning-50 px-4 py-3 text-sm text-warning-700">
            API is offline, showing preview feedback until the backend gateway is available.
          </div>
        )}

        {data && data.items.length === 0 && <EmptyState title="No feedback yet" description="Approved feedback will appear here after staff moderation." />}

        {data && data.items.length > 0 && (
          <>
            <div className="grid gap-5 lg:grid-cols-2">
              {data.items.map((feedback, index) => (
                <article key={feedback.id} className="grid overflow-hidden rounded-3xl border border-primary-100 bg-white shadow-soft sm:grid-cols-[180px_1fr]">
                  <div className={[
                    "relative min-h-48 bg-gradient-to-br",
                    index % 2 === 0 ? "from-primary-800 via-primary-900 to-black text-white" : "from-beige-100 via-beige-200 to-accent-100 text-primary-900",
                  ].join(" ")}
                  >
                    {feedback.imageUrl ? (
                      <img src={feedback.imageUrl} alt="Customer feedback" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <div className="text-center">
                          <p className="font-display text-5xl font-semibold">{feedback.rating}.0</p>
                          <p className="mt-2 text-[10px] font-semibold uppercase tracking-widest opacity-60">Rating</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col p-6">
                    <div className="mb-5 flex items-center justify-between gap-4">
                      <RatingInput value={feedback.rating} />
                      <span className="text-xs text-primary-400">{formatDate(feedback.createdAt)}</span>
                    </div>
                    <p className="flex-1 text-sm leading-7 text-primary-600">{feedback.comment}</p>
                    <p className="mt-6 rounded-full bg-beige-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary-400">
                      Product {feedback.productId}
                    </p>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-10 flex items-center justify-between rounded-2xl border border-primary-100 bg-white px-4 py-3 shadow-soft">
              <p className="text-sm text-primary-500">
                Page <span className="font-semibold text-primary-900">{data.page}</span> of {data.totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={data.page <= 1}
                  onClick={() => goToPage(data.page - 1)}
                  className="rounded-full border border-primary-200 px-4 py-2 text-sm font-medium text-primary-700 transition hover:border-primary-900 hover:text-primary-900 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={data.page >= data.totalPages}
                  onClick={() => goToPage(data.page + 1)}
                  className="rounded-full bg-primary-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </Container>
    </section>
  );
}
