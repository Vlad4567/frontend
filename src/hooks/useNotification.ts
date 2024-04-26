import { useQuery, useQueryClient } from '@tanstack/react-query';
import starsNotification from '../img/icons/stars-notification.svg';
import { notificationDelay } from '../helpers/variables';

interface Notification {
  id: number;
  title?: string;
  description?: string;
  icon?: string;
}

export type TypeNotification =
  | 'error'
  | 'resetPassword'
  | 'confirmationEmail'
  | 'registration'
  | 'contactUs'
  | 'newPassword'
  | 'login';

const queryKey = 'notifications';

const getDataNotification = (
  type: TypeNotification,
  notification?: Partial<Omit<Notification, 'id'>>,
) => {
  switch (type) {
    case 'login':
      return {
        icon: starsNotification,
        title: 'You have successfully logged in!',
        description: 'We are glad to see you again!',
      };

    case 'registration':
      return {
        title: 'You have successfully confirmed your email!',
        description: `You can now login and then save beauticians to your
          Favourites list and create a beautician profile`,
      };

    case 'newPassword':
      return {
        title: 'You have successfully reset your password!',
        description: `You can now login and then save beauticians to your
          Favourites list and create a beautician profile`,
      };

    case 'confirmationEmail':
      return {
        title: 'A confirmation email has been sent to your email address.',
        description: `In addition to your inbox, check your spam folder.
        The email may have ended up there`,
      };

    case 'resetPassword':
      return {
        title: 'A new password has been sent to your email address.',
        description: `In addition to your inbox, check your spam folder.
        The email may have ended up there.`,
      };

    case 'contactUs':
      return {
        title: 'Message Sent!',
        description: `Your message was successfully sent.
        Please wait for a response. You will receive an answer via email.`,
      };

    default:
      return {
        title: 'Oops something went wrong',
        description:
          notification?.description || 'Reload the page or try again later',
      };
  }
};

export const useNotification = () => {
  const queryClient = useQueryClient();

  const { data: notifications } = useQuery<Notification[]>({
    queryKey: [queryKey],
    initialData: [],
  });

  const removeNotification = (notificationId: number) => {
    queryClient.setQueryData<Notification[]>([queryKey], prev =>
      prev?.filter(item => item.id !== notificationId),
    );
  };

  const addNotification = (
    type: TypeNotification,
    notification?: Partial<Omit<Notification, 'id'>>,
    config?: {
      delay?: number | null;
    },
  ) => {
    const newNotification = {
      id: +Date.now(),
      ...getDataNotification(type, notification),
    };

    queryClient.setQueryData<Notification[]>([queryKey], prev => [
      ...(prev || []),
      newNotification,
    ]);

    if (config?.delay !== null) {
      const timeoutNotificationId = setTimeout(() => {
        removeNotification(newNotification.id);
        clearTimeout(timeoutNotificationId);
      }, config?.delay || notificationDelay);
    }

    return newNotification;
  };

  return {
    notifications,
    addNotification,
    removeNotification,
  };
};
