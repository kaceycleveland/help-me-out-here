import { MessageEntry } from "../../../../api";
import { MessageLayout } from "./MessageLayout";

export const UserMessage = ({ content, ...rest }: MessageEntry) => {
  return (
    <MessageLayout {...rest} className="bg-gray-200">
      <div className="">{content}</div>
    </MessageLayout>
  );
};
