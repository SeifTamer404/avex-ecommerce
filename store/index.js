import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";

import cartReducer from "./slices/cartSlice";
import uiReducer from "./slices/uiSlice";
import userReducer from "./slices/userSlice";

// ── SSR-safe storage ──────────────────────────────────────────────────────────
// redux-persist calls storage synchronously at module evaluation time.
// On the server localStorage doesn't exist, so we return a silent no-op
// storage to avoid the "failed to create sync storage" warning.
// On the client we use the real localStorage via the default storage package.
function createStorage() {
  if (typeof window === "undefined") {
    // Server: no-op storage — nothing is persisted, no warning
    return {
      getItem:    () => Promise.resolve(null),
      setItem:    () => Promise.resolve(),
      removeItem: () => Promise.resolve(),
    };
  }
  // Browser: real localStorage
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require("redux-persist/lib/storage").default;
}

const storage = createStorage();

// ── Cart persistence config ───────────────────────────────────────────────────
// Only cartSlice is persisted. uiSlice (isCartOpen, notifications) should
// always boot fresh, and userSlice auth state is managed by the auth flow.
const cartPersistConfig = {
  key: "cart",
  storage,
  version: 1,
};

const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);

// ── Store ─────────────────────────────────────────────────────────────────────
export const store = configureStore({
  reducer: {
    cart: persistedCartReducer,
    ui:   uiReducer,
    user: userReducer,
  },
  // redux-persist dispatches its own internal action types. Suppress the
  // RTK serializability check for them so the console stays clean.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// ── Persistor ─────────────────────────────────────────────────────────────────
// Consumed by <PersistGate> in ReduxProvider to delay render until
// localStorage has been rehydrated.
export const persistor = persistStore(store);
