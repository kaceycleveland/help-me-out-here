import { forwardRef } from "react";
import clsx from "clsx";
import { DetailedHTMLProps, InputHTMLAttributes } from "react";
import { FormLabel, FormLabelProps } from "./FormLabel";

export interface InputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  variant?: "sm" | "md" | "lg";
  labelProps?: FormLabelProps;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = "md", labelProps, ...rest }, ref) => {
    return (
      <div className="w-full">
        {labelProps && <FormLabel {...labelProps} />}
        <input
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
