/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { LoginInput } from '../LoginInput/LoginInput';
import { LoginHeaderForm } from '../LoginHeaderForm/LoginHeaderForm';
import { objectKeys } from '../../helpers/functions';
import { ErrorData } from '../../types/main';
import { UnderlinedSmall } from '../UnderlinedSmall/UnderlinedSmall';
import { DropDownButton } from '../DropDownButton/DropDownButton';
import telegramIcon from '../../img/icons/icon-telegram.svg';
import { useAuth } from '../../hooks/useAuth';
import './LoginForm.scss';

interface InitialErrors {
  email: string;
  password: string;
}

interface InitialData {
  email: string;
  password: string;
  remember: boolean;
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

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState(initialErrors);
  const [formData, setFormData] = useState<InitialData>(initialData);

  const { email, password } = formData;

  const handleButtonLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    loginUser
      .mutateAsync(formData)
      .then(() => {
        navigate('/account');
      })
      .catch((err: AxiosError<ErrorData<string>>) =>
        setFormErrors(c => {
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
        }),
      );
  };

  return (
    <form className="login-form" onSubmit={handleButtonLogin}>
      <LoginHeaderForm
        className="login-form__form-header"
        title="Log in"
        description="New user?"
        textLink="Create an account"
        onClick={() => navigate('signup')}
      />
      <div className="login-form__body">
        <div className="login-form__main">
          <LoginInput
            type="email"
            placeholder="E-mail"
            title="E-mail"
            value={email}
            onChange={e =>
              setFormData(c => ({
                ...c,
                email: e.target.value,
              }))
            }
            errorText={formErrors.email}
          />
          <LoginInput
            type="password"
            placeholder="Password"
            title="Password"
            value={password}
            onChange={e =>
              setFormData(c => ({
                ...c,
                password: e.target.value,
              }))
            }
            errorText={formErrors.password}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
          <UnderlinedSmall
            className="login-form__reset-link"
            onClick={() => navigate('reset-password')}
          >
            Forgotten password?
          </UnderlinedSmall>
        </div>
        <div className="login-form__footer">
          <label className="login-form__checkbox-label">
            <Checkbox
              checked={formData.remember}
              onChange={e =>
                setFormData(c => ({
                  ...c,
                  remember: e.target.checked,
                }))
              }
            />
            Stay logged in
          </label>
          <div className="login-form__buttons">
            <Button type="submit" size="large" className="login-form__login">
              Log in
            </Button>

            <DropDownButton
              type="submit"
              size="large"
              className="login-form__login login-form__login--telegram"
              onClick={() => navigate('telegram')}
            >
              <img src={telegramIcon} alt="Telegram" />
              Log in with Telegram
            </DropDownButton>
          </div>
        </div>
      </div>
    </form>
  );
};
