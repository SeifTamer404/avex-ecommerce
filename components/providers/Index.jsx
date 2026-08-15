import ReduxProvider from "./ReduxProvider";
import ThemeProvider from "./ThemeProvider";
import AuthSync from "./AuthSync";

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <ReduxProvider>
        <AuthSync />
        {children}
      </ReduxProvider>
    </ThemeProvider>
  );
}
