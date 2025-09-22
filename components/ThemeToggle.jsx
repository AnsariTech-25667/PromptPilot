"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    const saved = localStorage.getItem("pp:theme");
    if (saved) setDark(saved === "dark");
  }, []);
  useEffect(() => {
    localStorage.setItem("pp:theme", dark ? "dark" : "light");
    document.documentElement.style.background = dark ? "var(--brand-bg)" : "#f7f9fc";
    document.body.style.background = dark ? "var(--brand-bg)" : "#f7f9fc";
    document.body.style.color = dark ? "var(--brand-fg)" : "#0c1424";
  }, [dark]);
  return (
    <button className="btn" aria-label="Toggle theme" onClick={()=>setDark(v=>!v)}>
      {dark ? "🌙" : "☀️"}
      <span className="hidden sm:inline">{dark ? "Dark" : "Light"}</span>
    </button>
  );
}
