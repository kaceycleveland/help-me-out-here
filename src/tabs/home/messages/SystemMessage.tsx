import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
} from "openai";
import { MessageLayout } from "./MessageLayout";

export const SystemMessage = ({
  role,
  content,
}: ChatCompletionRequestMessage) => {
  return (
    <MessageLayout>
      <div>{role}</div>
      <div className="m-1 p-2 bg-cyan-50 rounded">
        <div className="text-green-700">{content}</div>
      </div>
    </MessageLayout>
  );
};
