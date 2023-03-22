import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { openaiAtom, openaiStore } from "../openai";
import { CreateChatCompletionResponse } from "openai";
import { AxiosResponse } from "axios";

export const useChatMutation = (
  options?: UseMutationOptions<
    AxiosResponse<CreateChatCompletionResponse>,
    unknown,
    string
  >
) => {
  return useMutation((prompt) => {
    return openaiStore.get(openaiAtom).createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Explain things to me like I am in second grade.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 64,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
  }, options);
};
