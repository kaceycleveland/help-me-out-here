import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "jotai";
import "./clipboard";
// import App from "./App";
import "./windowScript";
import "./styles.css";
import { ApiClientProvider } from "./api";
import { settingsStore } from "./settings";
import { openaiStore } from "./api/openai";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  conversationLoader,
  Conversations,
  ConversationView,
  conversationViewLoader,
} from "./tabs/conversations";
import { Settings } from "./tabs/settings";
import { Layout } from "./Layout";
import { Home } from "./tabs/home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "conversations",
        loader: conversationLoader,
        element: <Conversations />,
        errorElement: <div>Test Conversation Error</div>,
      },
      {
        path: "conversations/:id",
        loader: conversationViewLoader,
        element: <ConversationView />,
        errorElement: <div>Test Conversation View Error</div>,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
    errorElement: <div>Test Errror</div>,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={settingsStore}>
      <Provider store={openaiStore}>
        <ApiClientProvider>
          <RouterProvider
            router={router}
            fallbackElement={<div>Loading...</div>}
          />
        </ApiClientProvider>
      </Provider>
    </Provider>
  </React.StrictMode>
);
