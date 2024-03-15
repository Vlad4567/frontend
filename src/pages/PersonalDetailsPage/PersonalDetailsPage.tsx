/* eslint-disable jsx-a11y/label-has-associated-control */
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDebounce } from 'usehooks-ts';
import { AxiosError } from 'axios';
import {
  changeObjectStateKey,
} from '../../helpers/functions';
import { Checkbox } from '../../components/Checkbox/Checkbox';
import { DropDownButton } from '../../components/DropDownButton/DropDownButton';
import { LoginInput } from '../../components/LoginInput/LoginInput';
import './PersonalDetailsPage.scss';
import { UnderlinedSmall }
  from '../../components/UnderlinedSmall/UnderlinedSmall';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { PasswordData, UserData } from '../../types/account';
import { debounceDelay } from '../../helpers/variables';
import { checkUserEmail, checkUsername, forgotPassword } from '../../api/login';
import { ErrorData } from '../../types/main';
import { showNotification } from '../../helpers/notifications';
import { putPassword, putUser } from '../../api/account';
import * as userSlice from '../../features/userSlice';

interface InitialDataErrors {
  email: string,
  username: string,
  currentPassword: string,
  newPassword: string,
}

const initialDataErrors: InitialDataErrors = {
  email: '',
  username: '',
  currentPassword: '',
  newPassword: '',
};

const passwordData: PasswordData = {
  currentPassword: '',
  newPassword: '',
};

export const PersonalDetailsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.userSlice);
  const navigate = useNavigate();

  const initialUserData = {
    username: user.username,
    email: user.email,
    ...passwordData,
  };

  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState<
  Omit<UserData, 'profilePhoto' | 'master'> & PasswordData
  >(initialUserData);
  const [errors, setErrors] = useState<InitialDataErrors>(initialDataErrors);

  const debouncedUsername = useDebounce(userData.username, debounceDelay);
  const debouncedEmail = useDebounce(userData.email, debounceDelay);

  const isApplyDisabled = JSON.stringify(userData)
    === JSON.stringify(initialUserData)
    || JSON.stringify(errors) !== JSON.stringify(initialDataErrors);

  const handleResetPassword = () => {
    if (user.email) {
      forgotPassword(user.email)
        .then(() => showNotification('resetPassword'))
        .catch((err: AxiosError<ErrorData<string>>) => {
          showNotification('error');
          if (err.response?.data) {
            const resError = err.response.data.error
              || Object.values(err.response.data.errors || {})[0];

            setErrors(c => ({
              ...c,
              email: resError,
            }));
          }
        });
    }
  };

  const handleButtonApply = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (
      JSON.stringify(errors) === JSON.stringify(initialDataErrors)
    ) {
      if (
        userData.currentPassword.length
        && userData.newPassword.length
      ) {
        putPassword({
          currentPassword: userData.currentPassword,
          newPassword: userData.newPassword,
        })
          .then(() => {
            setUserData(c => ({
              ...c,
              currentPassword: '',
              newPassword: '',
            }));
          })
          .catch((err: AxiosError<ErrorData<string>>) => {
            showNotification('error');

            if (err.response?.data.error) {
              const res = err.response.data.error;

              setErrors(c => ({
                ...c,
                currentPassword: res || '',
                newPassword: res || '',
              }));
            }

            if (err.response?.data.errors) {
              const resErrorCurrentPassword
                = err.response.data.errors.currentPassword;
              const resErrorNewPassword
                = err.response.data.errors.newPassword;

              setErrors(c => ({
                ...c,
                currentPassword: resErrorCurrentPassword || '',
                newPassword: resErrorNewPassword || '',
              }));
            }
          });
      }

      if (
        userData.email !== user.email
        || userData.username !== user.username
      ) {
        putUser({
          email: userData.email,
          username: userData.username,
        })
          .then(() => {
            showNotification('confirmationEmail');

            dispatch(userSlice.updateUser({
              username: userData.username,
            }));
          })
          .catch((err: AxiosError<ErrorData<string>>) => {
            showNotification('error');

            if (err.response?.data.error) {
              const res = err.response.data.error;

              setErrors(c => ({
                ...c,
                email: res,
                username: res,
              }));
            }

            if (err.response?.data.errors) {
              const resErrorEmail
                = err.response.data.errors.email;
              const resErrorUsername
                = err.response.data.errors.username;

              setErrors(c => ({
                ...c,
                email: resErrorEmail,
                username: resErrorUsername,
              }));
            }
          });
      }
    } else {
      showNotification('error');
    }
  };

  useEffect(() => {
    setUserData(c => ({
      ...c,
      username: user.username,
      email: user.email,
    }));
  }, [user]);

  useEffect(() => {
    if (debouncedUsername !== user.username) {
      checkUsername(debouncedUsername)
        .then(res => typeof res === 'boolean' && (res ? setErrors(c => ({
          ...c,
          username: 'This username already exists',
        })) : setErrors(c => ({
          ...c,
          username: '',
        }))))
        .catch((err: AxiosError<ErrorData<string>>) => err.response?.data.error
          && changeObjectStateKey(
            err.response?.data.error,
            'username',
            setErrors,
          ));
    } else {
      setErrors(c => ({
        ...c,
        username: '',
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedUsername]);

  useEffect(() => {
    if (debouncedEmail !== user.email) {
      checkUserEmail(debouncedEmail)
        .then(res => typeof res === 'boolean' && (res ? setErrors(c => ({
          ...c,
          email: 'This username already exists',
        })) : setErrors(c => ({
          ...c,
          email: '',
        }))))
        .catch((err: AxiosError<ErrorData<string>>) => err.response?.data.error
          && changeObjectStateKey(
            err.response?.data.error,
            'email',
            setErrors,
          ));
    } else {
      setErrors(c => ({
        ...c,
        email: '',
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedEmail]);

  const handleInputOnChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;

    setErrors(c => ({ ...c, [name]: '' }));

    changeObjectStateKey(
      value,
      name as keyof InitialDataErrors,
      setUserData,
    );
  };

  return (
    <>
      <div className="personal-details-page__main">
        <div className="personal-details-page__main-data">
          <LoginInput
            errorText={errors.username}
            value={userData.username}
            onChange={handleInputOnChange}
            name="username"
            title="Username"
            placeholder="Username"
          />
          <LoginInput
            errorText={errors.email}
            value={userData.email}
            onChange={handleInputOnChange}
            type="email"
            name="email"
            title="Email address"
            placeholder="Email address"
          />
        </div>
        <div className="personal-details-page__main-password">
          <div className="personal-details-page__main-password-header">
            <h3 className="personal-details-page__main-password-header-title">
              Reset password
            </h3>
            <p
              className="personal-details-page__main-password-header-paragraph"
            >
              Enter your password you used to register earlier to
              change a password
            </p>
          </div>
          <LoginInput
            value={userData.currentPassword}
            onChange={handleInputOnChange}
            errorText={errors.currentPassword}
            type="password"
            name="currentPassword"
            title="Current password"
            placeholder="Current password"
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
            value={userData.newPassword}
            onChange={handleInputOnChange}
            errorText={errors.newPassword}
            type="password"
            name="newPassword"
            title="New password"
            placeholder="New password"
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
          <UnderlinedSmall
            className="personal-details-page__main-password-reset"
            onClick={handleResetPassword}
          >
            Forgotten password?
          </UnderlinedSmall>
        </div>
      </div>

      <div className="personal-details-page__footer">
        {!user.master && (
          <label className="personal-details-page__footer-become-master-label">
            <div className="personal-details-page__footer-become-master">
              <Checkbox
                checked={user.master}
                onChange={() => navigate('../edit-public-profile')}
              />
              I am Master
            </div>
          </label>
        )}

        <div className="personal-details-page__footer-btns">
          <DropDownButton
            className="personal-details-page__footer-btn"
            size="small"
            placeholder="Cancel"
            onClick={() => setUserData(initialUserData)}
          />
          <DropDownButton
            className="personal-details-page__footer-btn"
            type="button"
            size="small"
            placeholder="Apply"
            onClick={handleButtonApply}
            disabled={isApplyDisabled}
          />
        </div>
      </div>
    </>
  );
};
