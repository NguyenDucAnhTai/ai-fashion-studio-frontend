interface LoadingProps {
  label?: string;
}

export default function Loading({ label = "Loading..." }: LoadingProps) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-primary-500">
      <span className="h-8 w-8 rounded-full border-2 border-primary-200 border-t-accent-500 animate-spin" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
