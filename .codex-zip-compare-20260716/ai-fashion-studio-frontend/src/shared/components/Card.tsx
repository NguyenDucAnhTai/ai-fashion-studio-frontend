import { type HTMLAttributes } from "react";

export default function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[
        "rounded-2xl border border-primary-100 bg-white shadow-soft",
        className,
      ].join(" ")}
      {...props}
    />
  );
}
