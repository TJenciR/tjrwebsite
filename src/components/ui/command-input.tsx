import { forwardRef, useId, type InputHTMLAttributes } from "react";

import { Icon } from "@/components/icons";
import { cn } from "@/lib/cn";

export interface CommandInputProps extends InputHTMLAttributes<HTMLInputElement> {
  hint?: string;
  label: string;
}

export const CommandInput = forwardRef<HTMLInputElement, CommandInputProps>(function CommandInput(
  { className, hint = "⌘K", id: suppliedId, label, ...props },
  ref,
) {
  const generatedId = useId();
  const id = suppliedId ?? generatedId;

  return (
    <label className={cn("ds-command-input", className)} htmlFor={id}>
      <span className="ds-visually-hidden">{label}</span>
      <Icon name="terminal" />
      <input id={id} ref={ref} type="text" {...props} />
      <kbd aria-hidden="true">{hint}</kbd>
    </label>
  );
});
