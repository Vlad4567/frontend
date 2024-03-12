export interface Login {
  email: string,
  password: string,
}

export interface Registration extends Login {
  username: string,
  repeatPassword: string,
}

export interface Token {
  token: string
  refreshToken: string | null
}
