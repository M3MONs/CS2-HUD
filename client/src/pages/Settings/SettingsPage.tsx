import { useState } from "react";
import { useNavigate } from "react-router";
import { useHudConfig } from "@/hooks/useHudConfig";
import ElementsTab from "./components/ElementsTab";
import ThemesTab from "./components/ThemesTab";

type Tab = "elements" | "themes";

const TABS: { id: Tab; label: string }[] = [
    { id: "elements", label: "HUD Elements" },
    { id: "themes", label: "Themes" },
];

const SettingsPage = () => {
    const navigate = useNavigate();
    const [tab, setTab] = useState<Tab>("elements");
    const { isLoading } = useHudConfig();

    return (
        <div className="min-h-screen bg-neutral-950 px-6 py-8 text-white">
            <div className="mx-auto max-w-2xl">
                <div className="mb-8 flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="rounded-lg p-2 text-white/30 transition hover:bg-white/5 hover:text-white"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path d="M10 13L5 8l5-5" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white">
                            Settings
                        </h1>
                        <p className="text-sm text-white/30">Configure your HUD layout and themes</p>
                    </div>
                    {isLoading && (
                        <span className="ml-auto text-xs text-white/20">Saving…</span>
                    )}
                </div>

                <div className="mb-6 flex gap-1 rounded-xl bg-white/5 p-1">
                    {TABS.map(({ id, label }) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => setTab(id)}
                            className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                                tab === id
                                    ? "bg-white/10 text-white"
                                    : "text-white/40 hover:text-white/60"
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {tab === "elements" && <ElementsTab />}
                {tab === "themes" && <ThemesTab />}
            </div>
        </div>
    );
};

export default SettingsPage;
