import { useState, useMemo, useCallback } from "react";
import { Spinner } from "@components/Spinner";
import { Button } from "@components/Button";
import { useChatMutation } from "../../../api/hooks";
import { Controller, useForm } from "react-hook-form";
import { ChatCompletionRequestMessageRoleEnum } from "openai";
import { ClipboardMessage, SystemMessage, UserMessage } from "./messages";
import { db, MessageEntry, ModelBody } from "../../../api";
import { MessageLayout } from "./messages/MessageLayout";
import { Input } from "@components/Input";
import { ConversationFormHeader } from "./ConversationFormHeader";
import { useAtom, useAtomValue } from "jotai";
import { settingsAtom, settingsStore } from "../../../settings";
import { useGetConversation } from "../../../api/hooks/useGetConversation";
import { clipboardStore, conversationResultAtom } from "../../../clipboard";
import { AssistantMessage } from "./messages/AssistantMessage";
import { TextArea } from "@components/TextArea";

interface ConversationFormProps {
  conversationId?: number;
}

export const ConversationFormEdit = ({
  conversationId,
}: ConversationFormProps) => {
  const conversationState = useGetConversation(conversationId);

  const { defaultModelBody } = useAtomValue(settingsAtom, {
    store: settingsStore,
  });

  const [conversationResult, setConversationResult] = useAtom(
    conversationResultAtom,
    { store: clipboardStore }
  );

  console.log("CONVERSATIONRESULT UPDATE", conversationResult);

  const foundModelBody = useMemo(() => {
    if (conversationState.isSuccess) {
      return conversationState.data.modelBody;
    }
  }, [conversationState.status]);

  const [modelBody, setModelBody] = useState(
    foundModelBody ?? defaultModelBody
  );

  const setModelSettings = useCallback(
    async (modelBody: ModelBody) => {
      if (conversationId) {
        await db.updateConversation(
          conversationId,
          undefined,
          undefined,
          modelBody
        );
        setModelBody(modelBody);
      }
    },
    [conversationId]
  );

  const { mutateAsync: submitChat, isLoading: isChatLoading } = useChatMutation(
    {
      onSuccess: (data, prevMessages) => {
        if (
          conversationState.isSuccess &&
          data.data.choices.length &&
          data.data.choices[0].message
        ) {
          const { id: conversationId, title } = conversationState.data;
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
          console.log("returned", messages);
          db.updateConversation(conversationId!, title, messages, modelBody);
        }
      },
    }
  );
  const { register, control, handleSubmit, reset } = useForm<{
    prompt: string;
    isSystem?: boolean;
  }>();
  const handleChatSubmit = useCallback(
    handleSubmit(({ prompt, isSystem }) => {
      console.log("SUBMIT", prompt, isSystem);
      if (!prompt) return;
      if (conversationState.isSuccess) {
        const newResponseData = [
          ...conversationState.data.messages,
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
        // submitChat(newResponseData);
        return newResponseData;
      }
    }),
    [handleSubmit, reset, submitChat, modelBody, conversationState.status]
  );

  const isLoading = Boolean(
    conversationId && (conversationState.isLoading || isChatLoading)
  );

  return (
    <div className="flex flex-col h-full">
      <ConversationFormHeader
        conversationId={conversationId}
        modelSettings={modelBody}
        setModelSettings={setModelSettings}
      />
      <div className="relative min-h-0 grow p-4 overflow-auto flex flex-col-reverse gap-2">
        <div>
          {conversationState.data?.messages.map((message, idx) => {
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
          {conversationResult && <ClipboardMessage {...conversationResult} />}
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
