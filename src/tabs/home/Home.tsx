import { PageAnimateLayout } from "../components/PageAnimateLayout";

import { ConversationFormCreate } from "../components/ConversationForm";

export const Home = () => {
  return (
    <PageAnimateLayout className="h-full">
      <ConversationFormCreate />
    </PageAnimateLayout>
  );
};
