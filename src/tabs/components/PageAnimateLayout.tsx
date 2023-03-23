import { ReactNode } from "react";
import { motion } from "framer-motion";

interface PageAnimateLayoutProps {
  children: ReactNode;
  className?: string;
}
export const PageAnimateLayout = ({
  className,
  children,
}: PageAnimateLayoutProps) => {
  return (
    <motion.main
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.main>
  );
};
