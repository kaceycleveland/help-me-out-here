import { emit, listen, type UnlistenFn } from "@tauri-apps/api/event";
import { atom, createStore } from "jotai";
import { ChatCompletionResponseMessage } from "openai";
import {
  TEXT_CHANGED,
  IMAGE_CHANGED,
  listenText,
  listenImage,
} from "tauri-plugin-clipboard-api";
import {
  ConversationData,
  createAssistantMessageEntry,
  createUserMessageEntry,
  db,
  MessageEntry,
  requestChatCompletion,
} from "../api";

export const clipboardStore = createStore();
export const conversationIdAtom = atom<number | undefined>(undefined);
export const conversationResultAtom = atom<MessageEntry | undefined>(undefined);

let listenTextContent = "";
let listenImageContent = "";
let tauriTextUnlisten: UnlistenFn;
let tauriImageUnlisten: UnlistenFn;
let textUnlisten: () => void;
let imageUnlisten: () => void;

export async function startListening() {
  tauriTextUnlisten = await listen(TEXT_CHANGED, (event) => {
    console.log(event);
    const payload: any = event.payload;
    if (typeof payload.value === "string") {
      const conversationId = clipboardStore.get(conversationIdAtom);
      console.log("MESSAGES Convo", conversationId);
      if (conversationId) {
        db.getConversation(conversationId).then((conversationData) => {
          const passedMessages = [
            ...conversationData.messages,
            createUserMessageEntry(payload.value, conversationData),
          ];
          requestChatCompletion(passedMessages).then((result) => {
            console.log(result.data.choices[0].message);
            if (result.data.choices[0].message) {
              clipboardStore.set(
                conversationResultAtom,
                createAssistantMessageEntry(
                  result.data.choices[0].message.content,
                  conversationData
                )
              );
            }
          });
        });
      }
      listenTextContent = (event.payload as any).value;
    }
  });
  tauriImageUnlisten = await listen(IMAGE_CHANGED, (event) => {
    console.log(event);
    listenImageContent = (event.payload as any).value;
  });
  imageUnlisten = listenImage();
  textUnlisten = listenText();
}

function stopListening() {
  imageUnlisten();
  textUnlisten();
  tauriTextUnlisten();
  tauriImageUnlisten();
}

startListening();
