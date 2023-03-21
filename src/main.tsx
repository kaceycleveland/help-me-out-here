import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "jotai";
import App from "./App";
import "./windowScript";
import "./styles.css";
import { ApiClientProvider } from "./api";
import { settingsStore } from "./settings";
import { openaiStore } from "./api/openai";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={settingsStore}>
      <Provider store={openaiStore}>
        <ApiClientProvider>
          <App />
        </ApiClientProvider>
      </Provider>
    </Provider>
  </React.StrictMode>
);
