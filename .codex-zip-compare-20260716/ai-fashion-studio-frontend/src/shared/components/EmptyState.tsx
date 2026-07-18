interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({
  title = "No data yet",
  description = "There is nothing to show here right now.",
}: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-primary-200 bg-beige-50 px-6 py-10 text-center">
      <h3 className="font-display text-xl font-semibold text-primary-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-primary-500">
        {description}
      </p>
    </div>
  );
}
