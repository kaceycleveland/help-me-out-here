import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { ChatCompletionRequestMessage } from "openai";
import { db, MessageEntry } from "../database";
import { PromiseExtended } from "dexie";

interface SaveConversationBody {
  conversationId: number;
  title: string;
  messages: MessageEntry[];
}

export const useUpdateConversationMutation = (
  options?: UseMutationOptions<
    PromiseExtended<number>,
    unknown,
    SaveConversationBody
  >
) => {
  return useMutation(
    ["title"],
    ({ conversationId, title, messages }) => {
      return db.updateConversation(conversationId, title, messages).then();
    },
    options
  );
};
