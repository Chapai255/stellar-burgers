import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TIngredient, TIngredientsState } from '@utils-types';

/* Загрузка стартует сразу при монтировании App, поэтому до первого ответа
   считаем, что данные уже грузятся: так страницы не мигают «нет данных». */
const initialState: TIngredientsState = {
  items: [],
  isLoading: true,
  error: null,
};

export const fetchIngredients = createAsyncThunk<TIngredient[]>(
  'ingredients/fetchAll',
  () => getIngredientsApi()
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось загрузить ингредиенты';
      });
  },
});

export const ingredientsReducer = ingredientsSlice.reducer;
