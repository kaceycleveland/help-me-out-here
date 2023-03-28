import { Input, InputProps } from "@components/Input";
import { EyeIcon } from "@heroicons/react/24/solid";
import { useState, useCallback } from "react";
import {
  FieldPath,
  FieldValues,
  RegisterOptions,
  useFormContext,
} from "react-hook-form";

interface SettingsInputProps<T extends FieldValues> {
  field: FieldPath<T>;
  fieldOptions?: RegisterOptions<T>;
  label: string;
  hidden?: boolean;
  isHiddenTogglable?: boolean;
  error?: string;
  inputProps?: InputProps;
}

export const SettingsInput = <T extends FieldValues>({
  field,
  fieldOptions,
  label,
  isHiddenTogglable,
  error,
  inputProps,
}: SettingsInputProps<T>) => {
  const { register } = useFormContext<T>();
  const [isHidden, setIsHidden] = useState(isHiddenTogglable);
  const toggleIsHidden = useCallback(() => {
    setIsHidden((hidden) => !hidden);
  }, []);
  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2 items-center">
        <label className="pl-1" htmlFor={field}>
          {label}
        </label>
        {isHiddenTogglable && (
          <EyeIcon
            className="w-4 cursor-pointer hover:text-slate-500"
            onClick={toggleIsHidden}
          />
        )}
        {error && <div className="text-sm text-red-400">{error}</div>}
      </div>
      <Input
        type={isHidden ? "password" : undefined}
        {...inputProps}
        {...register(field, fieldOptions)}
      />
    </div>
  );
};
