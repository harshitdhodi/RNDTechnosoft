// src/features/api/apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the API slice
export const apiSlice = createApi({
  // The reducer path where the generated reducer will be mounted
  reducerPath: 'api',
  
  // Base URL for all requests
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/allData', // Adjust this to your actual server URL
  }),
  
  // Define tag types for cache invalidation (optional)
  tagTypes: ['CombinedData'],
  
  // Define endpoints
  endpoints: (builder) => ({
    // Define the combined endpoint
    getCombinedData: builder.query({
      // The URL endpoint
      query: () => '/combined',
      
      // Transform the response to match your needs (optional)
      transformResponse: (response) => response.data,
      
      // Provide tags for cache management (optional)
      providesTags: ['CombinedData'],
    }),
  }),
});

// Export the auto-generated hook for the combined endpoint
export const { useGetCombinedDataQuery } = apiSlice;

// Export the reducer (to be included in the store)
export default apiSlice.reducer;