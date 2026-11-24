import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TFeedState, TOrdersData } from '@utils-types';

/* Как и у ингредиентов: загрузка стартует при открытии страницы. */
const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: true,
  error: null,
};

export const fetchFeed = createAsyncThunk<TOrdersData>('feed/fetch', async () => {
  const { orders, total, totalToday } = await getFeedsApi();
  return { orders, total, totalToday };
});

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось загрузить ленту заказов';
      });
  },
});

export const feedReducer = feedSlice.reducer;
