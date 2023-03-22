import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "jotai";
import App from "./App";
import "./windowScript";
import "./styles.css";
import { ApiClientProvider } from "./api";
import { settingsStore } from "./settings";
import { openaiStore } from "./api/openai";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={settingsStore}>
      <Provider store={openaiStore}>
        <ApiClientProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ApiClientProvider>
      </Provider>
    </Provider>
  </React.StrictMode>
);
