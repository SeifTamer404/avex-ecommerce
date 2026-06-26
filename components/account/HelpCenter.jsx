"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  ChevronDown,
  MessageCircle,
  Mail,
  Phone,
  Package,
  RotateCcw,
  Truck,
  CreditCard,
  ShieldCheck,
  ExternalLink,
  Search,
  Clock,
  CheckCircle,
} from "lucide-react";

// ── FAQ Data ──────────────────────────────────────────────────────────────────
const FAQ_CATEGORIES = [
  {
    label: "Orders & Shipping",
    icon: Truck,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    items: [
      {
        q: "How do I track my order?",
        a: "Once your order ships, you'll receive a confirmation email with a tracking number. You can also view real-time tracking from your Order History page under My Account.",
      },
      {
        q: "How long does delivery take?",
        a: "Standard shipping takes 3–7 business days. Express shipping (1–2 business days) is available at checkout. Free standard shipping is included on all orders over $50.",
      },
      {
        q: "Can I change or cancel my order?",
        a: "Orders can be modified or cancelled within 1 hour of placement. After that, the order enters processing and cannot be changed. Please contact our support team immediately if you need to make a change.",
      },
      {
        q: "Do you ship internationally?",
        a: "Yes! We ship to over 50 countries. International delivery typically takes 7–14 business days. Duties and taxes may apply depending on your destination country.",
      },
    ],
  },
  {
    label: "Returns & Refunds",
    icon: RotateCcw,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    items: [
      {
        q: "What is your return policy?",
        a: "We offer a hassle-free 30-day return window on most items. Products must be unused, in original packaging, and accompanied by proof of purchase. Some categories (e.g. personal care, digital downloads) are non-returnable.",
      },
      {
        q: "How do I initiate a return?",
        a: 'Go to Order History, select the order containing the item(s) you wish to return, and click "Request Return". You\'ll receive a prepaid return label within 24 hours.',
      },
      {
        q: "When will I receive my refund?",
        a: "Refunds are processed within 3–5 business days after we receive and inspect your return. The amount will appear on your original payment method within 5–10 banking days depending on your bank.",
      },
      {
        q: "What if I received a damaged or wrong item?",
        a: "We sincerely apologise! Please contact our support team within 48 hours of delivery with photos of the item. We'll send a replacement or issue a full refund immediately — no need to return the item.",
      },
    ],
  },
  {
    label: "Payments & Billing",
    icon: CreditCard,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit and debit cards (Visa, Mastercard, Amex), PayPal, Apple Pay, Google Pay, and AVEX store credit. All transactions are secured with SSL encryption.",
      },
      {
        q: "Is my payment information safe?",
        a: "Absolutely. AVEX never stores your full card details. All payments are processed through PCI-DSS Level 1 compliant payment processors. Look for the padlock icon in your browser for SSL verification.",
      },
      {
        q: "Can I use multiple payment methods?",
        a: "You can combine AVEX store credit or a gift card with any other payment method at checkout. However, only one credit/debit card can be charged per transaction.",
      },
    ],
  },
  {
    label: "Account & Security",
    icon: ShieldCheck,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    items: [
      {
        q: "How do I reset my password?",
        a: 'Click "Forgot Password" on the login page and enter your email address. You\'ll receive a reset link within a few minutes. Check your spam folder if you don\'t see it.',
      },
      {
        q: "How do I update my email address?",
        a: "For security, email changes require verification. Go to Settings → Account Information, enter your new email, and confirm via the verification link sent to both your old and new addresses.",
      },
      {
        q: "Can I have multiple shipping addresses?",
        a: "Yes! You can save unlimited shipping addresses under Account → Addresses. You can set a default address that pre-fills automatically at checkout.",
      },
    ],
  },
];

const QUICK_LINKS = [
  { icon: Package,    label: "Track My Order",     desc: "Real-time order tracking",        href: "/account/orders" },
  { icon: RotateCcw,  label: "Start a Return",     desc: "Easy 30-day returns",              href: "/account/orders" },
  { icon: Truck,      label: "Shipping Policy",    desc: "Rates, times & coverage",          href: "#" },
  { icon: CreditCard, label: "Payment Methods",    desc: "Cards, PayPal, store credit",      href: "#" },
];

// ── FAQ Accordion Item ─────────────────────────────────────────────────────────
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border border-[var(--color-outline-variant)]/40 rounded-2xl overflow-hidden transition-all duration-200 ${open ? "shadow-md" : ""}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-[var(--color-outline-variant)]/10 transition-colors"
        aria-expanded={open}
      >
        <span className="font-semibold text-sm text-[var(--color-inverted-bg)] leading-snug">{q}</span>
        <ChevronDown
          className={`w-4 h-4 flex-shrink-0 text-[var(--color-inverted-bg)]/40 transition-transform duration-200 ${open ? "rotate-180 text-[var(--color-primary)]" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-[var(--color-inverted-bg)]/65 leading-relaxed border-t border-[var(--color-outline-variant)]/30 pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function HelpCenter() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);

  // Flatten + filter FAQ items based on search
  const filteredCategories = FAQ_CATEGORIES.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (item) =>
        !search ||
        item.q.toLowerCase().includes(search.toLowerCase()) ||
        item.a.toLowerCase().includes(search.toLowerCase()),
    ),
  })).filter((cat) => cat.items.length > 0);

  const displayCategories =
    activeCategory
      ? filteredCategories.filter((c) => c.label === activeCategory)
      : filteredCategories;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="relative bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-surface)] to-purple-500/5 border border-[var(--color-outline-variant)]/30 rounded-3xl p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/15 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-[var(--color-primary)]" />
            </div>
            <p className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest">Help Center</p>
          </div>
          <h1 className="font-display font-extrabold text-2xl md:text-3xl text-[var(--color-inverted-bg)] tracking-tight mb-2">
            How can we help you?
          </h1>
          <p className="text-[var(--color-inverted-bg)]/55 text-sm max-w-md">
            Search our knowledge base or browse by category below. Can't find what you need? Our support team is ready to help.
          </p>

          {/* Search */}
          <div className="relative mt-6 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-inverted-bg)]/35 pointer-events-none" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setActiveCategory(null); }}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-outline-variant)]/50 text-sm text-[var(--color-inverted-bg)] placeholder:text-[var(--color-inverted-bg)]/35 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]/50 transition-all"
            />
          </div>
        </div>
      </div>

      {/* ── Quick Links ─────────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-xs font-bold text-[var(--color-inverted-bg)]/40 uppercase tracking-widest mb-3">Quick Links</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {QUICK_LINKS.map(({ icon: Icon, label, desc, href }) => (
            <Link
              key={label}
              href={href}
              className="flex flex-col gap-2 p-4 bg-[var(--color-surface)] border border-[var(--color-outline-variant)]/40 rounded-2xl hover:border-[var(--color-primary)]/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center group-hover:bg-[var(--color-primary)]/20 transition-colors">
                <Icon className="w-4 h-4 text-[var(--color-primary)]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--color-inverted-bg)] leading-tight">{label}</p>
                <p className="text-xs text-[var(--color-inverted-bg)]/45 mt-0.5">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Category Filter ──────────────────────────────────────────────────── */}
      {!search && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              !activeCategory
                ? "bg-[var(--color-primary)] text-white shadow-sm"
                : "bg-[var(--color-surface)] border border-[var(--color-outline-variant)]/40 text-[var(--color-inverted-bg)]/60 hover:border-[var(--color-primary)]/40"
            }`}
          >
            All Topics
          </button>
          {FAQ_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(isActive ? null : cat.label)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[var(--color-primary)] text-white shadow-sm"
                    : "bg-[var(--color-surface)] border border-[var(--color-outline-variant)]/40 text-[var(--color-inverted-bg)]/60 hover:border-[var(--color-primary)]/40"
                }`}
              >
                <Icon className="w-3 h-3" />
                {cat.label}
              </button>
            );
          })}
        </div>
      )}

      {/* ── FAQ Sections ─────────────────────────────────────────────────────── */}
      <div className="space-y-8">
        {displayCategories.length === 0 ? (
          <div className="text-center py-16 text-[var(--color-inverted-bg)]/40">
            <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No results for "{search}"</p>
            <p className="text-sm mt-1">Try different keywords or contact support below.</p>
          </div>
        ) : (
          displayCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <section key={cat.label}>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className={`w-8 h-8 rounded-xl ${cat.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${cat.color}`} />
                  </div>
                  <h2 className="font-display font-bold text-base text-[var(--color-inverted-bg)]">{cat.label}</h2>
                  <span className="text-xs text-[var(--color-inverted-bg)]/35 font-medium">{cat.items.length} articles</span>
                </div>
                <div className="space-y-2">
                  {cat.items.map((item) => (
                    <FaqItem key={item.q} q={item.q} a={item.a} />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>

      {/* ── Contact Support ──────────────────────────────────────────────────── */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-outline-variant)]/40 rounded-3xl p-6 md:p-8">
        <div className="mb-6">
          <h2 className="font-display font-bold text-lg text-[var(--color-inverted-bg)] mb-1">Still need help?</h2>
          <p className="text-sm text-[var(--color-inverted-bg)]/55">Our support team is available 7 days a week. Choose how you'd like to reach us.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Live Chat */}
          <div className="relative flex flex-col gap-3 p-5 bg-[var(--color-primary)]/8 border border-[var(--color-primary)]/20 rounded-2xl group hover:border-[var(--color-primary)]/50 hover:shadow-md transition-all cursor-pointer">
            <div className="absolute top-4 right-4">
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/15 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-[var(--color-primary)]" />
            </div>
            <div>
              <p className="font-bold text-sm text-[var(--color-inverted-bg)]">Live Chat</p>
              <p className="text-xs text-[var(--color-inverted-bg)]/55 mt-0.5 leading-relaxed">Chat with an agent now. Usually replies in under 2 minutes.</p>
            </div>
            <div className="flex items-center gap-1.5 mt-auto">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Online now</span>
            </div>
          </div>

          {/* Email */}
          <a
            href="mailto:support@avex.com"
            className="flex flex-col gap-3 p-5 bg-[var(--color-surface-low)] border border-[var(--color-outline-variant)]/40 rounded-2xl hover:border-[var(--color-primary)]/40 hover:shadow-md transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-[var(--color-outline-variant)]/20 flex items-center justify-center">
              <Mail className="w-5 h-5 text-[var(--color-inverted-bg)]/60" />
            </div>
            <div>
              <p className="font-bold text-sm text-[var(--color-inverted-bg)]">Email Support</p>
              <p className="text-xs text-[var(--color-inverted-bg)]/55 mt-0.5 leading-relaxed">Send us a message and we'll get back to you within 24 hours.</p>
            </div>
            <div className="flex items-center gap-1.5 mt-auto">
              <Clock className="w-3.5 h-3.5 text-[var(--color-inverted-bg)]/35" />
              <span className="text-xs font-medium text-[var(--color-inverted-bg)]/45">Response in ~24h</span>
            </div>
          </a>

          {/* Phone */}
          <a
            href="tel:+18001234567"
            className="flex flex-col gap-3 p-5 bg-[var(--color-surface-low)] border border-[var(--color-outline-variant)]/40 rounded-2xl hover:border-[var(--color-primary)]/40 hover:shadow-md transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-[var(--color-outline-variant)]/20 flex items-center justify-center">
              <Phone className="w-5 h-5 text-[var(--color-inverted-bg)]/60" />
            </div>
            <div>
              <p className="font-bold text-sm text-[var(--color-inverted-bg)]">Phone Support</p>
              <p className="text-xs text-[var(--color-inverted-bg)]/55 mt-0.5 leading-relaxed">Call us Mon–Fri, 9 AM – 6 PM EST.</p>
            </div>
            <div className="flex items-center gap-1.5 mt-auto">
              <span className="text-xs font-semibold text-[var(--color-inverted-bg)]/55">+1 (800) 123-4567</span>
              <ExternalLink className="w-3 h-3 text-[var(--color-inverted-bg)]/35" />
            </div>
          </a>
        </div>
      </div>

    </div>
  );
}
