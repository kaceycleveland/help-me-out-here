import { useState, useCallback } from "react";
import { Button } from "@components/Button";
import { Modal } from "@components/Modal";
import { ModelSettings } from "../../settings/ModelSettings";
import { FormProvider, useForm } from "react-hook-form";
import { Settings } from "../../../settings";
import { ModelBody } from "../../../api";

interface PromptOptionsSettingsModalProps {
  modelSettings: ModelBody;
  setModelSettings: (body: ModelBody) => void;
}

export const PromptOptionsSettingsModal = ({
  modelSettings,
  setModelSettings,
}: PromptOptionsSettingsModalProps) => {
  const [show, setShow] = useState(false);
  const toggleModal = useCallback(() => setShow((prevShow) => !prevShow), []);
  console.log("DEFAULT", modelSettings);
  const methods = useForm<Pick<Settings, "defaultModelBody">>({
    defaultValues: { defaultModelBody: modelSettings },
  });

  const handleSubmit = useCallback(
    methods.handleSubmit((settings) => {
      setModelSettings(settings.defaultModelBody);
      toggleModal();
    }),
    [toggleModal]
  );

  return (
    <>
      <Button onClick={toggleModal}>Edit Prompt Options</Button>
      <Modal onClose={toggleModal} show={show} title="Prompt Options">
        <FormProvider {...methods}>
          <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
            <ModelSettings />
            <div className="flex gap-2 justify-end">
              <Button onClick={toggleModal}>Close</Button>
              <Button type="submit">Update</Button>
            </div>
          </form>
        </FormProvider>
      </Modal>
    </>
  );
};
