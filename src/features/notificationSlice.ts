/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Notification } from '../types/main';
import { listenerMiddleware } from '../app/listenerMiddleware';
import { notificationDelay } from '../helpers/variables';
import starsNotification from '../img/icons/stars-notification.svg';

type TypeNotification =
  | 'error'
  | 'resetPassword'
  | 'confirmationEmail'
  | 'registration'
  | 'contactUs'
  | 'login';

const initialState: {
  notifications: Notification[];
} = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: 'notificationSlice',
  initialState,
  reducers: {
    addNotification: (
      state,
      action: PayloadAction<{
        id: number;
        type: TypeNotification;
        description?: string;
      }>,
    ) => {
      let notification: Notification;

      switch (action.payload.type) {
        case 'login':
          notification = {
            id: action.payload.id,
            icon: starsNotification,
            title: 'You have successfully logged in!',
            description: 'We are glad to see you again!',
          };
          break;

        case 'registration':
          notification = {
            id: action.payload.id,
            title: 'You have successfully signed up!',
            description: `You can now save beauticians to your
              Favourites list and create a beautician profile`,
          };
          break;

        case 'confirmationEmail':
          notification = {
            id: action.payload.id,
            title: 'A confirmation email has been sent to your email address.',
            description: `In addition to your inbox, check your spam folder.
            The email may have ended up there`,
          };
          break;

        case 'resetPassword':
          notification = {
            id: action.payload.id,
            title: 'A new password has been sent to your email address.',
            description: `In addition to your inbox, check your spam folder.
            The email may have ended up there.`,
          };
          break;

        case 'contactUs':
          notification = {
            id: action.payload.id,
            title: 'Message Sent!',
            description: `Your message was successfully sent.
            Please wait for a response. You will receive an answer via email.`,
          };
          break;

        default:
          notification = {
            id: action.payload.id,
            title: 'Oops something went wrong',
            description:
              action.payload.description ||
              'Reload the page or try again later',
          };
          break;
      }

      state.notifications = [...state.notifications, notification];
    },
    removeNotification: (state, action: PayloadAction<Notification['id']>) => {
      state.notifications = state.notifications.filter(
        item => item.id !== action.payload,
      );
    },
  },
});

export const { addNotification, removeNotification } =
  notificationSlice.actions;
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
