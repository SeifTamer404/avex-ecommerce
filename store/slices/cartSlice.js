import { createSlice } from "@reduxjs/toolkit";

// ─────────────────────────────────────────────────────────────────────────────
// CartItem shape
// {
//   productId : string   ← product._id (serialised) used as the stable key
//   slug      : string   ← used for navigation / image URLs
//   name      : string
//   price     : number   ← unit price at time of adding
//   image     : string   ← first image URL
//   quantity  : number   ← always ≥ 1
// }
// ─────────────────────────────────────────────────────────────────────────────

// ── Derived totals helper ─────────────────────────────────────────────────────
// Always recalculate from the items array so subtotal can never drift out of
// sync with quantity changes.
function recalcTotals(state) {
  state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  state.subtotal = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
}

const initialCartState = { items: [], itemCount: 0, subtotal: 0 };

const cartSlice = createSlice({
  name: "cart",
  initialState: initialCartState,
  reducers: {
    // ── addToCart(product) ─────────────────────────────────────────────────────
    // payload: { productId, slug, name, price, image, quantity? }
    // If the product is already in the cart (matched by productId) increment
    // its quantity. Otherwise push a new CartItem with quantity defaulting to 1.
    addToCart(state, action) {
      const incoming = action.payload;
      const qty = incoming.quantity ?? 1;

      const existing = state.items.find(
        (item) => item.productId === incoming.productId,
      );

      if (existing) {
        existing.quantity += qty;
      } else {
        state.items.push({
          productId: incoming.productId,
          slug: incoming.slug,
          name: incoming.name,
          price: incoming.price,
          image: incoming.image ?? "",
          quantity: qty,
        });
      }

      recalcTotals(state);
    },

    // ── removeFromCart(productId) ─────────────────────────────────────────────
    // payload: string — the productId of the item to remove
    removeFromCart(state, action) {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.productId !== productId);
      recalcTotals(state);
    },

    // ── updateQuantity({ productId, newQty }) ─────────────────────────────────
    // payload: { productId: string, newQty: number }
    // Sets the item's quantity to newQty.
    // If newQty drops to 0 (or below), the item is removed entirely.
    updateQuantity(state, action) {
      const { productId, newQty } = action.payload;

      if (newQty <= 0) {
        // Delegate to the remove logic so we don't duplicate the filter
        state.items = state.items.filter((item) => item.productId !== productId);
      } else {
        const existing = state.items.find((item) => item.productId === productId);
        if (existing) {
          existing.quantity = newQty;
        }
      }

      recalcTotals(state);
    },

    // ── clearCart() ───────────────────────────────────────────────────────────
    // Resets the cart to its empty initial state.
    // Call this after a successful order submission.
    clearCart() {
      return initialCartState;
    },
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;
