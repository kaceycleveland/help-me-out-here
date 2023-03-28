import clsx from "clsx";
import { DetailedHTMLProps, ButtonHTMLAttributes } from "react";

export interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {}

export const Button = ({ className, ...rest }: ButtonProps) => {
  return (
    <button
      type="button"
      className={clsx(
        className,
        "bg-sky-600 p-2 text-white font-semibold rounded hover:bg-sky-800 disabled:bg-sky-200 text-base flex items-center"
      )}
      {...rest}
    />
  );
};
