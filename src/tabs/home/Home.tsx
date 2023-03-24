import { useState, useCallback } from "react";
import { Button, TextInput } from "flowbite-react";
import { useChatMutation } from "../../api/hooks";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { PageAnimateLayout } from "../components/PageAnimateLayout";
import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
} from "openai";
import { SystemMessage, UserMessage } from "./messages";

export const Home = () => {
  const [responseData, setResponseData] = useState<
    ChatCompletionRequestMessage[]
  >([]);
  console.log(responseData);
  const { mutateAsync: submitChat, isLoading } = useChatMutation({
    onSuccess: (data, entry) => {
      console.log("entry", entry);
      if (data.data.choices.length && data.data.choices[0].message) {
        setResponseData([
          ...entry,
          { role: "system", content: data.data.choices[0].message.content },
        ]);
      }
    },
  });
  const { register, handleSubmit } = useForm<{ prompt: string }>();
  const handleChatSubmit = useCallback(
    handleSubmit((body) => {
      console.log(body);
      setResponseData((prevResponseData) => {
        const newResponseData = [
          ...prevResponseData,
          {
            role: ChatCompletionRequestMessageRoleEnum.User,
            content: body.prompt,
          },
        ];
        submitChat(newResponseData);
        return newResponseData;
      });
    }),
    [handleSubmit, submitChat]
  );
  return (
    <PageAnimateLayout className="h-full">
      <div className="flex flex-col h-full">
        <div className="min-h-0 grow bg-slate-200 p-4 m-2 rounded overflow-auto">
          {responseData.map((message) => {
            if (message.role === ChatCompletionRequestMessageRoleEnum.User)
              return <UserMessage {...message} />;
            if (message.role === ChatCompletionRequestMessageRoleEnum.System)
              return <SystemMessage {...message} />;

            return (
              <div>
                <div>{message.role}</div>
                <div className="m-1 p-2 bg-cyan-50 rounded">
                  {message.content}
                </div>
              </div>
            );
          })}
          {isLoading && (
            <SystemMessage
              role={ChatCompletionRequestMessageRoleEnum.System}
              content="Loading..."
            />
          )}
        </div>
        <form className="flex gap-2 px-2 py-4" onSubmit={handleChatSubmit}>
          <TextInput
            className="flex-1"
            {...register("prompt")}
            placeholder="Enter a prompt"
            disabled={isLoading}
          />
          <Button type="submit">Submit</Button>
        </form>
      </div>
    </PageAnimateLayout>
  );
};
