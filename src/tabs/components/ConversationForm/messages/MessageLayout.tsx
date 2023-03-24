import { ReactNode } from "react";

interface MessageLayoutProps {
  className?: string;
  children: ReactNode;
}

export const MessageLayout = ({ className, children }: MessageLayoutProps) => {
  return <div className={className}>{children}</div>;
};
