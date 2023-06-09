import { MessageLayout } from "./MessageLayout";
import { MessageEntry } from "../../../../api";
import { Markdown } from "@components/Markdown";

interface SystemMessageProps extends Omit<MessageEntry, "content"> {
  content: string;
}

export const SystemMessage = ({ content, ...rest }: SystemMessageProps) => {
  return (
    <MessageLayout {...rest} className=" bg-slate-200 whitespace-pre-wrap">
      <Markdown children={content} />
    </MessageLayout>
  );
};
