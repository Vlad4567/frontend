import { store } from '../app/store';
import * as notificationSlice from '../features/notificationSlice';

type Notification = 'error' | 'resetPassword';

export const showNotification = (notification: Notification) => {
  switch (notification) {
    case 'resetPassword': store.dispatch(notificationSlice.addNotification({
      id: +new Date(),
      title: 'A new password has been sent to your email address.',
      description: `In addition to your inbox, check your spam folder.
        The email may have ended up there.`,
    }));
      break;

    default: store.dispatch(notificationSlice.addNotification({
      id: +new Date(),
      title: 'Oops something went wrong',
      description: 'Reload the page or try again later',
    }));
      break;
  }
};
