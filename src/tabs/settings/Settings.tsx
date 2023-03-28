import { useCallback } from "react";
import { Button } from "@components/Button";
import { FormProvider, useForm } from "react-hook-form";
import {
  Settings as SettingsType,
  settingsAtom,
  settingsStore,
} from "../../settings";
import { PageAnimateLayout } from "../components/PageAnimateLayout";
import { useAtom } from "jotai";
import { getErrorMessage } from "../../utils/formUtils";
import { ModelSettings } from "./ModelSettings";
import { SettingsInput } from "./components/SettingsInput";

export const Settings = () => {
  const [settings, setSettings] = useAtom(settingsAtom, {
    store: settingsStore,
  });
  console.log(settings);
  const formMethods = useForm<SettingsType>({
    defaultValues: settings,
  });

  const { formState, handleSubmit, reset } = formMethods;

  const handleSettingsSubmit = useCallback(
    handleSubmit((settings) => {
      setSettings(settings);
      reset(settings);
    }),
    []
  );

  return (
    <PageAnimateLayout className="h-full">
      <FormProvider {...formMethods}>
        <form
          className="p-2 flex flex-col gap-2 justify-between h-full"
          onSubmit={handleSettingsSubmit}
        >
          <div className="flex flex-col gap-2">
            <SettingsInput
              isHiddenTogglable
              field="openAiApiKey"
              label="Open AI API Key"
              error={getErrorMessage(formState.errors.openAiApiKey)}
            />
            <SettingsInput
              isHiddenTogglable
              field="openAiOrg"
              label="Open AI Organization"
              error={getErrorMessage(formState.errors.openAiOrg)}
            />
            <ModelSettings />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={!formState.isDirty}>
              Save
            </Button>
          </div>
        </form>
      </FormProvider>
    </PageAnimateLayout>
  );
};
