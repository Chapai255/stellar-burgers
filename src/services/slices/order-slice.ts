import { getOrderByNumberApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TOrder, TOrderState } from '@utils-types';

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  currentOrder: null,
};

/* Принимает id ингредиентов: булка, начинки, булка. */
export const createOrder = createAsyncThunk<TOrder, string[]>(
  'order/create',
  async (ingredientIds) => {
    const { order } = await orderBurgerApi(ingredientIds);
    return order;
  }
);

/* Для прямого захода на /feed/:number и /profile/orders/:number, когда заказа
   ещё нет ни в ленте, ни в истории. */
export const fetchOrderByNumber = createAsyncThunk<TOrder, number>(
  'order/fetchByNumber',
  async (number) => {
    const { orders } = await getOrderByNumberApi(number);

    if (!orders?.length) {
      throw new Error('Заказ не найден');
    }
    return orders[0];
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderModal: (state) => {
      state.orderModalData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state) => {
        state.orderRequest = false;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      });
  },
});

export const { clearOrderModal } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
