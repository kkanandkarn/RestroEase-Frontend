import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: "",
  userId: null,
  role: "",
  tenantId: null,
  tenantName: "",
  tenantLogo: "",
  token: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      const {
        username,
        userId,
        role,
        tenantId,
        token,
        tenantName,
        tenantLogo,
      } = action.payload;
      state.username = username;
      state.userId = userId;
      state.role = role;
      state.tenantId = tenantId;
      state.tenantName = tenantName;
      state.tenantLogo = tenantLogo;
      state.token = token;
    },

    logout(state) {
      state.username = "";
      state.userId = null;
      state.role = "";
      state.tenantId = null;
      state.tenantName = "";
      state.tenantLogo = "";
      state.token = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
