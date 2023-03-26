import { ReactNode } from "react";
import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
} from "openai";
import { MessageLayout } from "./MessageLayout";
import { MessageEntry } from "../../../../api";

interface SystemMessageProps extends Omit<MessageEntry, "content"> {
  content: ReactNode | string;
}

export const SystemMessage = ({ content, ...rest }: SystemMessageProps) => {
  return (
    <MessageLayout {...rest} className=" bg-slate-200">
      <div className="">{content}</div>
    </MessageLayout>
  );
};
