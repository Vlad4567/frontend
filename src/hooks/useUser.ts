import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  changeEmail,
  deleteRefreshToken,
  disconnectTelegram,
  getUser,
  putPassword,
  putUser,
  updateProfilePhoto,
  verificationTelegram,
} from '../api/account';
import { UserData } from '../types/account';
import { deleteMaster } from '../api/account';
import { useNotification } from './useNotification';
import { AxiosError } from 'axios';
import { ErrorData } from '../types/main';

const initialUser: UserData = {
  email: '',
  username: '',
  profilePhoto: null,
  master: false,
  telegramAccount: null,
};

const queryKey = 'user';

export const useUser = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotification();

  const queryUser = useQuery({
    queryKey: [queryKey],
    queryFn: getUser,
    initialData: initialUser,
  });

  const mutateUser = useMutation({
    mutationFn: putUser,
    onMutate: async newUser => {
      await queryClient.cancelQueries({ queryKey: [queryKey] });

      const previousUser = queryClient.getQueryData<UserData>([queryKey]);

      queryClient.setQueryData<UserData>([queryKey], old => ({
        ...(old || initialUser),
        username: newUser.username,
        email: newUser.email,
      }));

      return { previousUser };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(
        [queryKey],
        context?.previousUser || initialUser,
      );
      addNotification('error');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });

  const mutateEmail = useMutation({
    mutationFn: changeEmail,
    onMutate: async ({ newEmail }) => {
      await queryClient.cancelQueries({ queryKey: [queryKey] });

      const previousUser = queryClient.getQueryData<UserData>([queryKey]);

      queryClient.setQueryData<UserData>([queryKey], old => ({
        ...(old || initialUser),
        email: newEmail,
      }));

      return { previousUser };
    },
    onSuccess: () => {
      addNotification('confirmationEmail');
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(
        [queryKey],
        context?.previousUser || initialUser,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });

  const mutateDeleteMaster = useMutation({
    mutationFn: deleteMaster,
    onSuccess: () =>
      queryClient.setQueryData<UserData>([queryKey], old => ({
        ...(old || initialUser),
        master: false,
      })),
    onError: () => {
      addNotification('error');
    },
  });

  const mutateProfilePhoto = useMutation({
    mutationFn: updateProfilePhoto,
    onMutate: async newPhoto => {
      await queryClient.cancelQueries({ queryKey: [queryKey] });

      const previousUser = queryClient.getQueryData<UserData>([queryKey]);

      queryClient.setQueryData<UserData>([queryKey], old => ({
        ...(old || initialUser),
        profilePhoto: URL.createObjectURL(newPhoto),
      }));

      return { previousUser };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(
        [queryKey],
        context?.previousUser || initialUser,
      );
      addNotification('error');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });

  const updateUserState = (user: Partial<UserData>) => {
    queryClient.setQueryData<UserData>([queryKey], old => ({
      ...(old || initialUser),
      ...user,
    }));
  };

  const mutateVerificationTelegram = useMutation({
    mutationFn: verificationTelegram,
    onSuccess: telegramUsername =>
      queryClient.setQueryData<UserData>([queryKey], old => ({
        ...(old || initialUser),
        telegramAccount: {
          telegramUsername,
        },
      })),
    onError: () => {
      addNotification('error');
    },
  });

  const mutateDisconnectTelegram = useMutation({
    mutationFn: disconnectTelegram,
    onSuccess: () =>
      queryClient.setQueryData<UserData>([queryKey], old => ({
        ...(old || initialUser),
        telegramAccount: null,
      })),
    onError: (err: AxiosError<ErrorData<string>>) => {
      addNotification('error', { description: err.response?.data.error });
    },
  });

  const mutateDeleteRefreshToken = useMutation({
    mutationFn: deleteRefreshToken,
    onError: () => {
      addNotification('error');
    },
  });

  const mutateUpdatePassword = useMutation({
    mutationFn: putPassword,
    onError: () => {
      addNotification('error');
    },
  });

  return {
    queryUser,
    updateUserState,
    updateUser: mutateUser,
    updateEmail: mutateEmail,
    deleteMaster: mutateDeleteMaster,
    updateProfilePhoto: mutateProfilePhoto,
    verificationTelegram: mutateVerificationTelegram,
    disconnectTelegram: mutateDisconnectTelegram,
    deleteRefreshToken: mutateDeleteRefreshToken,
    updatePassword: mutateUpdatePassword,
  };
};
