import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { Conversation, db } from "../database";
import { ConversationsKey } from "./keys";

export const useGetConversations = (
  options?: UseQueryOptions<Conversation[], unknown>
) => {
  return useQuery<Conversation[], unknown>({
    queryFn: () => {
      return db.conversations.toArray();
    },
    queryKey: ConversationsKey,
    ...options,
  });
};
