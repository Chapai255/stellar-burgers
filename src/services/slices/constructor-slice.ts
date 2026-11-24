import { createSlice, nanoid } from '@reduxjs/toolkit';

import { createOrder } from './order-slice';

import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  TConstructorIngredient,
  TConstructorState,
  TIngredient,
} from '@utils-types';

const BUN_TYPE = 'bun';

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === BUN_TYPE) {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      /* id нужен, чтобы отличать две одинаковые начинки в списке (key и удаление). */
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() },
      }),
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter((item) => item.id !== action.payload);
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ index: number; direction: 'up' | 'down' }>
    ) => {
      const { index, direction } = action.payload;
      const target = direction === 'up' ? index - 1 : index + 1;

      if (target < 0 || target >= state.ingredients.length) return;

      const [moved] = state.ingredients.splice(index, 1);
      state.ingredients.splice(target, 0, moved);
    },
  },
  extraReducers: (builder) => {
    /* После успешного заказа конструктор очищается. */
    builder.addCase(createOrder.fulfilled, () => initialState);
  },
});

export const { addIngredient, removeIngredient, moveIngredient } =
  constructorSlice.actions;
export const constructorReducer = constructorSlice.reducer;
