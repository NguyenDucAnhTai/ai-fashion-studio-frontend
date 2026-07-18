import { Cpu, Package, Shirt } from "lucide-react";
import { getApiErrorMessage } from "../../shared/api/httpClient";
import Container from "../../shared/components/Container";
import EmptyState from "../../shared/components/EmptyState";
import ErrorState from "../../shared/components/ErrorState";
import Loading from "../../shared/components/Loading";
import { useAboutUsQuery } from "./api";

const icons = [Shirt, Cpu, Package];

export default function AboutUsPage() {
  const aboutQuery = useAboutUsQuery();
  const sections = aboutQuery.data?.data ?? [];
  const heroSection =
    sections.find((section) => section.sectionKey === "INTRODUCTION") ??
    sections[0];
  const detailSections = heroSection
    ? sections.filter((section) => section.sectionKey !== heroSection.sectionKey)
    : sections;

  return (
    <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
      <Container>
        <div className="relative mb-12 overflow-hidden rounded-3xl bg-primary-900 px-6 py-16 text-white shadow-large sm:px-10 lg:px-14">
          {heroSection?.imageUrl ? (
            <img
              src={heroSection.imageUrl}
              alt={heroSection.title}
              className="absolute inset-0 h-full w-full object-cover opacity-35"
            />
          ) : (
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.35) 1px, transparent 0)",
                backgroundSize: "34px 34px",
              }}
            />
          )}
          <div className="absolute inset-0 bg-primary-950/45" />
          <div className="relative max-w-3xl">
            <p className="mb-3 text-[10px] font-medium uppercase tracking-widest text-accent-300">
              About Us
            </p>
            <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              {heroSection?.title ?? "AI Fashion Studio"}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/60">
              {heroSection?.content ??
                "Published About Us sections from the backend will appear here."}
            </p>
          </div>
        </div>

        {aboutQuery.isLoading && <Loading label="Loading about content..." />}

        {aboutQuery.isError && (
          <ErrorState
            title="Cannot load About Us"
            description={getApiErrorMessage(aboutQuery.error)}
            onRetry={() => aboutQuery.refetch()}
          />
        )}

        {!aboutQuery.isLoading && !aboutQuery.isError && sections.length === 0 && (
          <EmptyState
            title="No published content"
            description="Published About Us sections will appear here."
          />
        )}

        {!aboutQuery.isError && detailSections.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-3">
            {detailSections.map((section, index) => {
              const Icon = icons[index % icons.length];

              return (
                <article
                  key={section.sectionKey}
                  className="overflow-hidden rounded-3xl border border-primary-100 bg-white shadow-soft"
                >
                  <div className="relative h-56 overflow-hidden bg-gradient-to-br from-beige-100 via-beige-200 to-accent-100">
                    {section.imageUrl ? (
                      <img
                        src={section.imageUrl}
                        alt={section.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/70 text-primary-900 shadow-soft">
                          <Icon size={34} strokeWidth={1.4} />
                        </span>
                      </div>
                    )}
                    <div className="absolute left-4 top-4 rounded-full bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary-600 backdrop-blur">
                      {section.sectionKey.replaceAll("_", " ")}
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="font-display text-2xl font-semibold text-primary-900">
                      {section.title}
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-primary-500">
                      {section.content}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}
