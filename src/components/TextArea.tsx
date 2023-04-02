import { forwardRef } from "react";
import clsx from "clsx";
import { DetailedHTMLProps, TextareaHTMLAttributes } from "react";
import { FormLabel, FormLabelProps } from "./FormLabel";

export interface TextAreaProps
  extends DetailedHTMLProps<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  variant?: "sm" | "md" | "lg";
  labelProps?: FormLabelProps;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, variant = "md", labelProps, ...rest }, ref) => {
    return (
      <div className="w-full">
        {labelProps && <FormLabel {...labelProps} />}
        <textarea
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
