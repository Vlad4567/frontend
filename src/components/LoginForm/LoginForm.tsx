/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { SetStateAction, useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../Button/Button';
import { Checkbox } from '../Checkbox/Checkbox';
import { LoginInput } from '../LoginInput/LoginInput';
import { LoginHeaderForm } from '../LoginHeaderForm/LoginHeaderForm';
import { objectKeys } from '../../helpers/functions';
import { loginUser } from '../../api/login';
import { ErrorData } from '../../types/main';
import { useAppDispatch } from '../../app/hooks';
import * as notificationSlice from '../../features/notificationSlice';
import starsNotification from '../../img/icons/stars-notification.svg';
import './LoginForm.scss';
import { TypeLoginForm } from '../../types/login';

interface Props {
  setFormType: React.Dispatch<SetStateAction<TypeLoginForm>>
}

interface InitialErrors {
  email: string
  password: string
}

interface InitialData {
  email: string,
  password: string,
  remember: boolean
}

const initialErrors: InitialErrors = {
  email: '',
  password: '',
};

const initialData: InitialData = {
  email: '',
  password: '',
  remember: false,
};

export const LoginForm: React.FC<Props> = ({
  setFormType,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState(initialErrors);
  const [formData, setFormData] = useState<InitialData>(initialData);

  const {
    email,
    password,
  } = formData;

  useEffect(() => {
    if (searchParams.get('notification') === 'registration') {
      const params = new URLSearchParams(searchParams);

      params.delete('notification');
      setSearchParams(params);
      dispatch(notificationSlice.addNotification({
        id: +new Date(),
        title: 'You have successfully signed up!',
        description: `You can now save beauticians to your
          Favourites list and create a beautician profile`,
      }));
    }
  }, [dispatch, searchParams, setSearchParams]);

  const handleButtonLogin = () => {
    loginUser(formData)
      .then((res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('refreshToken', `${res.refreshToken}`);
        dispatch(
          notificationSlice.addNotification({
            id: +new Date(),
            icon: starsNotification,
            title: 'You have successfully logged in!',
            description: 'We are glad to see you again!',
          }),
        );
        navigate('/account');
      })
      .catch((err: AxiosError<ErrorData<string>>) => setFormErrors(c => {
        if (err.response?.data.error) {
          const objectErrors = { ...c };

          objectKeys(initialErrors).forEach(key => {
            objectErrors[key] = err.response?.data.error as string;
          });

          return objectErrors;
        }

        if (err.response?.data.errors) {
          const objectErrors = { ...c };

          objectKeys(initialErrors).forEach(key => {
            objectErrors[key] = err.response?.data.errors
              ? err.response?.data.errors[key]
              : '';
          });

          return objectErrors;
        }

        return c;
      }));
  };

  return (
    <>
      <LoginHeaderForm
        className="login-form__form-header"
        title="Log in"
        description="New user?"
        textLink="Create an account"
        onClick={() => setFormType('signUp')}
      />
      <div className="login-form__body">
        <div className="login-form__main">
          <LoginInput
            type="email"
            placeholder="E-mail"
            title="E-mail"
            value={email}
            onChange={(e) => setFormData(c => ({
              ...c,
              email: e.target.value,
            }))}
            errorText={formErrors.email}
          />
          <LoginInput
            type="password"
            placeholder="Password"
            title="Password"
            value={password}
            onChange={(e) => setFormData(c => ({
              ...c,
              password: e.target.value,
            }))}
            errorText={formErrors.password}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
          <small
            className="login-form__reset-link"
            onClick={() => setFormType('resetPassword')}
          >
            Forgotten password?
          </small>
        </div>
        <div className="login-form__footer">
          <label
            className="login-form__checkbox-label"
          >
            <Checkbox
              checked={formData.remember}
              onChange={(e) => setFormData(c => ({
                ...c,
                remember: e.target.checked,
              }))}
            />
            Stay logged in
          </label>
          <Button
            type="button"
            size="large"
            className="login-form__login"
            onClick={handleButtonLogin}
          >
            Log in
          </Button>
        </div>
      </div>
    </>
  );
};
