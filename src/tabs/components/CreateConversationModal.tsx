import { useCallback, useState } from "react";
import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { useForm } from "react-hook-form";
import { useCreateConversationMutation } from "../../api/hooks";
import { db, MessageEntry, ModelBody } from "../../api";
import { Modal } from "@components/Modal";

interface CreateConversationModalProps {
  messages: MessageEntry[];
  modelBody?: ModelBody;
}

export const CreateConversationModal = ({
  messages,
  modelBody,
}: CreateConversationModalProps) => {
  const [showModal, setShowModal] = useState(false);
  const openModal = useCallback(() => setShowModal(true), []);
  const closeModal = useCallback(() => setShowModal(false), []);

  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      title: "",
    },
  });
  const handleCreateConversation = useCallback(
    handleSubmit(async ({ title }) => {
      await db.createConversation(title, messages, modelBody);
      closeModal();
    }),
    [messages, modelBody, closeModal]
  );

  const isLoading = formState.isLoading || formState.isSubmitting;

  return (
    <>
      <Button onClick={openModal}>Save</Button>
      <Modal title="Save a Conversation" show={showModal} onClose={closeModal}>
        <Input
          className="flex-1"
          {...register("title")}
          placeholder="Title your conversation"
          disabled={isLoading}
        />
        <div className="flex gap-2 justify-end">
          <Button onClick={closeModal} disabled={isLoading}>
            Close
          </Button>
          <Button onClick={handleCreateConversation} disabled={isLoading}>
            Create
          </Button>
        </div>
      </Modal>
    </>
  );
};
