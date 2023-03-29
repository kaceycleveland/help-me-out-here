import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from "openai";
import { atom, createStore } from "jotai";
import { Settings, settingsAtom, settingsStore } from "../settings";
import { ConversationData, MessageEntry } from "./database";

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

export const createUserMessageEntry = (
  message: string,
  conversation: ConversationData
): MessageEntry => {
  return {
    role: ChatCompletionRequestMessageRoleEnum.User,
    content: message,
    created: new Date(),
    updated: new Date(),
    modelBody: conversation.modelBody,
  };
};

export const createAssistantMessageEntry = (
  message: string,
  conversation: ConversationData
): MessageEntry => {
  return {
    role: ChatCompletionRequestMessageRoleEnum.Assistant,
    content: message,
    created: new Date(),
    updated: new Date(),
    modelBody: conversation.modelBody,
  };
};
export const requestChatCompletion = (messageEntries: MessageEntry[]) => {
  const messages = messageEntries.map(
    ({ id, created, updated, conversationId, modelBody, ...rest }) => rest
  );
  return openaiStore.get(openaiAtom).createChatCompletion({
    messages,
    ...messageEntries[messageEntries.length - 1].modelBody,
  });
};
