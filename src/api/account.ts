import { AxiosRequestConfig } from 'axios';
import {
  PasswordData,
  ChangeEmail,
  UpdateUserData,
  UserData,
} from '../types/account';
import { client } from '../utils/axiosClient';

export const downloadPhoto = (photo: string, config?: AxiosRequestConfig) => {
  return client.get<ArrayBuffer>(`/photo/download?file=${photo}`, {
    ...config,
    responseType: 'arraybuffer',
  });
};

export const getUser = async () => {
  const user = await client.get<UserData>('/user');

  if (user.profilePhoto) {
    const photo = await downloadPhoto(user.profilePhoto);

    user.profilePhoto = URL.createObjectURL(new Blob([photo]));
  }

  return user;
};

export const putUser = (data: UpdateUserData) => {
  return client.put<UpdateUserData & { newEmail: string | null }>(
    '/user',
    data,
  );
};

export const putPassword = (data: PasswordData) => {
  return client.put('/reset-password', data);
};

export const deleteRefreshToken = () => {
  return client.delete('/auth/refreshToken');
};

export const updateProfilePhoto = (file: File) => {
  const formData = new FormData();

  formData.append('file', file);

  return client.post<string>('/profilePhoto', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const verificationTelegram = (code: string) => {
  return client.post<string>(`/verificationTelegram/${code}`);
};

export const disconnectTelegram = () => {
  return client.delete('/telegram/account');
};

export const changeEmail = (data: ChangeEmail) => {
  return client.put('/user/verificationNewMail', data);
};

export const deleteMaster = () => {
  return client.delete('/master');
};
