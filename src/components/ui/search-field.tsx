import { forwardRef, useId, type InputHTMLAttributes } from "react";

import { Icon } from "@/components/icons";
import { cn } from "@/lib/cn";

export interface SearchFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
}

export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(function SearchField(
  { className, id: suppliedId, label, ...props },
  ref,
) {
  const generatedId = useId();
  const id = suppliedId ?? generatedId;

  return (
    <label className={cn("ds-search-field", className)} htmlFor={id}>
      <span className="ds-visually-hidden">{label}</span>
      <Icon name="search" />
      <input id={id} ref={ref} type="search" {...props} />
    </label>
  );
});
