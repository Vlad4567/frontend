/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import { useDebounce } from 'usehooks-ts';
import { AxiosError } from 'axios';
import { Button } from '../Button/Button';
import { LoginInput } from '../LoginInput/LoginInput';
import { LoginHeaderForm } from '../LoginHeaderForm/LoginHeaderForm';
import {
  changeObjectStateKey, objectKeys,
} from '../../helpers/functions';
import { checkUserEmail, checkUsername, registrateUser }
  from '../../api/login';
import { ErrorData } from '../../types/main';
import * as notificationSlice from '../../features/notificationSlice';
import './SignUpForm.scss';
import { useAppDispatch } from '../../app/hooks';
import { TypeLoginForm } from '../../types/login';

interface Props {
  setFormType: React.Dispatch<React.SetStateAction<TypeLoginForm>>
}

export interface InitialData {
  username: string
  email: string
  password: string
  repeatPassword: string
}

export interface InitialErrors {
  username: string
  email: string
  password: string
}

export const initialData: InitialData = {
  username: '',
  email: '',
  password: '',
  repeatPassword: '',
};

export const initialErrors: InitialErrors = {
  username: '',
  email: '',
  password: '',
};

export const SignUpForm: React.FC<Props> = ({
  setFormType,
}) => {
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<InitialErrors>(initialErrors);
  const [formData, setFormData] = useState<InitialData>(initialData);
  const debouncedUsername = useDebounce(formData.username, 500);
  const debouncedEmail = useDebounce(formData.email, 500);

  useEffect(() => {
    if (debouncedUsername) {
      checkUsername(debouncedUsername)
        .then(res => typeof res === 'boolean' && (res ? changeObjectStateKey(
          'This username already exists',
          'username',
          setFormErrors,
        ) : changeObjectStateKey(
          '',
          'username',
          setFormErrors,
        )))
        .catch((err: AxiosError<ErrorData<string>>) => err.response?.data.error
          && changeObjectStateKey(
            err.response?.data.error,
            'username',
            setFormErrors,
          ));
    } else {
      changeObjectStateKey(
        '',
        'username',
        setFormErrors,
      );
    }
  }, [debouncedUsername]);

  useEffect(() => {
    if (debouncedEmail) {
      checkUserEmail(debouncedEmail)
        .then(res => typeof res === 'boolean' && (res ? changeObjectStateKey(
          'This email already exists',
          'email',
          setFormErrors,
        ) : changeObjectStateKey(
          '',
          'email',
          setFormErrors,
        )))
        .catch((err: AxiosError<ErrorData<string>>) => err.response?.data.error
          && changeObjectStateKey(
            err.response?.data.error,
            'email',
            setFormErrors,
          ));
    } else {
      changeObjectStateKey(
        '',
        'email',
        setFormErrors,
      );
    }
  }, [debouncedEmail]);

  const handleButtonRegistration = () => {
    registrateUser(formData)
      .then(() => {
        dispatch(notificationSlice.addNotification({
          id: +new Date(),
          title: 'A confirmation email has been sent to your email address.',
          description: `In addition to your inbox, check your spam folder.
            The email may have ended up there`,
        }));
        setFormType('login');
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

  useEffect(() => {
    if (!(
      formData.password
      && formData.repeatPassword
      && formData.password !== formData.repeatPassword
    )) {
      changeObjectStateKey(
        '',
        ['password'],
        setFormErrors,
      );
    } else {
      changeObjectStateKey(
        'Password mismatch',
        ['password'],
        setFormErrors,
      );
    }
  }, [formData.password, formData.repeatPassword]);

  const {
    username,
    email,
    password,
    repeatPassword,
  } = formData;

  return (
    <>
      <LoginHeaderForm
        className="sign-up-form__header"
        title="Sign up"
        description="Already have an account?"
        textLink="Log in"
        onClick={() => setFormType('login')}
      />
      <div className="sign-up-form__body">
        <div className="sign-up-form__main">
          <LoginInput
            type="text"
            placeholder="Username"
            title="Username"
            value={username}
            onChange={(e) => changeObjectStateKey(
              e.target.value,
              'username',
              setFormData,
            )}
            errorText={formErrors.username}
          />

          <LoginInput
            type="email"
            placeholder="E-mail"
            title="E-mail"
            value={email}
            onChange={(e) => changeObjectStateKey(
              e.target.value,
              'email',
              setFormData,
            )}
            errorText={formErrors.email}
          />

          <LoginInput
            type="password"
            placeholder="Password"
            title="Password"
            value={password}
            onChange={(e) => changeObjectStateKey(
              e.target.value,
              'password',
              setFormData,
            )}
            errorText={formErrors.password}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            onPaste={e => {
              e.preventDefault();

              return false;
            }}
            onCopy={e => {
              e.preventDefault();

              return false;
            }}
          />

          <LoginInput
            type="password"
            placeholder="Confirm password"
            title="Confirm password"
            value={repeatPassword}
            onChange={(e) => changeObjectStateKey(
              e.target.value,
              'repeatPassword',
              setFormData,
            )}
            errorText={formErrors.password}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            onPaste={e => {
              e.preventDefault();

              return false;
            }}
            onCopy={e => {
              e.preventDefault();

              return false;
            }}
          />
        </div>
        <div className="sign-up-form__footer">
          <small className="sign-up-form__policy-text">
            By clicking &quot;Sign up&quot; you agree to our
            Terms of service and Privacy policy
          </small>
          <Button
            size="large"
            className="sign-up-form__button"
            onClick={handleButtonRegistration}
          >
            Sign up
          </Button>
        </div>
      </div>
    </>
  );
};
