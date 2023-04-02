import { MessageEntry } from "../../../../api";
import { MessageLayout } from "./MessageLayout";
import { Markdown } from "@components/Markdown";

export const UserMessage = ({ content, ...rest }: MessageEntry) => {
  return (
    <MessageLayout {...rest} className="bg-gray-200 whitespace-pre-wrap">
      <Markdown children={content} />
    </MessageLayout>
  );
};
