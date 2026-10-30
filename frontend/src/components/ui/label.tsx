"use client";

import * as React from "react";
import { cn } from "cn";

function Label({
  className,
  htmlFor,
  ...props
}: React.ComponentProps<"label"> & { htmlFor: string }) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: This reusable label is associated through its required htmlFor prop.
    <label
      data-slot="label"
      {...props}
      htmlFor={htmlFor}
      className={cn(
        "flex items-center gap-2 text-xs leading-none select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
    />
  );
}

export { Label };
