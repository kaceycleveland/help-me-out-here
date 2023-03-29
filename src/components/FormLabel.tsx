import { DetailedHTMLProps, LabelHTMLAttributes } from "react";
import clsx from "clsx";
export interface FormLabelProps
  extends DetailedHTMLProps<
    LabelHTMLAttributes<HTMLLabelElement>,
    HTMLLabelElement
  > {}

export const FormLabel = ({ className, ...rest }: FormLabelProps) => {
  return <label className={clsx(className, "pl-1 font-medium")} {...rest} />;
};
