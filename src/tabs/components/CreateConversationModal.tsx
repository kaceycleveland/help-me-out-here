import { useCallback } from "react";
import { Button, Modal, ModalProps, TextInput } from "flowbite-react";
import { ChatCompletionRequestMessage } from "openai";
import { useForm } from "react-hook-form";
import { useCreateConversationMutation } from "../../api/hooks";
import { MessageEntry } from "../../api";

interface CreateConversationModalProps extends ModalProps {
  messages: MessageEntry[];
}

export const CreateConversationModal = ({
  messages,
  show,
  onClose,
  ...rest
}: CreateConversationModalProps) => {
  const { mutateAsync: createConversation, isLoading } =
    useCreateConversationMutation({
      onSuccess: onClose,
    });
  const { register, handleSubmit } = useForm({
    defaultValues: {
      title: "",
    },
  });
  const handleCreateConversation = useCallback(
    handleSubmit(({ title }) => {
      createConversation({ title, messages });
    }),
    [messages, createConversation]
  );

  return (
    <Modal dismissible show={show} onClose={onClose} {...rest}>
      <Modal.Header>Create a Conversation</Modal.Header>
      <Modal.Body>
        <TextInput
          className="flex-1"
          {...register("title")}
          placeholder="Title your conversation"
          disabled={isLoading}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleCreateConversation} disabled={isLoading}>
          Create
        </Button>
        <Button color="gray" onClick={onClose} disabled={isLoading}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
