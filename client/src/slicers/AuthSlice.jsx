import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    isLoginedIn: false,
    initialized: false,
    ticketBookingDate: null,
    userType: localStorage.getItem("userType") || null,
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

    updateUserType: (state, action) => {
      state.userType = action.payload;
      localStorage.setItem("userType", state.userType);
      console.log("User type updated:", state.userType);
    },
    setLoginStatus: (state, action) => {
      state.isLoginedIn = action.payload;
      console.log("Login status updated:", state.isLoginedIn);
    },
    setInitialized:(state, action)=>{
      state.initialized = action.payload;
    },
    handleLogout: (state, action) => {
      localStorage.setItem("userType", null);
      state.user = null;
      state.userType = null;
      state.token = null;
      state.isLoginedIn = false;
    },
    setTicketBookingDate: (state, action) => {
      state.ticketBookingDate = action.payload;
    },
  },
});

export const {
  updateUser,
  updateUserType,
  updateToken,
  setLoginStatus,
  setInitialized,
  setTicketBookingDate,
  handleLogout,
} = authSlice.actions;
export default authSlice.reducer;
