import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { ChatCompletionRequestMessage } from "openai";
import { db } from "../database";
import { PromiseExtended } from "dexie";

interface CreateConversationBody {
  title: string;
  messages: ChatCompletionRequestMessage[];
}

export const useCreateConversationMutation = (
  options?: UseMutationOptions<
    PromiseExtended<number>,
    unknown,
    CreateConversationBody
  >
) => {
  return useMutation(
    ["title"],
    ({ title, messages }) => {
      return db.createConversation(title, messages).then();
    },
    options
  );
};
