import { LoaderFunctionArgs, Params, useLoaderData } from "react-router-dom";
import { db } from "../../api";
import { ConversationForm } from "../components/ConversationForm";
import { PageAnimateLayout } from "../components/PageAnimateLayout";

export const conversationViewLoader = ({ params }: LoaderFunctionArgs) => {
  if (params.id) return db.getConversation(parseInt(params.id));
};

export const ConversationView = () => {
  const conversationData = useLoaderData() as Awaited<
    ReturnType<typeof conversationViewLoader>
  >;

  if (!conversationData) {
    return <div>No Data</div>;
  }
  return (
    <PageAnimateLayout className="h-full">
      <ConversationForm
        title={conversationData.title}
        created={conversationData.created}
        initMessages={conversationData.messages.map(
          ({ conversationId, id, ...rest }) => rest
        )}
        conversationId={conversationData.id}
      />
    </PageAnimateLayout>
  );
};
