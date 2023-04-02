import { MessageLayout } from "./MessageLayout";
import { MessageEntry } from "../../../../api";
import { Markdown } from "@components/Markdown";

interface AssistantMessageProps extends Omit<MessageEntry, "content"> {
  content: string;
}

export const AssistantMessage = ({
  content,
  ...rest
}: AssistantMessageProps) => {
  return (
    <MessageLayout {...rest} className=" bg-blue-50 whitespace-pre-wrap">
      <Markdown children={content} />
    </MessageLayout>
  );
};
