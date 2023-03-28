import { forwardRef } from "react";
import clsx from "clsx";
import { DetailedHTMLProps, InputHTMLAttributes } from "react";

export interface InputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  variant?: "sm" | "md" | "lg";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = "md", ...rest }, ref) => {
    return (
      <input
        ref={ref}
        className={clsx(
          className,
          "font-semibold rounded placeholder:text-slate-400 border focus:outline-slate-400 focus:outline-1",
          {
            "p-3": variant === "lg",
            "p-2": variant === "md",
            "p-1": variant === "sm",
          }
        )}
        {...rest}
      />
    );
  }
);
