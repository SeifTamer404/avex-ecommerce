const variantStyles = {
  primary: `bg-[var(--color-primary)]/45 text-[#06216a] dark:bg-[var(--color-primary)]/20 dark:text-[var(--color-primary)]`,
  default:
    "bg-[var(--color-surface-highest)] text-[var(--color-inverted-bg)] border border-[var(--color-outline-variant)]",
  success: `bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-400`,
  info: `bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-400`,
  warning: `bg-yellow-100 text-yellow-950 dark:bg-yellow-900/40 dark:text-yellow-500`,
  error: `bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-400`,
};
export default function Badge({ label, variant = "primary", className = "" }) {
  const formattedLabel =
    typeof label === "string" ? label.toUpperCase() : label;

  return (
    <span
      className={`
        inline-flex items-center justify-center
        px-4 py-1.5
        text-xs font-semibold rounded-full 
        tracking-tight
        transition-colors duration-200
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {formattedLabel}
    </span>
  );
}
