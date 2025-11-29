import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    isLoginedIn: false,
    userType: null,
  },
  reducers: {
    // Define your reducers here
    updateUser: (state, action) => {
      state.user = action.payload;
      console.log("User updated:", state.user);
    },
    updateToken: (state, action) => {
      state.token = action.payload;
      console.log("Token updated:", state.token);
    },
    setLoginStatus: (state, action) => {
      state.isLoginedIn = action.payload;
      console.log("Login status updated:", state.isLoginedIn);
    },
    updateUserType: (state, action) => {
      state.userType = action.payload;
      console.log("User type updated:", state.userType);
    },
    hamdleLogout: (state, action) => {
      state.user = null;
      state.token = null;
      state.isLoginedIn = false;
    },
  },
});

export const {
  updateUser,
  updateUserType,
  updateToken,
  setLoginStatus,
  hamdleLogout,
} = authSlice.actions;
export default authSlice.reducer;
