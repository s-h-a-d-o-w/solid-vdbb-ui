import { createEffect, createSignal, onMount } from "solid-js";

function applyTheme(isDark: boolean) {
  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

function getInitialDarkMode(): boolean {
  if (typeof window === "undefined") return false;

  const stored = localStorage.getItem("darkMode");
  if (stored !== null) {
    return JSON.parse(stored);
  }

  return window?.matchMedia?.("(prefers-color-scheme: dark)").matches || false;
}

export function ThemeToggle() {
  const [darkMode, setDarkMode] = createSignal(false);

  onMount(() => {
    const initialDarkMode = getInitialDarkMode();
    setDarkMode(initialDarkMode);
    applyTheme(initialDarkMode);
  });

  createEffect(() => {
    const isDark = darkMode();
    localStorage.setItem("darkMode", JSON.stringify(isDark));
    applyTheme(isDark);
  });

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode();
    setDarkMode(newDarkMode);
  };

  return (
    <label class="print:hidden inline-flex items-center cursor-pointer">
      <div class="relative">
        <input
          type="checkbox"
          class="sr-only"
          checked={darkMode()}
          onChange={toggleDarkMode}
          aria-label="Toggle dark mode"
        />
        <div
          class={`block w-12 h-6 rounded-full ${darkMode() ? "border-2 border-primary" : "border-2 border-gray-300"}`}
        ></div>
        <div class="absolute inset-0 flex items-center justify-between px-1.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-3 w-3 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-3 w-3 text-black"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div
          class={`absolute top-1 bg-gray-300 dark:bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${darkMode() ? "transform translate-x-7" : "left-1"}`}
        ></div>
      </div>
    </label>
  );
}
