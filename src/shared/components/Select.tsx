import { forwardRef, type SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className = "", id, children, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <label className="block">
        {label && <span className="mb-2 block text-sm font-medium text-primary-700">{label}</span>}
        <select
          ref={ref}
          id={inputId}
          className={[
            "h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-primary-900 outline-none transition",
            "focus:border-accent-400 focus:ring-2 focus:ring-accent-100",
            error ? "border-error-500" : "border-primary-200",
            className,
          ].join(" ")}
          {...props}
        >
          {children}
        </select>
        {error && <span className="mt-1.5 block text-xs text-error-700">{error}</span>}
      </label>
    );
  },
);

Select.displayName = "Select";

export default Select;
