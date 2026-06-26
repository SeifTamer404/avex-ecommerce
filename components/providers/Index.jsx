import ReduxProvider from "./ReduxProvider";
import ThemeProvider from "./ThemeProvider";
import AuthSync from "./AuthSync";

export default function Providers({ children }) {
  return (
    <ReduxProvider>
      <AuthSync />
      <ThemeProvider>{children}</ThemeProvider>
    </ReduxProvider>
  );
}
