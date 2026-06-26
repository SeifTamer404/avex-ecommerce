"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();

  const [fields, setFields] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ── Field helpers ─────────────────────────────────────────────────────────
  const set = (key) => (e) => {
    setFields((prev) => ({ ...prev, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
    setGlobalError("");
  };

  // ── Client-side validation ────────────────────────────────────────────────
  function validate() {
    const errs = {};
    if (!fields.name.trim()) errs.name = "Name is required.";
    if (!fields.email) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
      errs.email = "Enter a valid email address.";
    if (!fields.password) errs.password = "Password is required.";
    else if (fields.password.length < 8)
      errs.password = "Password must be at least 8 characters.";
    return errs;
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setIsLoading(true);
    setGlobalError("");

    const { error } = await authClient.signUp.email({
      name: fields.name.trim(),
      email: fields.email,
      password: fields.password,
    });

    setIsLoading(false);

    if (error) {
      // Map server error messages to the right field when possible
      const msg = error.message || "Something went wrong. Please try again.";
      if (msg.toLowerCase().includes("email")) {
        setErrors({ email: msg });
      } else {
        setGlobalError(msg);
      }
      return;
    }

    router.push("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Card */}
      <div
        className="w-full max-w-md rounded-2xl border border-[var(--color-outline-variant)] bg-[var(--color-surface-low)] shadow-xl p-8 flex flex-col gap-6"
      >
        {/* Logo */}
        <div className="flex justify-center">
          <Link href="/">
            <Image src="/logo.png" alt="AVEX" width={80} height={27} priority />
          </Link>
        </div>

        {/* Heading */}
        <div className="text-center">
          <h1 className="text-2xl font-extrabold font-display tracking-tight text-[var(--color-inverted-bg)]">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-[var(--color-inverted-bg)]/50">
            Join AVEX and start shopping today
          </p>
        </div>

        {/* Global error */}
        {globalError && (
          <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
            <span className="material-symbols-outlined text-red-500 text-base mt-0.5">
              error
            </span>
            <p className="text-sm text-red-500">{globalError}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <Input
            label="Full name"
            icon="person"
            iconPosition="left"
            placeholder="Enter your full name"
            value={fields.name}
            onChange={set("name")}
            error={errors.name}
            autoComplete="name"
            id="register-name"
          />
          <Input
            label="Email address"
            type="email"
            icon="mail"
            iconPosition="left"
            placeholder="you@example.com"
            value={fields.email}
            onChange={set("email")}
            error={errors.email}
            autoComplete="email"
            id="register-email"
          />
          <Input
            label="Password"
            type="password"
            icon="lock"
            iconPosition="left"
            placeholder="Min. 8 characters"
            value={fields.password}
            onChange={set("password")}
            error={errors.password}
            autoComplete="new-password"
            id="register-password"
          />

          <Button
            type="primary"
            size="sm"
            isLoading={isLoading}
            onClick={handleSubmit}
            className="mt-2 w-full"
          >
            Create account
          </Button>
        </form>

        {/* Footer link */}
        <p className="text-center text-sm text-[var(--color-inverted-bg)]/50">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[var(--color-primary)] font-semibold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
