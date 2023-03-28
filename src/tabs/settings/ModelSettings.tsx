import { useFormContext } from "react-hook-form";
import { getErrorMessage } from "../../utils/formUtils";
import { SettingsInput } from "./components/SettingsInput";
import { Settings } from "../../settings";

export const ModelSettings = () => {
  const { formState } = useFormContext<Settings>();
  console.log("formState", formState.defaultValues);
  return (
    <>
      <SettingsInput
        field="defaultModelBody.model"
        label="Default Model"
        error={getErrorMessage(formState.errors.defaultModelBody?.model)}
      />
      <SettingsInput
        field="defaultModelBody.max_tokens"
        fieldOptions={{ valueAsNumber: true, min: 0, max: 4000 }}
        label="Max Tokens"
        error={getErrorMessage(formState.errors.defaultModelBody?.max_tokens)}
        inputProps={{
          type: "number",
        }}
      />
      <SettingsInput
        field="defaultModelBody.presence_penalty"
        fieldOptions={{ valueAsNumber: true, min: -2, max: 2 }}
        label="Presence Penalty"
        error={getErrorMessage(
          formState.errors.defaultModelBody?.presence_penalty
        )}
        inputProps={{
          type: "number",
        }}
      />
      <SettingsInput
        field="defaultModelBody.frequency_penalty"
        fieldOptions={{ valueAsNumber: true, min: -2, max: 2 }}
        label="Frequency Penalty"
        error={getErrorMessage(
          formState.errors.defaultModelBody?.frequency_penalty
        )}
        inputProps={{
          type: "number",
        }}
      />
    </>
  );
};
