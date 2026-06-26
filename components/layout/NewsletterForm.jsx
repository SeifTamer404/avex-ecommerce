"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | success | error

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }
    // TODO: wire up real subscription API
    setStatus("success");
    setEmail("");
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 rounded-lg px-4 py-3">
        <span className="material-symbols-outlined text-[var(--color-primary)] text-xl">
          check_circle
        </span>
        <p className="text-sm text-[var(--color-inverted-bg)]/80 font-medium">
          You&apos;re subscribed — welcome aboard!
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
      <Input
        type="email"
        icon="mail"
        iconPosition="left"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (status === "error") setStatus("idle");
        }}
        error={status === "error" ? "Please enter a valid email address." : undefined}
        aria-label="Email address for newsletter"
        id="footer-newsletter-email"
      />
      <Button type="primary" size="sm" onClick={handleSubmit}>
        <span className="material-symbols-outlined text-base mr-1.5">send</span>
        Subscribe
      </Button>
    </form>
  );
}
