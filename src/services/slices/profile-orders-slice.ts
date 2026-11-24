import { getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { logoutUser } from './user-slice';

import type { TOrder, TProfileOrdersState } from '@utils-types';

const initialState: TProfileOrdersState = {
  orders: [],
  isLoading: true,
  error: null,
};

export const fetchProfileOrders = createAsyncThunk<TOrder[]>('profileOrders/fetch', () =>
  getOrdersApi()
);

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось загрузить историю заказов';
      })
      /* История заказов личная: после выхода она не должна достаться следующему
         пользователю. */
      .addCase(logoutUser.fulfilled, () => initialState)
      .addCase(logoutUser.rejected, () => initialState);
  },
});

export const profileOrdersReducer = profileOrdersSlice.reducer;
