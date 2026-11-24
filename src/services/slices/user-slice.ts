import {
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  refreshToken,
  registerUserApi,
  resetPasswordApi,
  updateUserApi,
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { deleteCookie, getCookie, setCookie } from '@utils/cookie';

import type { TLoginData, TRegisterData } from '@api';
import type { TUser, TUserState } from '@utils-types';

const initialState: TUserState = {
  user: null,
  /* Пока не проверили, есть ли у пользователя действующая сессия, защищённые
     маршруты показывают лоадер, а не перекидывают на /login. */
  isAuthChecked: false,
};

type TTokens = { accessToken: string; refreshToken: string };

const saveTokens = ({ accessToken, refreshToken }: TTokens): void => {
  setCookie('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

const clearTokens = (): void => {
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
};

export const registerUser = createAsyncThunk<TUser, TRegisterData>(
  'user/register',
  async (data) => {
    const response = await registerUserApi(data);
    saveTokens(response);
    return response.user;
  }
);

export const loginUser = createAsyncThunk<TUser, TLoginData>(
  'user/login',
  async (data) => {
    const response = await loginUserApi(data);
    saveTokens(response);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  try {
    await logoutApi();
  } finally {
    clearTokens();
  }
});

/* Вызывается один раз при старте приложения. Никогда не завершается ошибкой:
   если сессии нет или она недействительна, пользователь просто не залогинен. */
export const checkUserAuth = createAsyncThunk<TUser | null>(
  'user/checkAuth',
  async () => {
    try {
      if (!getCookie('accessToken')) {
        /* Cookie живёт до закрытия браузера, а refreshToken лежит в localStorage:
           если cookie пропала, а refreshToken остался, получаем новый accessToken. */
        if (!localStorage.getItem('refreshToken')) return null;
        await refreshToken();
      }
      const { user } = await getUserApi();
      return user;
    } catch {
      clearTokens();
      return null;
    }
  }
);

export const updateUser = createAsyncThunk<TUser, Partial<TRegisterData>>(
  'user/update',
  async (data) => {
    const { user } = await updateUserApi(data);
    return user;
  }
);

export const forgotPassword = createAsyncThunk<void, string>(
  'user/forgotPassword',
  async (email) => {
    await forgotPasswordApi({ email });
  }
);

export const resetPassword = createAsyncThunk<void, { password: string; token: string }>(
  'user/resetPassword',
  async (data) => {
    await resetPasswordApi(data);
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isAuthChecked = true;
      })
      /* Токены в logoutUser чистятся в любом случае, поэтому и в сторе
         пользователя сбрасываем при любом исходе запроса. */
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
      });
  },
});

export const userReducer = userSlice.reducer;
