import { atom, createStore } from "jotai";
import { settingsAtom, settingsStore } from "../../../settings";

export const newConversationStore = createStore();
export const modelBodyAtom = atom(
  settingsStore.get(settingsAtom).defaultModelBody
);
