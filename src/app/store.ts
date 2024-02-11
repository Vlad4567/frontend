import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import appSlice from '../features/appSlice';

export const store = configureStore({
  reducer: {
    appSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

/* eslint-disable @typescript-eslint/indent */
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
/* eslint-enable @typescript-eslint/indent */
