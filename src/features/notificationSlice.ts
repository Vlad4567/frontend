/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Notification } from '../types/main';
import { listenerMiddleware } from '../app/listenerMiddleware';
import { notificationDelay } from '../helpers/variables';

const initialState: {
  notifications: Notification[],
} = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: 'notificationSlice',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications = [...state.notifications, action.payload];
    },
    removeNotification: (
      state,
      action: PayloadAction<Notification['id']>,
    ) => {
      state.notifications
        = state.notifications.filter(item => item.id !== action.payload);
    },
  },
});

export const {
  addNotification,
  removeNotification,
} = notificationSlice.actions;
export default notificationSlice.reducer;

listenerMiddleware.startListening({
  actionCreator: addNotification,
  effect: (action, listenerApi) => {
    const timeoutId = setTimeout(() => {
      listenerApi.dispatch(removeNotification(action.payload.id));

      clearTimeout(timeoutId);
    }, notificationDelay);
  },
});
