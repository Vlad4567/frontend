export interface UserData {
  email: string,
  username: string,
  profilePhoto: string | null,
  master: boolean
}

export interface PasswordData {
  currentPassword: string
  newPassword: string
}
