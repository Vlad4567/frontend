import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import instance from '../utils/axiosInterceptors';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useLocalStorage } from 'usehooks-ts';

const queryKey = 'token';

export const useToken = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const pathnameArray = pathname.split('/');
  const tokenStorage = useLocalStorage<string | undefined>('token', undefined, {
    serializer: value => value || '',
    deserializer: value => value,
  });
  const refreshTokenStorage = useLocalStorage<string | undefined>(
    'refreshToken',
    undefined,
    {
      serializer: value => value || '',
      deserializer: value => value,
    },
  );

  const [token, setToken] = tokenStorage;
  const [refreshToken] = refreshTokenStorage;

  const redirectToLoginPage = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    if (pathnameArray.includes('account')) {
      navigate('/login');
    }
  };

  const checkTokenValidity = async () => {
    if (!refreshToken && !token) {
      redirectToLoginPage();

      return;
    }

    if (!token) {
      try {
        const { data } = await axios.post<{ token: string }>(
          `${instance.defaults.baseURL}/auth/refresh`,
          {
            refreshToken,
          },
        );

        setToken(data.token);
      } catch {
        redirectToLoginPage();

        return;
      }
    }

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if ((decodedToken.exp || currentTime) - currentTime < 60) {
          const { data } = await axios.post<{ token: string }>(
            `${instance.defaults.baseURL}/auth/refresh`,
            { refreshToken },
          );

          setToken(data.token);
        }
      } catch {
        redirectToLoginPage();
      }
    }
  };

  useEffect(() => {
    checkTokenValidity();

    if (!queryClient.getQueryData([queryKey, 'checkTokenValidity'])) {
      queryClient.setQueryData(
        [queryKey, 'checkTokenValidity'],
        setInterval(checkTokenValidity, 60000),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    tokenStorage,
    refreshTokenStorage,
  };
};
