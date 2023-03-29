import { forwardRef } from "react";
import clsx from "clsx";
import { DetailedHTMLProps, InputHTMLAttributes } from "react";
import { FormLabel, FormLabelProps } from "./FormLabel";

export interface SelectProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > {
  variant?: "sm" | "md" | "lg";
  labelProps?: FormLabelProps;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, variant = "md", labelProps, ...rest }, ref) => {
    return (
      <div className="w-full">
        {labelProps && <FormLabel {...labelProps} />}
        <select
          ref={ref}
          className={clsx(
            className,
            "w-full font-semibold rounded placeholder:text-slate-400 border focus:outline-slate-400 focus:outline-1",
            {
              "p-3": variant === "lg",
              "p-2": variant === "md",
              "p-1": variant === "sm",
            }
          )}
          {...rest}
        />
      </div>
    );
  }
);
