import Link from "next/link";

/**
 * Button — reusable button / link component.
 *
 * Props:
 *  - type      : "primary" | "secondary" | "white-outline" | "inverted" | "solid" | "tertiary"
 *  - size      : "xs" | "sm" | "md" | "lg"
 *  - href      : string  — when provided renders as a Next.js <Link> instead of <button>
 *  - isLoading : boolean — shows spinner, disables interaction
 *  - disabled  : boolean
 *  - onClick   : fn
 *  - className : string  — extra classes appended at the end
 *  - children
 */
export default function Button({
  type,
  htmlType = "button",
  size,
  href,
  isLoading = false,
  disabled = false,
  onClick,
  className = "",
  children,
}) {
  let classes =
    "rounded-sm transition-all flex items-center justify-center ease-kinetic duration-300";

  if (type === "primary") {
    classes += " font-display bg-kinetic-pulse text-white font-extrabold hover:scale-105";
  } else if (type === "secondary") {
    classes +=
      " border-2 border-[var(--color-outline-variant)] text-[var(--color-inverted-bg)] font-extrabold backdrop-blur-md hover:bg-[var(--color-inverted-bg)]/5";
  } else if (type === "white-outline") {
    classes += " border-2 border-white text-white hover:bg-white hover:text-brand-purple";
  } else if (type === "inverted") {
    classes +=
      " bg-[var(--color-inverted-bg)] text-[var(--color-inverted-text)] hover:bg-[var(--color-inverted-text)] hover:text-[var(--color-inverted-bg)]";
  } else if (type === "solid") {
    classes += " bg-white text-black hover:bg-gray-100";
  } else if (type === "tertiary") {
    classes += " text-primary-dim font-bold hover:underline";
  }

  if (size === "xs") {
    classes += " px-4 py-2 text-xs";
  } else if (size === "sm") {
    classes += " px-6 py-2 text-sm";
  } else if (size === "md") {
    classes += " px-8 py-4";
  } else if (size === "lg") {
    classes += " px-10 py-6";
  }

  if (isLoading) {
    classes += " opacity-70 cursor-not-allowed";
  }

  // Append any extra classes passed from outside
  classes += ` ${className}`;

  const spinner = isLoading && (
    <svg
      className="animate-spin ml-2 -mr-1 h-5 w-5 text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  // When href is provided → render as a Next.js Link (navigates without full reload)
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
        {spinner}
      </Link>
    );
  }

  // Default → plain <button>
  return (
    <button type={htmlType} className={classes} onClick={onClick} disabled={disabled || isLoading}>
      {children}
      {spinner}
    </button>
  );
}
