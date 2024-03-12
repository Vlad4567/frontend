/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import * as appSlice from '../../features/appSlice';
import { useAppDispatch } from '../../app/hooks';
import { ArrowButton } from '../../components/ArrowButton/ArrowButton';
import { LoginHeaderForm }
  from '../../components/LoginHeaderForm/LoginHeaderForm';
import './LoginPage.scss';

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
          onClick={() => navigate('sign-up', { replace: true })}
        />
      );

    case 'sign-up':
      return (
        <LoginHeaderForm
          className={className}
          title="Sign up"
          description="Already have an account?"
          textLink="Log in"
          onClick={() => navigate('login', { replace: true })}
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
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const pathArray = useLocation().pathname.split('/');
  const currentPathName = pathArray[pathArray.length - 1];
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');

  useIsomorphicLayoutEffect(() => {
    dispatch(appSlice.setShownFooter(false));

    return () => {
      dispatch(appSlice.setShownFooter(true));
    };
  }, [dispatch]);

  useIsomorphicLayoutEffect(() => {
    if (token || refreshToken) {
      navigate('/account', { replace: true });
    }
  }, []);

  return (
    <main className="login-page">
      <ArrowButton
        position="left"
        className="login-page__arrow"
        onClick={() => navigate(-1)}
      />
      {renderLoginHeaderForm(
        currentPathName,
        navigate,
        'login-page__header',
      )}

      <Outlet />
    </main>
  );
};
