import { Route, Routes } from "react-router";
import HUDPage from "./pages/HUD/HUDPage";
import SettingsPage from "./pages/Settings/SettingsPage";
import HomePage from "./pages/Home/HomePage";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/hud" element={<HUDPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<HomePage />} />
        </Routes>
    );
};

export default App;
