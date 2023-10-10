// slices/authSlice.js

import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    role: null,
    email: null,
    department: null,
  },
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.email = action.payload.email;
      state.department = action.payload.department;
    },
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.email = null;
      state.department = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export const selectToken = (state) => state.auth.token;
export const selectRole = (state) => state.auth.role;
export default authSlice.reducer;
