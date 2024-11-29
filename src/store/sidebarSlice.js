import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sidebarOpen: true,
};

const sidebarSlice = createSlice({
  name: "sidebarOpen",
  initialState,
  reducers: {
    setSidebar(state, action) {
      const { sidebarOpen } = action.payload;
      state.sidebarOpen = sidebarOpen;
    },
  },
});

export const { setSidebar } = sidebarSlice.actions;
export default sidebarSlice.reducer;
