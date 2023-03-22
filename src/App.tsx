import { useCallback, useState } from "react";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/api/notification";
import { useAtom } from "jotai/react";
import { settingsAtom, settingsStore } from "./settings";
import { openaiAtom, openaiStore } from "./api/openai";
import { Route, Routes } from "react-router-dom";
import { Prompts } from "./tabs/prompt";
import { Settings } from "./tabs/settings";
import { Layout } from "./Layout";
import { Home } from "./tabs/home";

const hasNotificationPermissions = await isPermissionGranted();

function App() {
  const [name, setName] = useState("");
  const [canBeNotified, setCanBeNotified] = useState(
    hasNotificationPermissions
  );
  const [isRequestingNotifyPermissions, setIsRequestingNotifyPermissions] =
    useState(false);
  const [settings, setSettings] = useAtom(settingsAtom, {
    store: settingsStore,
  });
  const [apiClient, _] = useAtom(openaiAtom, { store: openaiStore });

  console.log(apiClient);

  console.log(settings);

  const handleRequestPermissions = useCallback(async () => {
    setIsRequestingNotifyPermissions(true);
    const permission = await requestPermission();
    setIsRequestingNotifyPermissions(false);
    return permission === "granted";
  }, []);

  const handleSendNotification = useCallback(async () => {
    if (await isPermissionGranted()) {
      sendNotification({ title: "TEST", body: "gottem" });
    }
  }, []);

  // async function greet() {
  //   // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  //   setGreetMsg(await invoke("greet", { name }));
  // }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/prompts" element={<Prompts />} />
        <Route path="/settings" element={<Settings />} />
        {/* {canBeNotified ? (
        <div>
          You can be notified!
          <button onClick={handleSendNotification}>HERE</button>
        </div>
      ) : (
        <button
          onClick={handleRequestPermissions}
          disabled={isRequestingNotifyPermissions}
        >
          Request Permission
        </button>
      )} */}
      </Route>
    </Routes>
  );
}

export default App;
