import { Download } from "lucide-react";
import { useParams } from "react-router-dom";
import Container from "../../shared/components/Container";
import ErrorState from "../../shared/components/ErrorState";
import Loading from "../../shared/components/Loading";
import { useStaffPrintInfoQuery } from "./api";

export default function PrintInfoPage() {
  const { orderId = "" } = useParams();
  const printInfoQuery = useStaffPrintInfoQuery(orderId);
  const printInfo = printInfoQuery.data?.data;

  if (printInfoQuery.isLoading) {
    return (
      <section className="min-h-screen bg-beige-50 pt-28 pb-20">
        <Loading label="Loading print info..." />
      </section>
    );
  }

  if (!printInfo) {
    return (
      <section className="min-h-screen bg-beige-50 pt-28 pb-20">
        <Container>
          <ErrorState title="Print info not found" description="The print package could not be loaded." />
        </Container>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
      <Container>
        <div className="mb-8">
          <p className="text-sm font-semibold text-accent-600">Print package</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-primary-950">{printInfo.orderCode}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-primary-500">
            Staff downloads the saved design print file. Try-On result images are preview-only and are not used here.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {printInfo.items.map((item) => (
            <article key={item.orderItemId} className="overflow-hidden rounded-3xl border border-primary-100 bg-white shadow-soft">
              <div className="flex min-h-80 items-center justify-center bg-beige-50">
                {item.previewImageUrl ? (
                  <img src={item.previewImageUrl} alt={item.productName} className="h-full w-full object-contain" />
                ) : (
                  <p className="text-sm text-primary-400">No preview image</p>
                )}
              </div>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-primary-950">{item.productName}</h2>
                <p className="mt-2 text-sm text-primary-500">
                  {item.variant.size} / {item.variant.color} / {item.variant.material} - Qty {item.quantity}
                </p>
                {item.printFileUrl ? (
                  <a
                    href={item.printFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
                  >
                    <Download size={16} />
                    Download print file
                  </a>
                ) : (
                  <p className="mt-5 rounded-2xl bg-warning-50 px-4 py-3 text-sm text-warning-700">Print file is missing.</p>
                )}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
