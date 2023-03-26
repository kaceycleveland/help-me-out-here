import { forwardRef } from "react";
import clsx from "clsx";
import { DetailedHTMLProps, InputHTMLAttributes } from "react";

export interface InputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...rest }, ref) => {
    return (
      <input
        ref={ref}
        className={clsx(
          className,
          "p-2 font-semibold rounded placeholder:text-slate-400 border focus:outline-slate-400 focus:outline-1"
        )}
        {...rest}
      />
    );
  }
);
