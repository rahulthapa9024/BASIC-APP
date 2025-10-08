import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../slices/userSlice'; // adjust path if needed

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
