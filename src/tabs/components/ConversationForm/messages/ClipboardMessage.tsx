import { ReactNode } from "react";
import { MessageLayout } from "./MessageLayout";
import { MessageEntry } from "../../../../api";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

interface ClipboardMessageProps extends Omit<MessageEntry, "content"> {
  content: string;
}

// Write me a react component with tailwindcss that is styled like a button with a hover effect

export const ClipboardMessage = ({
  role,
  content,
  ...rest
}: ClipboardMessageProps) => {
  return (
    <div className="sticky bottom-0 bg-white border rounded mt-4 drop-shadow-lg">
      <MessageLayout role="Clipboard" {...rest} className=" bg-slate-200">
        <div className="overflow-auto">
          <ReactMarkdown children={content} />
        </div>
      </MessageLayout>
    </div>
  );
};
