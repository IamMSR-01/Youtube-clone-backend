import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";  // ✅ Import correctly

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
