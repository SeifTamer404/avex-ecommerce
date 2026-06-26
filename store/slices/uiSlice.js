import { createSlice } from "@reduxjs/toolkit";

const initialUiState = {
  isCartOpen: false,
  isSidebarOpen: false,
  searchQuery: "",
  notifications: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState: initialUiState,
  reducers: {
    toggleCart(state) {
      state.isCartOpen = !state.isCartOpen;
    },

    setIsCartOpen(state, action) {
      state.isCartOpen = action.payload;
    },

    toggleSidebar(state) {
      state.isSidebarOpen = !state.isSidebarOpen;
    },

    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    addNotification(state, action) {
      state.notifications.push(action.payload);
    },
    removeNotification(state, action) {
      const id = action.payload;
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== id,
      );
    },
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;
