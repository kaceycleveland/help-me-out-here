import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { openaiAtom, openaiStore, requestChatCompletion } from "../openai";
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
    mutationFn: (messageEntries) => requestChatCompletion(messageEntries),
    ...options,
  });
};
