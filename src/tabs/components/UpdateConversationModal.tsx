import { useCallback } from "react";
import { Button, Modal, ModalProps, TextInput } from "flowbite-react";
import { ChatCompletionRequestMessage } from "openai";
import { useForm } from "react-hook-form";
import { useUpdateConversationMutation } from "../../api/hooks";

interface UpdateConversationModalProps extends ModalProps {
  conversationId: number;
  messages: ChatCompletionRequestMessage[];
  title?: string;
}

export const UpdateConversationModal = ({
  conversationId,
  messages,
  show,
  onClose,
  title,
  ...rest
}: UpdateConversationModalProps) => {
  const { mutateAsync: updateConversation, isLoading } =
    useUpdateConversationMutation();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      title: title ?? "",
    },
  });
  const handleUpdateConversation = useCallback(
    handleSubmit(({ title }) => {
      updateConversation({ conversationId, title, messages });
    }),
    [conversationId, messages, updateConversation]
  );

  return (
    <Modal show={show} dismissible onClose={onClose} {...rest}>
      <Modal.Header>Update a Conversation</Modal.Header>
      <Modal.Body>
        <TextInput
          className="flex-1"
          {...register("title")}
          placeholder="Title your conversation"
          disabled={isLoading}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleUpdateConversation} disabled={isLoading}>
          Update
        </Button>
        <Button color="gray" onClick={onClose} disabled={isLoading}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
