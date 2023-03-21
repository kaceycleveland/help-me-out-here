import { useCallback, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/api/notification";
import { useAtom } from "jotai/react";
import { settingsAtom, settingsStore } from "./settings";
import { openaiAtom, openaiStore } from "./api/openai";
import { useForm } from "react-hook-form";
import { useChatMutation } from "./api/hooks";
import { Button } from "flowbite-react";
import { TextInput } from "flowbite-react/lib/esm/components";

const hasNotificationPermissions = await isPermissionGranted();

function App() {
  const [responseData, setResponseData] = useState("");
  const { mutateAsync: submitChat, isLoading } = useChatMutation({
    onSuccess: (data) => {
      console.log(data);
      if (data.data.choices.length && data.data.choices[0].text) {
        setResponseData(data.data.choices[0].text);
      }
    },
  });
  const { register, handleSubmit } = useForm<{ prompt: string }>();
  const handleChatSubmit = useCallback(
    handleSubmit((body) => {
      console.log(body);
      submitChat(body.prompt);
    }),
    [submitChat]
  );
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
    <div className="bg-slate-50 h-full">
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

      <div className="flex flex-col h-full">
        <div className="flex-1 bg-slate-200 p-4 m-2 rounded">
          {isLoading ? <div>Loading</div> : <div>{responseData}</div>}
        </div>
        <form className="flex gap-2 px-2 py-4" onSubmit={handleChatSubmit}>
          <TextInput
            className="flex-1"
            {...register("prompt")}
            placeholder="Enter a prompt"
          />
          <Button type="submit">Submit</Button>
        </form>
      </div>
    </div>
  );
}

export default App;
