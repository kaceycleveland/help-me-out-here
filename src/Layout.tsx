import { Button, Navbar } from "flowbite-react";
import { Outlet, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import {
  MinusIcon,
  Square2StackIcon,
  WindowIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
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
    <div className="flex flex-col h-full">
      <div
        data-tauri-drag-region
        className="h-7 bg-sky-200 flex items-center justify-end gap-2 p-1"
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
          <Square2StackIcon />
        </div>
        <div
          onClick={() => appWindow.close()}
          className="cursor-pointer w-5 hover:text-white"
          id="titlebar-close"
        >
          <XMarkIcon />
        </div>
      </div>
      <div className="border flex-1 flex flex-col min-h-0 bg-sky-50 p-2">
        <Navbar menuOpen border fluid rounded>
          <Navbar.Toggle />
          <Navbar.Collapse>
            {buttons.map(({ title, path }, idx) => (
              <Navbar.Link
                color="gray"
                key={idx}
                onClick={() => navigate(path)}
              >
                {title}
              </Navbar.Link>
            ))}
          </Navbar.Collapse>
        </Navbar>

        <div className="flex-1 min-h-0 relative">
          <AnimatePresence mode="wait">
            <Outlet />
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
