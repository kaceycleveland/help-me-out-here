import { atom, createStore } from "jotai";
import {
  exists,
  writeTextFile,
  BaseDirectory,
  readTextFile,
} from "@tauri-apps/api/fs";
import { ModelBody } from "../api";

export interface Settings {
  openAiApiKey: string;
  openAiOrg: string;
  defaultModelBody: ModelBody;
}

const APP_FILE = "app.conf";
export const settingsStore = createStore();

const initializeSettings = async (
  settings: Settings = {
    openAiApiKey: "",
    openAiOrg: "",
    defaultModelBody: {
      model: "gpt3-3.5-turbo",
      max_tokens: 100,
      presence_penalty: 1,
      frequency_penalty: 1,
    },
  },
  write = false
): Promise<Settings> => {
  const settingsExist = await exists(APP_FILE, {
    dir: BaseDirectory.AppConfig,
  });
  if (!settingsExist || write) {
    console.log("WRITING TO FILE");
    await writeTextFile(APP_FILE, JSON.stringify(settings), {
      dir: BaseDirectory.AppConfig,
    });
  }
  const contents = await readTextFile("app.conf", {
    dir: BaseDirectory.AppConfig,
  });

  return JSON.parse(contents);
};

const settings = await initializeSettings();

console.log(settings);
// await writeTextFile('app.conf', 'file contents', { dir: BaseDirectory.AppConfig });
// const contents = await readTextFile("app.conf", {
//   dir: BaseDirectory.AppConfig,
// });

// console.log(JSON.parse(contents));

export const settingsAtom = atom(settings);

settingsStore.sub(settingsAtom, () => {
  console.log("settings changed");
  initializeSettings(settingsStore.get(settingsAtom), true).then(() => {
    console.log("updated settings");
  });
});
