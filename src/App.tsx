import { Route, Routes, useLocation } from "react-router-dom";
import { Prompts } from "./tabs/prompt";
import { Settings } from "./tabs/settings";
import { Layout } from "./Layout";
import { Home } from "./tabs/home";
function App() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/prompts" element={<Prompts />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
