import { Button } from "flowbite-react";
import { Outlet, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { MinusIcon, WindowIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { appWindow } from "@tauri-apps/api/window";

interface NavButtonProps {
  title: string;
  path: string;
}

const buttons: NavButtonProps[] = [
  { title: "Home", path: "/" },
  { title: "Conversations", path: "/conversations" },
  { title: "Settings", path: "/settings" },
];

export const Layout = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-full bg-transparent">
      <div
        data-tauri-drag-region
        className="h-7 bg-slate-600 flex items-center justify-end gap-2 p-1"
      >
        <div
          onClick={() => appWindow.minimize()}
          className="cursor-pointer w-5 hover:text-white"
          id="titlebar-minimize"
        >
          <MinusIcon />
        </div>
        <div
          onClick={() => appWindow.toggleMaximize()}
          className="cursor-pointer w-5 hover:text-white"
          id="titlebar-maximize"
        >
          <WindowIcon />
        </div>
        <div
          onClick={() => appWindow.close()}
          className="cursor-pointer w-5 hover:text-white"
          id="titlebar-close"
        >
          <XMarkIcon />
        </div>
      </div>
      <Button.Group className="p-2">
        {buttons.map(({ title, path }, idx) => (
          <Button color="gray" key={idx} onClick={() => navigate(path)}>
            {title}
          </Button>
        ))}
      </Button.Group>
      <div className="bg-slate-300 flex-1 min-h-0 p-2 relative">
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </div>
    </div>
  );
};
