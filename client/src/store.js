import { configureStore } from '@reduxjs/toolkit';
// import cartReducer from './CartSlice';
import { authSlice } from './slicers/AuthSlice';
const store = configureStore({
    reducer: {
        // cart: cartReducer,
        auth: authSlice.reducer,
    },
});
export default store;
