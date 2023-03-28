import { LoaderFunctionArgs, Params, useLoaderData } from "react-router-dom";
import { db, queryClient } from "../../api";
import { ConversationKey } from "../../api/hooks/keys";
import { useGetConversation } from "../../api/hooks/useGetConversation";
import { ConversationFormEdit } from "../components/ConversationForm";
import { PageAnimateLayout } from "../components/PageAnimateLayout";

export const conversationViewLoader = async ({
  params,
}: LoaderFunctionArgs) => {
  if (params.id) {
    const conversation = await db.getConversation(parseInt(params.id));
    queryClient.setQueryData(
      ConversationKey(conversation.id),
      () => conversation
    );
    return conversation;
  }
};

export const ConversationView = () => {
  const conversationData = useLoaderData() as Awaited<
    ReturnType<typeof conversationViewLoader>
  >;

  const { data } = useGetConversation(conversationData?.id, {
    initialData: conversationData,
  });

  if (!data) {
    return <div>No Data</div>;
  }
  return (
    <PageAnimateLayout className="h-full">
      <ConversationFormEdit conversationId={data.id} />
    </PageAnimateLayout>
  );
};
