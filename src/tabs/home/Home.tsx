import { PageAnimateLayout } from "../components/PageAnimateLayout";

import { ConversationForm } from "../components/ConversationForm";

export const Home = () => {
  return (
    <PageAnimateLayout className="h-full">
      <ConversationForm />
    </PageAnimateLayout>
  );
};
