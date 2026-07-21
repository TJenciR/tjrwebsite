import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  description?: ReactNode;
  label: ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { className, description, id: suppliedId, label, ...props },
  ref,
) {
  const generatedId = useId();
  const id = suppliedId ?? generatedId;
  const descriptionId = description ? `${id}-description` : undefined;

  return (
    <label className={cn("ds-checkbox", className)} htmlFor={id}>
      <input aria-describedby={descriptionId} id={id} ref={ref} type="checkbox" {...props} />
      <span className="ds-checkbox__control" aria-hidden="true" />
      <span>
        <span className="ds-checkbox__label">{label}</span>
        {description ? <span className="ds-checkbox__description" id={descriptionId}>{description}</span> : null}
      </span>
    </label>
  );
});
