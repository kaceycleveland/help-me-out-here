import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { openaiAtom, openaiStore } from "../openai";
import { CreateCompletionResponse } from "openai";
import { AxiosResponse } from "axios";

export const useChatMutation = (
  options?: UseMutationOptions<
    AxiosResponse<CreateCompletionResponse>,
    unknown,
    string
  >
) => {
  return useMutation((prompt) => {
    return openaiStore.get(openaiAtom).createCompletion({
      model: "text-davinci-003",
      prompt: `Summarize this for a second-grade student:\n\n${prompt}`,
      temperature: 0.7,
      max_tokens: 64,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
  }, options);
};
