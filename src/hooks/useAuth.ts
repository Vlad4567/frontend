import { useMutation } from '@tanstack/react-query';
import {
  authLoginTelegram as apiAuthLoginTelegram,
  forgotPassword as apiForgotPassword,
  loginUser as apiLoginUser,
  registrateUser as apiRegistrateUser,
  checkUsername as apiCheckUsername,
  checkUserEmail as apiCheckUserEmail,
  getDeviceToken,
} from '../api/login';
import { useNotification } from './useNotification';

export const useAuth = () => {
  const { addNotification } = useNotification();

  const authLoginTelegram = useMutation({
    mutationFn: async (code: number) => {
      const deviceToken = await getDeviceToken();

      return apiAuthLoginTelegram({
        code,
        token: deviceToken,
      });
    },
    onSuccess: data => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', `${data.refreshToken}`);
      addNotification('login');
    },
    onError: () => addNotification('error'),
  });

  const forgotPassword = useMutation({
    mutationFn: apiForgotPassword,
    onSuccess: () => addNotification('resetPassword'),
    onError: () => addNotification('error'),
  });

  const loginUser = useMutation({
    mutationFn: apiLoginUser,
    onSuccess: data => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', `${data.refreshToken}`);
      addNotification('login');
    },
  });

  const registrateUser = useMutation({
    mutationFn: apiRegistrateUser,
    onSuccess: () => addNotification('confirmationEmail'),
  });

  const checkUsername = useMutation({
    mutationFn: apiCheckUsername,
  });

  const checkUserEmail = useMutation({
    mutationFn: apiCheckUserEmail,
  });

  return {
    authLoginTelegram,
    forgotPassword,
    loginUser,
    registrateUser,
    checkUsername,
    checkUserEmail,
  };
};
