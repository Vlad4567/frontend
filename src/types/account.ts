export interface UserData {
  email: string;
  username: string;
  profilePhoto: string | null;
  master: boolean;
  telegramAccount: {
    telegramUsername: string;
  } | null;
}

export type UpdateUserData = Pick<UserData, 'email' | 'username'>;

export interface PasswordData {
  currentPassword: string;
  newPassword: string;
}

export type TypeModal =
  | ''
  | 'formTelegram'
  | 'disconnectTelegram'
  | 'ResetEmail';

export interface ChangeEmail {
  newEmail: string;
  password: string;
}
