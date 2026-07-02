import { type ReactNode } from "react";
import Button from "./Button";

interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  children?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmLoading?: boolean;
  onConfirm?: () => void;
  onClose: () => void;
}

export default function Modal({
  open,
  title,
  description,
  children,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmLoading,
  onConfirm,
  onClose,
}: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-primary-950/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <section className="relative w-full max-w-md rounded-3xl border border-primary-100 bg-white p-6 shadow-large">
        <h2 className="font-display text-2xl font-semibold text-primary-950">{title}</h2>
        {description && <p className="mt-2 text-sm leading-6 text-primary-500">{description}</p>}
        {children && <div className="mt-5">{children}</div>}
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            {cancelLabel}
          </Button>
          {onConfirm && (
            <Button type="button" loading={confirmLoading} onClick={onConfirm}>
              {confirmLabel}
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
