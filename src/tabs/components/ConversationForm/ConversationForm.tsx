import { useState, useCallback } from "react";
import { Button, Spinner, TextInput } from "flowbite-react";
import { useChatMutation } from "../../../api/hooks";
import { useForm } from "react-hook-form";
import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
} from "openai";
import { SystemMessage, UserMessage } from "./messages";
import { CreateConversationModal } from "../CreateConversationModal";
import { UpdateConversationModal } from "../UpdateConversationModal";
import { MessageEntry } from "../../../api";
import { MessageLayout } from "./messages/MessageLayout";
import { formatDate } from "../../../utils/dateUtils";

interface ConversationFormProps {
  initMessages?: MessageEntry[];
  title?: string;
  created?: Date;
  conversationId?: number;
}

export const ConversationForm = ({
  initMessages,
  title,
  created,
  conversationId,
}: ConversationFormProps) => {
  const [showModal, setShowModal] = useState(false);
  const openModal = useCallback(() => setShowModal(true), []);
  const closeModal = useCallback(() => setShowModal(false), []);
  const [responseData, setResponseData] = useState<MessageEntry[]>(
    initMessages ?? []
  );

  const { mutateAsync: submitChat, isLoading } = useChatMutation({
    onSuccess: (data, entry) => {
      console.log("entry", entry);
      const previousMessages = entry.map((message) => ({
        ...message,
        created: new Date(),
        updated: new Date(),
      }));
      if (data.data.choices.length && data.data.choices[0].message) {
        setResponseData([
          ...previousMessages,
          {
            role: "system",
            content: data.data.choices[0].message.content,
            created: new Date(),
            updated: new Date(),
          },
        ]);
      }
    },
  });
  const { register, handleSubmit, reset } = useForm<{ prompt: string }>();
  const handleChatSubmit = useCallback(
    handleSubmit((body) => {
      console.log(body);
      const newResponseData = [
        ...responseData,
        {
          role: ChatCompletionRequestMessageRoleEnum.User,
          content: body.prompt,
          created: new Date(),
          updated: new Date(),
        },
      ];
      setResponseData(newResponseData);
      reset();
      submitChat(newResponseData);
      return newResponseData;
    }),
    [responseData, handleSubmit, reset, submitChat]
  );

  return (
    <div className="flex flex-col h-full">
      {title && created && (
        <div className="flex flex-col gap-1 font-semibold bg-slate-50 py-2 px-4 border my-2">
          <div className="text-xl">{title}</div>
          <div className="text-sm">{formatDate(created, "PP")}</div>
        </div>
      )}
      <div className="min-h-0 grow p-4 overflow-auto flex flex-col gap-2">
        {responseData.map((message, idx) => {
          if (message.role === ChatCompletionRequestMessageRoleEnum.User)
            return <UserMessage key={idx} {...message} />;
          if (message.role === ChatCompletionRequestMessageRoleEnum.System)
            return <SystemMessage key={idx} {...message} />;
        })}
        {isLoading && (
          <MessageLayout role="system">
            <Spinner />
          </MessageLayout>
        )}
      </div>
      <form
        className="flex gap-2 px-2 py-4 border rounded bg-slate-50"
        onSubmit={handleChatSubmit}
      >
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
