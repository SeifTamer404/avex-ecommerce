"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { uiActions } from "@/store/slices/uiSlice";
import { userActions } from "@/store/slices/userSlice";
import {
  updateUserProfile,
  changeUserPassword,
  updateNotificationPreferences,
} from "@/features/user/actions";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { z } from "zod";
import {
  User,
  Lock,
  Bell,
  Eye,
  EyeOff,
  Mail,
  Link as LinkIcon,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";

// Zod schema — validates the NEW password only
const passwordSchema = z
  .string()
  .min(8, "At least 8 characters required")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[a-z]/, "Must contain at least one lowercase letter")
  .regex(/[0-9]/, "Must contain at least one number");

// ── Section header ────────────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, iconBg, title, description }) {
  return (
    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[var(--color-outline-variant)]/50">
      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h2 className="text-lg font-bold font-display text-[var(--color-inverted-bg)]">{title}</h2>
        <p className="text-sm text-[var(--color-inverted-bg)]/55 mt-0.5">{description}</p>
      </div>
    </div>
  );
}

// ── Toggle Switch ─────────────────────────────────────────────────────────────
function ToggleSwitch({ checked, onChange, id }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      id={id}
      onClick={onChange}
      className={`
        relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0
        ${checked ? "bg-[var(--color-primary)]" : "bg-[var(--color-outline-variant)]"}
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50
      `}
    >
      <span
        className={`
          absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm
          transition-transform duration-200
          ${checked ? "translate-x-5" : "translate-x-0"}
        `}
      />
    </button>
  );
}

// ── Password field with show/hide toggle ──────────────────────────────────────
function PasswordInput({ label, value, onChange, error, helperText }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        label={label}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        error={error}
        helperText={helperText}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute right-3 bottom-2.5 text-[var(--color-inverted-bg)]/40 hover:text-[var(--color-inverted-bg)] transition-colors"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
export default function SettingsManager({ initialUser, userId }) {
  const dispatch = useDispatch();

  // ── Personal Info ──────────────────────────────────────────────────────────
  const [personalInfo, setPersonalInfo] = useState({
    name: initialUser.name || "",
    email: initialUser.email || "",
    avatar: initialUser.avatar || "",
  });
  const [isSavingInfo, setIsSavingInfo] = useState(false);

  // ── Security ───────────────────────────────────────────────────────────────
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isSavingPwd, setIsSavingPwd] = useState(false);

  // ── Notifications ──────────────────────────────────────────────────────────
  const [notifPrefs, setNotifPrefs] = useState({
    emailOrderUpdates: initialUser.emailOrderUpdates ?? true,
    emailPromotions: initialUser.emailPromotions ?? false,
    emailNewArrivals: initialUser.emailNewArrivals ?? false,
  });

  // ── Helpers ────────────────────────────────────────────────────────────────
  const notify = (type, message) =>
    dispatch(uiActions.addNotification({ id: `${type}-${Date.now()}`, message, type }));

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleSavePersonalInfo = async (e) => {
    e.preventDefault();
    setIsSavingInfo(true);
    try {
      const updated = await updateUserProfile(userId, {
        name: personalInfo.name.trim(),
        avatar: personalInfo.avatar.trim(),
      });
      // Sync Navbar immediately — no page refresh needed
      dispatch(
        userActions.setUser({
          id: updated._id,
          name: updated.name,
          email: updated.email,
          avatar: updated.avatar,
          role: updated.role,
          points: updated.points,
        })
      );
      notify("success", "Profile updated successfully.");
    } catch {
      notify("error", "Failed to save changes. Please try again.");
    } finally {
      setIsSavingInfo(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    const errs = {};

    if (!passwords.currentPassword) {
      errs.currentPassword = "Current password is required.";
    }

    const parsed = passwordSchema.safeParse(passwords.newPassword);
    if (!parsed.success) {
      errs.newPassword = parsed.error.errors[0].message;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      errs.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(errs).length) {
      setPasswordErrors(errs);
      return;
    }

    setPasswordErrors({});
    setIsSavingPwd(true);
    try {
      await changeUserPassword(passwords.currentPassword, passwords.newPassword);
      notify("success", "Password changed successfully.");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      notify("error", err?.message || "Incorrect current password. Please try again.");
    } finally {
      setIsSavingPwd(false);
    }
  };

  const handleToggleNotif = async (key) => {
    const previousPrefs = { ...notifPrefs };
    const newPrefs = { ...notifPrefs, [key]: !notifPrefs[key] };

    // Optimistic update
    setNotifPrefs(newPrefs);

    try {
      await updateNotificationPreferences(userId, newPrefs);
    } catch {
      setNotifPrefs(previousPrefs); // Revert
      notify("error", "Failed to save preference. Please try again.");
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold font-display tracking-tight text-[var(--color-inverted-bg)]">
          Settings
        </h1>
        <p className="text-[var(--color-inverted-bg)]/55 text-sm mt-1">
          Manage your profile, security, and communication preferences.
        </p>
      </div>

      {/* ── Personal Information ─────────────────────────────────────────── */}
      <section className="bg-[var(--color-surface)] border border-[var(--color-outline-variant)]/50 rounded-3xl p-6 md:p-8 shadow-sm">
        <SectionHeader
          icon={User}
          iconBg="bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
          title="Personal Information"
          description="Update your display name and avatar shown across your account."
        />

        <form onSubmit={handleSavePersonalInfo} className="space-y-5 max-w-lg">
          <Input
            label="Full Name"
            required
            value={personalInfo.name}
            onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
            icon="person"
            iconPosition="left"
          />

          {/* Email — read-only, visually distinct */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--color-inverted-bg)]">
              Email Address
            </label>
            <div className="flex items-center gap-3 px-4 py-2 bg-[var(--color-surface-highest)] rounded-[var(--radius-sm)] opacity-60 cursor-not-allowed border border-dashed border-[var(--color-outline-variant)]">
              <Mail className="w-4 h-4 text-[var(--color-inverted-bg)]/50 shrink-0" />
              <span className="text-sm text-[var(--color-inverted-bg)] flex-1">{personalInfo.email}</span>
              <span className="text-xs font-semibold text-[var(--color-inverted-bg)]/40 uppercase tracking-wide">
                Locked
              </span>
            </div>
            <p className="text-xs text-[var(--color-inverted-bg)]/45">
              Email changes require identity verification — contact support.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--color-inverted-bg)]">
              Avatar URL <span className="text-[var(--color-inverted-bg)]/40 font-normal">(optional)</span>
            </label>
            <div className="flex gap-3 items-start">
              {/* Live preview */}
              <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold text-lg flex items-center justify-center shrink-0 overflow-hidden ring-2 ring-[var(--color-primary)]/20 mt-1">
                {personalInfo.avatar ? (
                  <Image 
                    src={personalInfo.avatar} 
                    alt="Preview" 
                    width={40}
                    height={40}
                    className="w-full h-full object-cover" 
                    onError={(e) => { e.target.style.display = "none"; }} 
                  />
                ) : (
                  (personalInfo.name?.[0] || "A").toUpperCase()
                )}
              </div>
              <div className="flex-1">
                <Input
                  value={personalInfo.avatar}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, avatar: e.target.value })}
                  placeholder="https://example.com/avatar.jpg"
                  icon="link"
                  iconPosition="left"
                  helperText="Direct link to a square image. Shown in your sidebar and navbar."
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="primary"
              size="sm"
              isLoading={isSavingInfo}
              disabled={isSavingInfo}
              onClick={handleSavePersonalInfo}
            >
              {isSavingInfo ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </form>
      </section>

      {/* ── Security ─────────────────────────────────────────────────────── */}
      <section className="bg-[var(--color-surface)] border border-[var(--color-outline-variant)]/50 rounded-3xl p-6 md:p-8 shadow-sm">
        <SectionHeader
          icon={Lock}
          iconBg="bg-emerald-500/10 text-emerald-500"
          title="Change Password"
          description="Use a strong password with a mix of letters, numbers, and symbols."
        />

        <form onSubmit={handleSavePassword} className="space-y-5 max-w-lg">
          <PasswordInput
            label="Current Password"
            value={passwords.currentPassword}
            onChange={(e) => {
              setPasswords({ ...passwords, currentPassword: e.target.value });
              setPasswordErrors({ ...passwordErrors, currentPassword: "" });
            }}
            error={passwordErrors.currentPassword}
          />

          <PasswordInput
            label="New Password"
            value={passwords.newPassword}
            onChange={(e) => {
              setPasswords({ ...passwords, newPassword: e.target.value });
              setPasswordErrors({ ...passwordErrors, newPassword: "" });
            }}
            error={passwordErrors.newPassword}
          />

          {/* Strength hints */}
          {passwords.newPassword.length > 0 && (
            <ul className="space-y-1 text-xs pl-1">
              {[
                { ok: passwords.newPassword.length >= 8, text: "At least 8 characters" },
                { ok: /[A-Z]/.test(passwords.newPassword), text: "One uppercase letter" },
                { ok: /[a-z]/.test(passwords.newPassword), text: "One lowercase letter" },
                { ok: /[0-9]/.test(passwords.newPassword), text: "One number" },
              ].map(({ ok, text }) => (
                <li key={text} className={`flex items-center gap-2 ${ok ? "text-emerald-500" : "text-[var(--color-inverted-bg)]/40"}`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {text}
                </li>
              ))}
            </ul>
          )}

          <PasswordInput
            label="Confirm New Password"
            value={passwords.confirmPassword}
            onChange={(e) => {
              setPasswords({ ...passwords, confirmPassword: e.target.value });
              setPasswordErrors({ ...passwordErrors, confirmPassword: "" });
            }}
            error={passwordErrors.confirmPassword}
          />

          <div className="pt-2">
            <Button
              type="primary"
              size="sm"
              isLoading={isSavingPwd}
              disabled={isSavingPwd}
              onClick={handleSavePassword}
            >
              {isSavingPwd ? "Updating…" : "Update Password"}
            </Button>
          </div>
        </form>
      </section>

      {/* ── Notifications ─────────────────────────────────────────────────── */}
      <section className="bg-[var(--color-surface)] border border-[var(--color-outline-variant)]/50 rounded-3xl p-6 md:p-8 shadow-sm">
        <SectionHeader
          icon={Bell}
          iconBg="bg-amber-500/10 text-amber-500"
          title="Email Notifications"
          description="Choose what we send to your inbox. Changes save automatically."
        />

        <div className="space-y-2 max-w-lg">
          {[
            {
              key: "emailOrderUpdates",
              title: "Order Updates",
              desc: "Shipping confirmations, delivery status, and receipts.",
            },
            {
              key: "emailPromotions",
              title: "Promotions & Offers",
              desc: "Exclusive discounts, flash sales, and seasonal deals.",
            },
            {
              key: "emailNewArrivals",
              title: "New Arrivals",
              desc: "Be first to know when new collections drop.",
            },
          ].map(({ key, title, desc }) => (
            <label
              key={key}
              htmlFor={`notif-${key}`}
              className="flex items-center justify-between gap-6 p-4 rounded-2xl cursor-pointer hover:bg-[var(--color-surface-highest)]/70 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <span className="block font-semibold text-sm text-[var(--color-inverted-bg)] group-hover:text-[var(--color-primary)] transition-colors">
                  {title}
                </span>
                <span className="block text-xs text-[var(--color-inverted-bg)]/55 mt-0.5 leading-relaxed">
                  {desc}
                </span>
              </div>
              <ToggleSwitch
                id={`notif-${key}`}
                checked={notifPrefs[key]}
                onChange={() => handleToggleNotif(key)}
              />
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}
