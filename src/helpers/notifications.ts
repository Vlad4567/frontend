import { store } from '../app/store';
import * as notificationSlice from '../features/notificationSlice';
import starsNotification from '../img/icons/stars-notification.svg';

type Notification =
  | 'error'
  | 'resetPassword'
  | 'confirmationEmail'
  | 'registration'
  | 'login';

export const showNotification = (
  notification: Notification,
) => {
  switch (notification) {
    case 'login': store.dispatch(
      notificationSlice.addNotification({
        id: +new Date(),
        icon: starsNotification,
        title: 'You have successfully logged in!',
        description: 'We are glad to see you again!',
      }),
    );
      break;

    case 'registration': store.dispatch(notificationSlice.addNotification({
      id: +new Date(),
      title: 'You have successfully signed up!',
      description: `You can now save beauticians to your
        Favourites list and create a beautician profile`,
    }));
      break;

    case 'confirmationEmail':
      store.dispatch(
        notificationSlice.addNotification({
          id: +new Date(),
          title:
            'A confirmation email has been sent to your email address.',
          description: `In addition to your inbox, check your spam folder.
        The email may have ended up there`,
        }),
      );
      break;

    case 'resetPassword':
      store.dispatch(
        notificationSlice.addNotification({
          id: +new Date(),
          title:
            'A new password has been sent to your email address.',
          description: `In addition to your inbox, check your spam folder.
        The email may have ended up there.`,
        }),
      );
      break;

    default:
      store.dispatch(
        notificationSlice.addNotification({
          id: +new Date(),
          title: 'Oops something went wrong',
          description: 'Reload the page or try again later',
        }),
      );
      break;
  }
};
