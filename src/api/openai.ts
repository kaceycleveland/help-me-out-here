import { Configuration, OpenAIApi } from "openai";
import { atom, createStore } from "jotai";
import { Settings, settingsAtom, settingsStore } from "../settings";

export const openaiStore = createStore();

const settings = settingsStore.get(settingsAtom);

const createOpenAiClient = (settings: Settings) => {
  const config = new Configuration({
    organization: settings.openAiOrg,
    apiKey: settings.openAiApiKey,
  });

  return new OpenAIApi(config);
};

export const openaiAtom = atom<OpenAIApi>(createOpenAiClient(settings));

settingsStore.sub(settingsAtom, () => {
  openaiStore.set(
    openaiAtom,
    createOpenAiClient(settingsStore.get(settingsAtom))
  );
  console.log("created new client");
});
