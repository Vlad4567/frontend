import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { Button } from '../Button/Button';
import { LoginInput } from '../LoginInput/LoginInput';
import { LoginHeaderForm } from '../LoginHeaderForm/LoginHeaderForm';
import { ErrorData } from '../../types/main';
import { objectKeys } from '../../helpers/functions';
import { useAuth } from '../../hooks/useAuth';
import './ResetPasswordForm.scss';

interface InitialErrors {
  email: string;
}

const initialErrors: InitialErrors = {
  email: '',
};

interface InitialData {
  email: string;
}

const initialData: InitialData = {
  email: '',
};

export const ResetPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();
  const [formData, setFormData] = useState<InitialData>(initialData);
  const [formErrors, setFormErrors] = useState<InitialErrors>(initialErrors);

  const { email } = formData;

  const handleResetPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email) {
      forgotPassword
        .mutateAsync(email)
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
    }
  };

  const handleEmailOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(c => ({ ...c, email: e.target.value }));
    setFormErrors(c => ({ ...c, email: '' }));
  };

  return (
    <form className="reset-password-form" onSubmit={handleResetPassword}>
      <LoginHeaderForm
        className="reset-password-form__header"
        title="Reset password"
        description=" "
        textLink="Go back?"
        onClick={() => navigate('/login')}
      />

      <div className="reset-password-form__reset">
        <p className="reset-password-form__description">
          Enter your email address you used to register earlier and we will send
          you a new password within the next 5 minutes
        </p>
      </div>

      <div className="reset-password-form__main">
        <LoginInput
          type="email"
          placeholder="E-mail"
          title="E-mail"
          value={email}
          onChange={handleEmailOnChange}
          errorText={formErrors.email}
        />
        <Button
          type="submit"
          size="large"
          className="reset-password-form__reset-btn"
        >
          Reset password
        </Button>
      </div>
    </form>
  );
};
