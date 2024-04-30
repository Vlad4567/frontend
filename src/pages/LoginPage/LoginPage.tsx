/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ArrowButton } from '../../components/ArrowButton/ArrowButton';
import { LoginHeaderForm } from '../../components/LoginHeaderForm/LoginHeaderForm';
import { useApp } from '../../hooks/useApp';
import './LoginPage.scss';
import { useToken } from '../../hooks/useToken';

const renderLoginHeaderForm = (
  pathName: string,
  navigate: ReturnType<typeof useNavigate>,
  className: string,
) => {
  switch (pathName) {
    case 'login':
      return (
        <LoginHeaderForm
          className={className}
          title="Log in"
          description="New user?"
          textLink="Create an account"
          onClick={() => navigate('/login/signup', { replace: true })}
        />
      );

    case 'signup':
      return (
        <LoginHeaderForm
          className={className}
          title="Sign up"
          description="Already have an account?"
          textLink="Log in"
          onClick={() => navigate('/login', { replace: true })}
        />
      );

    default:
      return (
        <LoginHeaderForm
          className={className}
          title=" "
          description=" "
          textLink=" "
          onClick={() => navigate(-1)}
        />
      );
  }
};

export const LoginPage: React.FC = () => {
  const { updateApp } = useApp();
  const navigate = useNavigate();
  const pathArray = useLocation().pathname.split('/');
  const currentPathName = pathArray[pathArray.length - 1];
  const {
    tokenStorage: [token],
    refreshTokenStorage: [refreshToken],
  } = useToken();

  useIsomorphicLayoutEffect(() => {
    updateApp({ footerShown: false });

    return () => {
      updateApp({ footerShown: true });
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (token || refreshToken) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
  }, []);

  return (
    <main className="login-page">
      <ArrowButton
        position="left"
        className="login-page__arrow"
        onClick={() => navigate(-1)}
      />
      {renderLoginHeaderForm(currentPathName, navigate, 'login-page__header')}

      <Outlet />
    </main>
  );
};
