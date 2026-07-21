import { forwardRef, useId, type ReactNode, type TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  description?: ReactNode;
  error?: ReactNode;
  label: ReactNode;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, description, error, id: suppliedId, label, rows = 4, ...props },
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
      <textarea
        {...props}
        aria-describedby={describedBy}
        aria-invalid={error ? true : props["aria-invalid"]}
        className={cn("ds-textarea", className)}
        id={id}
        ref={ref}
        rows={rows}
      />
      {description ? <span className="ds-field__description" id={descriptionId}>{description}</span> : null}
      {error ? <span className="ds-field__error" id={errorId}><span aria-hidden="true">!</span>{error}</span> : null}
    </label>
  );
});
