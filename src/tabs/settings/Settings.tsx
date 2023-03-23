import { ReactNode, useState, useCallback } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import {
  Settings as SettingsType,
  settingsAtom,
  settingsStore,
} from "../../settings";
import { PageAnimateLayout } from "../components/PageAnimateLayout";
import { useAtom } from "jotai";
import { EyeIcon } from "@heroicons/react/24/solid";

const SettingsInputContainer = ({ children }: { children: ReactNode }) => {
  return <div className="flex flex-col gap-1">{children}</div>;
};

export const Settings = () => {
  const [settings, setSettings] = useAtom(settingsAtom, {
    store: settingsStore,
  });
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
          className="p-2 flex flex-col justify-between h-full"
          onSubmit={handleSettingsSubmit}
        >
          <div className="flex flex-col gap-2">
            <SettingsInput
              isHiddenTogglable
              field="openAiApiKey"
              label="Open AI API Key"
            />
            <SettingsInput
              isHiddenTogglable
              field="openAiOrg"
              label="Open AI Organization"
            />
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

interface SettingsInputProps {
  field: keyof SettingsType;
  label: string;
  hidden?: boolean;
  isHiddenTogglable?: boolean;
}

const SettingsInput = ({
  field,
  label,
  isHiddenTogglable,
}: SettingsInputProps) => {
  const { register } = useFormContext<SettingsType>();
  const [isHidden, setIsHidden] = useState(isHiddenTogglable);
  const toggleIsHidden = useCallback(() => {
    setIsHidden((hidden) => !hidden);
  }, []);
  console.log(field, label);
  return (
    <SettingsInputContainer>
      <div className="flex gap-2">
        <Label className="pl-1" htmlFor={field} value={label} />{" "}
        <EyeIcon
          className="w-4 cursor-pointer hover:text-slate-500"
          onClick={toggleIsHidden}
        />
      </div>
      <TextInput
        type={isHidden ? "password" : undefined}
        shadow
        {...register(field)}
      />
    </SettingsInputContainer>
  );
};
