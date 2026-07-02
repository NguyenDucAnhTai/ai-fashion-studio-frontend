import { useEffect } from "react";

interface LoadingProps {
  label?: string;
}

const SKELETON_LINES = [
  { width: "w-3/4", delay: "" },
  { width: "w-full", delay: "[animation-delay:120ms]" },
  { width: "w-5/6", delay: "[animation-delay:240ms]" },
  { width: "w-2/3", delay: "[animation-delay:360ms]" },
];

export default function Loading({ label = "Loading..." }: LoadingProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-primary-950/40 backdrop-blur-sm"
    >
      <div className="flex w-full max-w-sm flex-col items-center gap-5 rounded-3xl border border-primary-100 bg-white p-6 shadow-large">
        <div className="flex w-full items-center gap-3">
          <span className="h-10 w-10 flex-shrink-0 animate-pulse rounded-full bg-primary-100" />
          <div className="flex flex-1 flex-col gap-2">
            <span className="h-3 w-2/3 animate-pulse rounded-full bg-primary-100" />
            <span className="h-3 w-1/3 animate-pulse rounded-full bg-primary-100" />
          </div>
        </div>

        <div className="flex w-full flex-col gap-2.5">
          {SKELETON_LINES.map((line) => (
            <span
              key={line.width + line.delay}
              className={`h-3 ${line.width} ${line.delay} animate-pulse rounded-full bg-primary-100`}
            />
          ))}
        </div>

        <span className="text-sm font-medium text-primary-500">{label}</span>
      </div>
    </div>
  );
}
