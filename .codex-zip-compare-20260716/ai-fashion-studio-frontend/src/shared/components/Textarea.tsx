import { forwardRef, type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <label className="block">
        {label && <span className="mb-2 block text-sm font-medium text-primary-700">{label}</span>}
        <textarea
          ref={ref}
          id={inputId}
          className={[
            "min-h-28 w-full resize-y rounded-xl border bg-white px-3.5 py-3 text-sm text-primary-900 outline-none transition",
            "placeholder:text-primary-300 focus:border-accent-400 focus:ring-2 focus:ring-accent-100",
            error ? "border-error-500" : "border-primary-200",
            className,
          ].join(" ")}
          {...props}
        />
        {error && <span className="mt-1.5 block text-xs text-error-700">{error}</span>}
      </label>
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
