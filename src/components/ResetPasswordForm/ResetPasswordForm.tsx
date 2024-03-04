import React, { SetStateAction, useState } from 'react';
import { AxiosError } from 'axios';
import { Button } from '../Button/Button';
import { LoginInput } from '../LoginInput/LoginInput';
import { LoginHeaderForm } from '../LoginHeaderForm/LoginHeaderForm';
import { forgotPassword } from '../../api/login';
import { useAppDispatch } from '../../app/hooks';
import * as notificationSlice from '../../features/notificationSlice';
import { ErrorData } from '../../types/main';
import { objectKeys } from '../../helpers/functions';
import { TypeLoginForm } from '../../types/login';
import './ResetPasswordForm.scss';

interface Props {
  setFormType: React.Dispatch<SetStateAction<TypeLoginForm>>
}

interface InitialErrors {
  email: string
}

const initialErrors: InitialErrors = {
  email: '',
};

interface InitialData {
  email: string
}

const initialData: InitialData = {
  email: '',
};

export const ResetPasswordForm: React.FC<Props> = ({
  setFormType,
}) => {
  const [formData, setFormData] = useState<InitialData>(initialData);
  const [formErrors, setFormErrors] = useState<InitialErrors>(initialErrors);
  const dispatch = useAppDispatch();

  const { email } = formData;

  const handleResetPassword = () => {
    if (email) {
      forgotPassword(email)
        .then(() => dispatch(notificationSlice.addNotification({
          id: +new Date(),
          title: 'A new password has been sent to your email address.',
          description: `In addition to your inbox, check your spam folder.
            The email may have ended up there.`,
        })))
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
    }
  };

  const handleEmailOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(c => ({ ...c, email: e.target.value }));
    setFormErrors(c => ({ ...c, email: '' }));
  };

  return (
    <>
      <LoginHeaderForm
        className="reset-password-form__header"
        title="Reset password"
        description=" "
        textLink="Go back?"
        onClick={() => setFormType('login')}
      />

      <div className="reset-password-form__reset">
        <p className="reset-password-form__description">
          Enter your email address you used to register earlier
          and we will send you a new password within the next 5 minutes
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
          size="large"
          className="reset-password-form__reset-btn"
          onClick={handleResetPassword}
        >
          Reset password
        </Button>
      </div>
    </>
  );
};
