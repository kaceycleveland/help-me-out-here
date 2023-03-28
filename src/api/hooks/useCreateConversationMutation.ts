import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { ConversationCreateData, db, MessageEntry } from "../database";
import { PromiseExtended } from "dexie";
import { ConversationKey } from "./keys";

export const useCreateConversationMutation = (
  options?: UseMutationOptions<
    PromiseExtended<number>,
    unknown,
    ConversationCreateData
  >
) => {
  const queryClient = useQueryClient();
  let passedOptions = { ...options };
  const passedSuccess = passedOptions.onSuccess;
  passedOptions.onSuccess = (...args) => {
    passedSuccess?.(...args);
    args[0].then((conversationId) => {
      queryClient.invalidateQueries(ConversationKey(conversationId));
    });
  };
  return useMutation({
    mutationKey: ["conversation", "post"],
    mutationFn: (args) => {
      return db.createConversation(...args).then();
    },
    ...passedOptions,
  });
};
