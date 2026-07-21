import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  description?: ReactNode;
  error?: ReactNode;
  label: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, description, error, id: suppliedId, label, ...props },
  ref,
) {
  const generatedId = useId();
  const id = suppliedId ?? generatedId;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [props["aria-describedby"], descriptionId, errorId]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <label className="ds-field" htmlFor={id}>
      <span className="ds-field__label">{label}</span>
      <input
        {...props}
        aria-describedby={describedBy}
        aria-invalid={error ? true : props["aria-invalid"]}
        className={cn("ds-input", className)}
        id={id}
        ref={ref}
      />
      {description ? <span className="ds-field__description" id={descriptionId}>{description}</span> : null}
      {error ? <span className="ds-field__error" id={errorId}><span aria-hidden="true">!</span>{error}</span> : null}
    </label>
  );
});
