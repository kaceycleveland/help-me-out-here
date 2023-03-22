import { useState, useCallback } from "react";
import { Button, TextInput } from "flowbite-react";
import { useChatMutation } from "../../api/hooks";
import { useForm } from "react-hook-form";

export const Home = () => {
  const [responseData, setResponseData] = useState("");
  const { mutateAsync: submitChat, isLoading } = useChatMutation({
    onSuccess: (data) => {
      console.log(data);
      if (data.data.choices.length && data.data.choices[0].message) {
        setResponseData(data.data.choices[0].message.content);
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
  return (
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
  );
};
