export const metadata = {
  title: "AVEX — Account",
  description: "Sign in or create your AVEX account",
};

/**
 * Auth pages inherit the root layout (html, body, Providers, ThemeProvider).
 * This layout adds NO extra wrappers — it just overrides metadata.
 * Keeping ThemeProvider in the root layout means the dark class persists
 * when the user navigates to /login or /register.
 */
export default function AuthLayout({ children }) {
  return children;
}
