import { createSlice } from "@reduxjs/toolkit";

const initialUserState = {
  id: null,
  name: "",
  email: "",
  avatar: "",
  role: "user",
  points: 0,
  wishlist: [],
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    setUser(state, action) {
      const { id, name, email, avatar, role, points, wishlist } = action.payload;

      state.id = id;
      state.name = name || "";
      state.email = email || "";
      state.avatar = avatar || "";
      state.role = role || "user";
      state.points = points || 0;
      state.wishlist = wishlist || [];

      state.isAuthenticated = !!id;
    },
    setWishlist(state, action) {
      state.wishlist = action.payload;
    },
    toggleWishlist(state, action) {
      const productId = action.payload;
      if (state.wishlist.includes(productId)) {
        state.wishlist = state.wishlist.filter((id) => id !== productId);
      } else {
        state.wishlist.push(productId);
      }
    },

    clearUser() {
      return initialUserState;
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
