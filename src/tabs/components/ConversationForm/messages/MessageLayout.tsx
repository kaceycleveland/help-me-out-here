import { ReactNode } from "react";
import { MessageEntry } from "../../../../api";
import { formatDate } from "../../../../utils/dateUtils";

interface MessageLayoutProps {
  className?: string;
  children: ReactNode;
  role?: string;
  created?: Date;
}

export const MessageLayout = ({
  className,
  children,
  role,
  created,
}: MessageLayoutProps) => {
  return (
    <div>
      <div className="flex justify-between items-end px-2">
        <div className="font-semibold capitalize">{role}</div>
        {created && <div className="text-xs">{formatDate(created)}</div>}
      </div>
      <div className={"m-1 p-2 border rounded " + className ?? ""}>
        {children}
      </div>
    </div>
  );
};
