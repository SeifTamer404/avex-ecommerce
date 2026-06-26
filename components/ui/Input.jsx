import { forwardRef, useId } from "react";

/**
 * Input — reusable form input with optional leading/trailing Material Symbol icon.
 *
 * Props:
 *  - label        : string  — optional label shown above the field
 *  - error        : string  — turns ring red and shows error message below
 *  - helperText   : string  — shown below when no error
 *  - icon         : string  — Material Symbol name e.g. "search", "email"
 *  - iconPosition : "left" | "right"  — default "right"
 *  - className    : string  — extra classes for the <input> element itself
 *  - ...props     : any remaining props forwarded to <input>
 */
const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      icon,
      iconPosition = "right",
      className = "",
      type = "text",
      ...props
    },
    ref,
  ) => {
    const uniqueId = useId();
    const inputId = props.id || uniqueId;

    // Shift padding to make room for the icon
    const paddingClass = icon
      ? iconPosition === "left"
        ? "pl-10 pr-4"
        : "pl-4 pr-10"
      : "px-4";

    return (
      <div className="w-full flex flex-col gap-1.5">
        {/* Label — optional */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--color-inverted-bg)]"
          >
            {label}
          </label>
        )}

        {/* Input wrapper — needed to position the icon */}
        <div className="relative w-full">
          {/* Leading icon */}
          {icon && iconPosition === "left" && (
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-[var(--color-inverted-bg)]/40 pointer-events-none select-none">
              {icon}
            </span>
          )}

          <input
            id={inputId}
            ref={ref}
            type={type}
            className={`
              w-full py-2 text-sm transition-all outline-none border-none
              bg-[var(--color-surface-highest)] text-[var(--color-inverted-bg)]
              rounded-[var(--radius-sm)]
              placeholder:text-gray-400 dark:placeholder:text-gray-500
              ${paddingClass}
              ${
                error
                  ? "ring-2 ring-red-500 focus:ring-red-600"
                  : "focus:ring-2 focus:ring-primary"
              }
              ${className}
            `}
            {...props}
          />

          {/* Trailing icon */}
          {icon && iconPosition === "right" && (
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[20px] text-[var(--color-inverted-bg)]/40 pointer-events-none select-none">
              {icon}
            </span>
          )}
        </div>

        {/* Error or helper text */}
        {error ? (
          <span className="text-xs font-medium text-red-500">{error}</span>
        ) : helperText ? (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {helperText}
          </span>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
