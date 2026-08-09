"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import type { NewsletterContent } from "@/lib/site-content-defaults";

export function NewsletterForm({ content }: { content: NewsletterContent }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Bir hata oluştu.");
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    }
  };

  if (status === "success") {
    return (
      <p className="text-gold text-sm font-light" role="status">
        {content.success_message}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xs">
      <div className="flex items-center border-b border-cream/25 focus-within:border-gold transition-colors duration-300">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={content.placeholder}
          className="flex-1 min-w-0 bg-transparent py-2.5 text-cream text-sm font-light placeholder:text-cream/35 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          aria-label={content.button_label}
          className="shrink-0 text-cream/50 hover:text-gold transition-colors duration-300 disabled:opacity-40 p-1.5"
        >
          <Send size={15} />
        </button>
      </div>
      {status === "error" && <p className="text-red-400 text-xs mt-2">{error}</p>}
    </form>
  );
}
