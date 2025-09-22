"use client";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Topbar({ onExport }) {
  return (
    <header
      className="sticky top-0 z-30 backdrop-blur border-b"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          {/* Brand logo switched to your JPG in /public */}
          <img
            src="/next.jpg"
            alt="PromptPilot by Maaz Ansari"
            className="h-7 w-auto rounded-md"
          />
          <span className="font-semibold tracking-wide">PromptPilot</span>
          <span className="badge">v1</span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <button
            className="btn"
            onClick={() => document.querySelector("#cmdk")?.focus?.()}
          >
            ⌘K <span className="hidden sm:inline">Command</span>
          </button>
          <button className="btn" onClick={onExport}>
            Export
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
