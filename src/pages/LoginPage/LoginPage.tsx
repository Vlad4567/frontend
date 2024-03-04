/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';
import { useNavigate } from 'react-router-dom';
import * as appSlice from '../../features/appSlice';
import { useAppDispatch } from '../../app/hooks';
import { ArrowButton } from '../../components/ArrowButton/ArrowButton';
import { LoginHeaderForm }
  from '../../components/LoginHeaderForm/LoginHeaderForm';
import './LoginPage.scss';
import { SignUpForm } from '../../components/SignUpForm/SignUpForm';
import { LoginForm } from '../../components/LoginForm/LoginForm';
import { ResetPasswordForm }
  from '../../components/ResetPasswordForm/ResetPasswordForm';
import { TypeLoginForm } from '../../types/login';

const renderLoginHeaderForm = (
  formType: Omit<TypeLoginForm, 'resetPassword'>,
  setFormType: React.Dispatch<React.SetStateAction<TypeLoginForm>>,
  className: string,
) => {
  switch (formType) {
    case 'login':
      return (
        <LoginHeaderForm
          className={className}
          title="Log in"
          description="New user?"
          textLink="Create an account"
          onClick={() => setFormType('signUp')}
        />
      );

    case 'signUp':
      return (
        <LoginHeaderForm
          className={className}
          title="Sign up"
          description="Already have an account?"
          textLink="Log in"
          onClick={() => setFormType('login')}
        />
      );

    default:
      return (
        <LoginHeaderForm
          className={className}
          title=" "
          description=" "
          textLink=" "
          onClick={() => setFormType('login')}
        />
      );
  }
};

export const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');

  const [formType, setFormType] = useState<TypeLoginForm>('login');

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
        formType,
        setFormType,
        'login-page__header',
      )}

      <form className="login-page__form">

        {formType === 'signUp' && (
          <SignUpForm setFormType={setFormType} />
        )}

        {formType === 'login' && (
          <LoginForm
            setFormType={setFormType}
          />
        )}

        {formType === 'resetPassword' && (
          <ResetPasswordForm setFormType={setFormType} />
        )}

      </form>
    </main>
  );
};
