import { useState, useCallback } from "react";
import { Button, TextInput } from "flowbite-react";
import { useChatMutation } from "../../../api/hooks";
import { useForm } from "react-hook-form";
import { db } from "../../../api";
import { PageAnimateLayout } from "../PageAnimateLayout";
import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
} from "openai";
import { SystemMessage, UserMessage } from "./messages";
import { CreateConversationModal } from "../CreateConversationModal";
import { UpdateConversationModal } from "../UpdateConversationModal";

interface ConversationFormProps {
  initMessages?: ChatCompletionRequestMessage[];
  title?: string;
  conversationId?: number;
}

export const ConversationForm = ({
  initMessages,
  title,
  conversationId,
}: ConversationFormProps) => {
  const [showModal, setShowModal] = useState(false);
  const openModal = useCallback(() => setShowModal(true), []);
  const closeModal = useCallback(() => setShowModal(false), []);
  const [responseData, setResponseData] = useState<
    ChatCompletionRequestMessage[]
  >(initMessages ?? []);
  console.log(responseData);
  const { mutateAsync: submitChat, isLoading } = useChatMutation({
    onSuccess: (data, entry) => {
      console.log("entry", entry);
      if (data.data.choices.length && data.data.choices[0].message) {
        setResponseData([
          ...entry,
          { role: "system", content: data.data.choices[0].message.content },
        ]);
      }
    },
  });
  const { register, handleSubmit, reset } = useForm<{ prompt: string }>();
  const handleChatSubmit = useCallback(
    handleSubmit((body) => {
      console.log(body);
      setResponseData((prevResponseData) => {
        const newResponseData = [
          ...prevResponseData,
          {
            role: ChatCompletionRequestMessageRoleEnum.User,
            content: body.prompt,
          },
        ];
        reset();
        submitChat(newResponseData);
        return newResponseData;
      });
    }),
    [handleSubmit, reset, submitChat]
  );

  return (
    <div className="flex flex-col h-full">
      {title && <div className="text-lg">{title}</div>}
      <div className="min-h-0 grow bg-slate-200 p-4 m-2 rounded overflow-auto">
        {responseData.map((message, idx) => {
          if (message.role === ChatCompletionRequestMessageRoleEnum.User)
            return <UserMessage key={idx} {...message} />;
          if (message.role === ChatCompletionRequestMessageRoleEnum.System)
            return <SystemMessage key={idx} {...message} />;
        })}
        {isLoading && (
          <SystemMessage
            role={ChatCompletionRequestMessageRoleEnum.System}
            content="Loading..."
          />
        )}
      </div>
      <form className="flex gap-2 px-2 py-4" onSubmit={handleChatSubmit}>
        <TextInput
          className="flex-1"
          {...register("prompt")}
          placeholder="Enter a prompt"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          Submit
        </Button>
        <Button onClick={openModal}>
          {conversationId ? "Update" : "Create"}
        </Button>
      </form>
      {conversationId ? (
        <UpdateConversationModal
          show={showModal}
          title={title}
          conversationId={conversationId}
          messages={responseData}
          onClose={closeModal}
        />
      ) : (
        <CreateConversationModal
          messages={responseData}
          show={showModal}
          onClose={closeModal}
        />
      )}
    </div>
  );
};
