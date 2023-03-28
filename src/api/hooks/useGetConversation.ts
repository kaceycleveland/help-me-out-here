import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ConversationData, db } from "../database";
import { ConversationKey } from "./keys";

export const useGetConversation = (
  conversationId?: number,
  options?: UseQueryOptions<ConversationData, unknown>
) => {
  return useQuery<ConversationData, unknown>({
    queryFn: () => {
      return db.getConversation(conversationId!);
    },
    queryKey: ConversationKey(conversationId),
    enabled: Boolean(conversationId) ? options?.enabled : false,
    ...options,
  });
};
