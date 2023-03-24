import { ChatCompletionRequestMessage } from "openai";
import { MessageLayout } from "./MessageLayout";

export const UserMessage = ({
  role,
  content,
}: ChatCompletionRequestMessage) => {
  return (
    <MessageLayout>
      <div>{role}</div>
      <div className="m-1 p-2 bg-cyan-50 rounded">
        <div className="text-cyan-700">{content}</div>
      </div>
    </MessageLayout>
  );
};
