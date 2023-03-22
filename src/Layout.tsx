import { Button } from "flowbite-react";
import { Outlet, useNavigate } from "react-router-dom";

interface NavButtonProps {
  title: string;
  path: string;
}

const buttons: NavButtonProps[] = [
  { title: "Home", path: "/" },
  { title: "Prompts", path: "/prompts" },
  { title: "Settings", path: "/settings" },
];

export const Layout = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-transparent">
      <Button.Group className="p-2">
        {buttons.map(({ title, path }, idx) => (
          <Button color="gray" key={idx} onClick={() => navigate(path)}>
            {title}
          </Button>
        ))}
      </Button.Group>
      <div className="bg-slate-300 flex-1 p-2">
        <Outlet />
      </div>
    </div>
  );
};
