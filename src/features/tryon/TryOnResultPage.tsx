import { AlertTriangle, CheckCircle2, Loader2, ShoppingBag } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Badge from "../../shared/components/Badge";
import Button from "../../shared/components/Button";
import Container from "../../shared/components/Container";
import ErrorState from "../../shared/components/ErrorState";
import Loading from "../../shared/components/Loading";
import { formatDate } from "../../shared/utils/formatDate";
import { useTryOnResultQuery, useTryOnStatusQuery } from "./api";

function getStatusTone(status?: string) {
  if (status === "SUCCEEDED") {
    return "success";
  }

  if (status === "FAILED") {
    return "error";
  }

  return "warning";
}

export default function TryOnResultPage() {
  const { requestId = "" } = useParams();
  const statusQuery = useTryOnStatusQuery(requestId);
  const status = statusQuery.data?.data;
  const resultQuery = useTryOnResultQuery(requestId, status?.status === "SUCCEEDED");
  const result = resultQuery.data?.data;

  if (statusQuery.isLoading) {
    return (
      <section className="min-h-screen bg-beige-50 pt-28 pb-20">
        <Loading label="Checking Try-On status..." />
      </section>
    );
  }

  if (statusQuery.isError || !status) {
    return (
      <section className="min-h-screen bg-beige-50 pt-28 pb-20">
        <Container>
          <ErrorState title="Try-On request not found" description="The request could not be loaded." />
        </Container>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
      <Container>
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-accent-600">AI Try-On Result</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <h1 className="font-display text-4xl font-semibold text-primary-950">Request {requestId.slice(0, 8)}</h1>
                <Badge tone={getStatusTone(status.status)}>{status.status}</Badge>
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-primary-500">
                Polling runs every 3 seconds until the backend marks this request succeeded or failed.
              </p>
            </div>
            <Button type="button" variant="outline" onClick={() => window.location.assign(`/checkout/${status.designId}`)}>
              <ShoppingBag size={16} />
              Checkout saved design
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="flex min-h-[520px] items-center justify-center rounded-3xl border border-primary-100 bg-white p-5 shadow-soft">
              {(status.status === "PENDING" || status.status === "PROCESSING") && (
                <div className="text-center">
                  <Loader2 className="mx-auto animate-spin text-accent-500" size={46} />
                  <h2 className="mt-4 text-xl font-semibold text-primary-950">Try-On is processing</h2>
                  <p className="mt-2 text-sm text-primary-500">Kafka job accepted. Waiting for AI worker result.</p>
                </div>
              )}
              {status.status === "FAILED" && (
                <div className="text-center">
                  <AlertTriangle className="mx-auto text-error-500" size={46} />
                  <h2 className="mt-4 text-xl font-semibold text-primary-950">Try-On failed</h2>
                  <p className="mt-2 text-sm text-primary-500">{status.errorMessage ?? "Please retry from the Try-On page."}</p>
                  <Link to={`/tryon/${status.designId}`} className="mt-5 inline-flex rounded-full bg-primary-900 px-5 py-2 text-sm font-semibold text-white">
                    Retry
                  </Link>
                </div>
              )}
              {status.status === "SUCCEEDED" && resultQuery.isLoading && <Loading label="Loading generated preview..." />}
              {status.status === "SUCCEEDED" && result && (
                <img src={result.resultImageUrl} alt="AI Try-On preview" className="max-h-[620px] w-full rounded-3xl object-contain" />
              )}
              {status.status === "SUCCEEDED" && resultQuery.isError && (
                <ErrorState title="Result not ready" description="The request succeeded, but the preview image is not available yet." />
              )}
            </div>

            <aside className="rounded-3xl border border-primary-100 bg-white p-6 shadow-soft">
              <CheckCircle2 className="text-success-500" size={28} />
              <h2 className="mt-4 text-lg font-semibold text-primary-950">Preview-only rule</h2>
              <p className="mt-2 text-sm leading-6 text-primary-500">
                Staff must print from the saved design file, not from this generated Try-On image.
              </p>
              <dl className="mt-6 space-y-4 text-sm">
                <div>
                  <dt className="text-primary-400">Requested</dt>
                  <dd className="mt-1 font-semibold text-primary-900">{formatDate(status.requestedAt)}</dd>
                </div>
                <div>
                  <dt className="text-primary-400">Completed</dt>
                  <dd className="mt-1 font-semibold text-primary-900">{status.completedAt ? formatDate(status.completedAt) : "Waiting"}</dd>
                </div>
                {result && (
                  <div>
                    <dt className="text-primary-400">Processing time</dt>
                    <dd className="mt-1 font-semibold text-primary-900">{Math.round(result.processingTimeMs / 1000)}s</dd>
                  </div>
                )}
              </dl>
            </aside>
          </div>
        </div>
      </Container>
    </section>
  );
}
