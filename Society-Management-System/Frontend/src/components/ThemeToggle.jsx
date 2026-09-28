import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

const getInitialTheme = () => {
  const saved = localStorage.getItem("society-theme");
  if (saved === "dark" || saved === "light") return saved;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export default function ThemeToggle() {
  const [theme, setTheme] = useState(getInitialTheme);
  const dark = theme === "dark";

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    root.classList.toggle("dark", dark);
    root.dataset.theme = theme;
    body.classList.toggle("theme-dark", dark);
    body.classList.toggle("theme-light", !dark);
    localStorage.setItem("society-theme", theme);
  }, [theme, dark]);

  return (
    <button
      type="button"
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      title={dark ? "Light theme" : "Dark theme"}
      onClick={() => setTheme((value) => (value === "dark" ? "light" : "dark"))}
      className="theme-toggle flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-all duration-300"
    >
      {dark ? <FaSun /> : <FaMoon />}
      <span className="hidden sm:inline">{dark ? "Light" : "Dark"}</span>
    </button>
  );
}
