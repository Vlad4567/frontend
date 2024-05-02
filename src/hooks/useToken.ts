import Cookies, { CookieAttributes } from 'js-cookie';

export const storageTokenKeys = {
  token: 'token',
  refreshToken: 'refreshToken',
};

export const useToken = () => {
  const tokenStorage = {
    token: Cookies.get(storageTokenKeys.token),
    setToken: (token: string, options?: CookieAttributes) =>
      Cookies.set(storageTokenKeys.token, token, options),
    removeToken: () => Cookies.remove(storageTokenKeys.token),
  };

  const refreshTokenStorage = {
    refreshToken: Cookies.get(storageTokenKeys.refreshToken),
    setRefreshToken: (refreshToken: string, options?: CookieAttributes) =>
      Cookies.set(storageTokenKeys.refreshToken, refreshToken, options),
    removeRefreshToken: () => Cookies.remove(storageTokenKeys.refreshToken),
  };

  return {
    tokenStorage,
    refreshTokenStorage,
  };
};
