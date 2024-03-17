import {
  configureStore,
  ThunkAction,
  Action,
} from '@reduxjs/toolkit';
import appSlice from '../features/appSlice';
import notificationSlice from '../features/notificationSlice';
import { listenerMiddleware } from './listenerMiddleware';
import userSlice from '../features/userSlice';
import createMasterSlice from '../features/createMasterSlice';

export const store = configureStore({
  reducer: {
    appSlice,
    notificationSlice,
    userSlice,
    createMasterSlice,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().prepend(listenerMiddleware.middleware);
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
