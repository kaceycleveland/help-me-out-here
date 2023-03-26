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
        ({ created, updated, conversationId, ...rest }) => rest
      );
      console.log("calling chat mutation...");
      return openaiStore.get(openaiAtom).createChatCompletion({
        model: "gpt-3.5-turbo",
        messages,
        temperature: 0.7,
        max_tokens: 64,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      });
    },
    ...options,
  });
};
