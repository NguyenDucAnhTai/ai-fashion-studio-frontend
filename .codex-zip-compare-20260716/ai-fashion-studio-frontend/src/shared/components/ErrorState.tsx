import Button from "./Button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = "Something went wrong",
  description = "Please try again in a moment.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-error-500/20 bg-error-50 px-6 py-10 text-center">
      <h3 className="font-display text-xl font-semibold text-error-700">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-primary-600">
        {description}
      </p>
      {onRetry && (
        <Button type="button" variant="outline" size="sm" className="mt-5" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
