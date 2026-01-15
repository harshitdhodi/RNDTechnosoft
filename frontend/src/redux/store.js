// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/homepageSlice';
export const store = configureStore({
  reducer: {
    // Add the api reducer to your store
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  // Add the RTK Query middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});