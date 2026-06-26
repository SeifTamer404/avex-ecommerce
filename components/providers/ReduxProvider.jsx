"use client";
import { store, persistor } from "@/store/index";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

// PersistGate delays rendering children until redux-persist has finished
// reading from localStorage and rehydrating the cart slice. Without it the
// cart item count in the Navbar flashes from 0 → real value on every load.
export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
