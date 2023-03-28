import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { openaiAtom, openaiStore } from "../openai";
import { CreateChatCompletionResponse } from "openai";
import { AxiosResponse } from "axios";
import { MessageEntry } from "../database";

export const useChatMutation = (
  options?: UseMutationOptions<
    AxiosResponse<CreateChatCompletionResponse>,
    unknown,
    MessageEntry[]
  >
) => {
  return useMutation<
    AxiosResponse<CreateChatCompletionResponse>,
    unknown,
    MessageEntry[]
  >({
    mutationFn: (messageEntries) => {
      const messages = messageEntries.map(
        ({ id, created, updated, conversationId, modelBody, ...rest }) => rest
      );
      console.log("calling chat mutation...");
      return openaiStore.get(openaiAtom).createChatCompletion({
        messages,
        ...messageEntries[messageEntries.length - 1].modelBody,
      });
    },
    ...options,
  });
};
