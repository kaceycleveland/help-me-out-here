import { FieldError } from "react-hook-form";

const GENERIC_ERROR_MAP: Record<FieldError["type"], string> = {
  required: "This field is required.",
  disabled: "This field is disabled.",
  max: "The value specified is past the max value.",
  maxLength: "The value specified is past the max length.",
  min: "The value specified is smaller then the minimum value.",
  minLength: "The value specified is smaller then the max length.",
  validate: "",
  setValueAs: "",
  shouldUnregister: "",
  value: "",
  onChange: "",
  onBlur: "",
  deps: "",
  valueAsNumber: "",
  valueAsDate: "",
  pattern: "",
};

export const getErrorMessage = (
  error?: FieldError,
  errorMap = GENERIC_ERROR_MAP
) => {
  if (!error) return;

  let passedErrorMap = errorMap;
  if (passedErrorMap !== GENERIC_ERROR_MAP) {
    passedErrorMap = { ...GENERIC_ERROR_MAP, ...passedErrorMap };
  }

  return passedErrorMap[error.type];
};
