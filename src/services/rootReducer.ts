import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsReducer } from '@slices';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
});
