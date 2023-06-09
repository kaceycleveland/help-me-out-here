import { useState, useCallback } from "react";
import { Spinner } from "@components/Spinner";
import { Button } from "@components/Button";
import { useChatMutation } from "../../../api/hooks";
import { Controller, useForm } from "react-hook-form";
import { ChatCompletionRequestMessageRoleEnum } from "openai";
import { SystemMessage, UserMessage } from "./messages";
import { CreateConversationModal } from "../CreateConversationModal";
import { db, MessageEntry } from "../../../api";
import { MessageLayout } from "./messages/MessageLayout";
import { formatDate } from "../../../utils/dateUtils";
import { Input } from "@components/Input";
import { ConversationFormHeader } from "./ConversationFormHeader";
import { atom, useAtom } from "jotai";
import { modelBodyAtom, newConversationStore } from "./ConversationFormState";
import { AssistantMessage } from "./messages/AssistantMessage";
import { TextArea } from "@components/TextArea";

const conversationAtom = atom<MessageEntry[]>([]);

export const ConversationFormCreate = () => {
  const [responseData, setResponseData] = useAtom(conversationAtom, {
    store: newConversationStore,
  });

  console.log("response data", responseData);
  const [modelBody, setModelBody] = useAtom(modelBodyAtom, {
    store: newConversationStore,
  });

  const resetConversation = useCallback(() => {
    newConversationStore.set(conversationAtom, conversationAtom.init);
    newConversationStore.set(modelBodyAtom, modelBodyAtom.init);
  }, []);

  const { mutateAsync: submitChat, isLoading: isChatLoading } = useChatMutation(
    {
      onSuccess: (data, prevMessages) => {
        if (data.data.choices.length && data.data.choices[0].message) {
          const messages: MessageEntry[] = [
            ...prevMessages,
            {
              created: new Date(),
              updated: new Date(),
              content: data.data.choices[0].message.content,
              role: data.data.choices[0].message.role,
              modelBody,
            },
          ];
          setResponseData(messages);
          console.log("returned", messages);
        }
      },
    }
  );
  const { register, handleSubmit, control, reset } = useForm<{
    prompt: string;
    isSystem?: boolean;
  }>();
  const handleChatSubmit = useCallback(
    handleSubmit(({ prompt, isSystem }) => {
      console.log("SUBMIT", prompt, isSystem);
      if (!prompt) return;
      const newResponseData = [
        ...responseData,
        {
          role: isSystem
            ? ChatCompletionRequestMessageRoleEnum.System
            : ChatCompletionRequestMessageRoleEnum.User,
          content: prompt,
          created: new Date(),
          updated: new Date(),
          modelBody,
        },
      ];
      reset({ isSystem });
      setResponseData(newResponseData);
      submitChat(newResponseData);
      return newResponseData;
    }),
    [responseData, handleSubmit, reset, submitChat, modelBody]
  );

  const isLoading = Boolean(isChatLoading);

  return (
    <div className="flex flex-col h-full">
      <ConversationFormHeader
        messages={responseData}
        modelSettings={modelBody}
        setModelSettings={setModelBody}
      >
        <Button onClick={resetConversation}>Reset</Button>
      </ConversationFormHeader>
      <div className="min-h-0 grow p-4 overflow-auto flex flex-col-reverse gap-2">
        <div>
          {responseData.map((message, idx) => {
            if (message.role === ChatCompletionRequestMessageRoleEnum.User)
              return <UserMessage key={idx} {...message} />;
            if (message.role === ChatCompletionRequestMessageRoleEnum.System)
              return <SystemMessage key={idx} {...message} />;
            if (message.role === ChatCompletionRequestMessageRoleEnum.Assistant)
              return <AssistantMessage key={idx} {...message} />;
          })}
          {isLoading && (
            <MessageLayout role="system">
              <Spinner />
            </MessageLayout>
          )}
        </div>
      </div>
      <form
        className="flex gap-2 px-2 py-4 border rounded bg-slate-50"
        onSubmit={handleChatSubmit}
      >
        <TextArea
          className="flex-1"
          {...register("prompt")}
          placeholder="Enter a prompt"
          disabled={isLoading}
        />

        <Controller
          name="isSystem"
          control={control}
          render={({ field }) => {
            const { value, ...rest } = field;
            const val = value?.toString();
            return <input type="checkbox" value={val} {...rest} />;
          }}
        />
        <Button type="submit" disabled={isLoading}>
          Send
        </Button>
      </form>
    </div>
  );
};
