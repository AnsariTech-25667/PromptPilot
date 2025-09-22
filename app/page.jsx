// app/prompts/page.jsx
'use client';

import { useEffect, useState } from 'react';

export const metadata = {
  title: 'Saved Prompts • PromptPilot',
  description: 'Your reusable prompt snippets and recent items.',
};

export default function SavedPromptsPage() {
  const [items, setItems] = useState([
    { title: 'Lead generation email', tag: 'business', when: 'Yesterday' },
    { title: 'Basic legal contract', tag: 'legal', when: '2 days ago' },
  ]);

  // Later: replace with a real fetch from /api/prompts
  useEffect(() => {
    // Example:
    // fetch('/api/prompts')
    //   .then(r => r.json())
    //   .then(d => setItems(d.prompts || []))
    //   .catch(() => {});
  }, []);

  return (
    <main className="max-w-4xl mx-auto px-6 py-10 text-[var(--brand-fg)]">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Saved Prompts</h1>
        <p className="opacity-70 mt-1 text-sm">
          Quick access to prompts you reuse often.
        </p>
      </header>

      {items.length === 0 ? (
        <div className="card p-6">
          <p className="opacity-80">
            No saved prompts yet. Craft a great one in chat, then add it here.
          </p>
        </div>
      ) : (
        <section className="grid gap-4">
          {items.map((p, i) => (
            <article key={i} className="card p-4">
              <h2 className="text-xl font-semibold">{p.title}</h2>
              <div className="mt-2 flex items-center gap-2">
                <span className="badge capitalize">{p.tag}</span>
                <span className="text-sm opacity-70">{p.when}</span>
              </div>
            </article>
          ))}
        </section>
      )}

      <footer className="mt-10 text-sm opacity-70">
        Designed &amp; Built by Maaz Ansari
      </footer>
    </main>
  );
}
