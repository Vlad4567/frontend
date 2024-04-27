/* eslint-disable jsx-a11y/label-has-associated-control */
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import { AxiosError } from 'axios';
import { changeObjectStateKey } from '../../helpers/functions';
import { Checkbox } from '../../components/Checkbox';
import { DropDownButton } from '../../components/DropDownButton/DropDownButton';
import { LoginInput } from '../../components/LoginInput/LoginInput';
import { UnderlinedSmall } from '../../components/UnderlinedSmall/UnderlinedSmall';
import { PasswordData, TypeModal, UpdateUserData } from '../../types/account';
import { ErrorData } from '../../types/main';
import { CreateModal } from '../../components/CreateModal';
import { ModalAlertMessage } from '../../components/ModalAlertMessage/ModalAlertMessage';
import { useNotification } from '../../hooks/useNotification';
import { useUser } from '../../hooks/useUser';
import { useAuth } from '../../hooks/useAuth';
import './PersonalDetailsPage.scss';

interface InitialDataErrors {
  email: string;
  username: string;
  currentPassword: string;
  newPassword: string;
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
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const {
    queryUser: { data: user },
    updateUser,
    updateEmail,
    updatePassword,
  } = useUser();
  const { checkUserEmail, checkUsername, forgotPassword } = useAuth();
  const [modal, setModal] = useState<TypeModal | ''>('');
  const modalRef = useRef(null);
  const [password, setPassword] = useState('');
  const [errorPassword, setErrorPassword] = useState('');

  const initialUserData = {
    username: user.username,
    email: user.email,
    ...passwordData,
  };

  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState<UpdateUserData & PasswordData>(
    initialUserData,
  );
  const [errors, setErrors] = useState<InitialDataErrors>(initialDataErrors);

  useEffect(
    () =>
      setUserData({
        username: user.username,
        email: user.email,
        ...passwordData,
      }),
    [user.username, user.email],
  );

  const isApplyDisabled =
    JSON.stringify(userData) === JSON.stringify(initialUserData) ||
    JSON.stringify(errors) !== JSON.stringify(initialDataErrors);

  const handleClickOutside = () => {
    setModal('');
    setUserData(c => ({ ...c, email: user.email }));
  };

  useOnClickOutside<HTMLFormElement>([modalRef], handleClickOutside);

  const handleChangeEmail = () => {
    updateEmail
      .mutateAsync({
        newEmail: userData.email,
        password,
      })
      .then(() => {
        setModal('');
        setPassword('');
      })
      .catch((err: AxiosError<ErrorData<string>>) => {
        setErrorPassword(err.response?.data.error || 'Error updating email');
      });
  };

  const cancelChangingEmail = () => {
    setModal('');
    setUserData(c => ({ ...c, email: user.email }));
  };

  const handleResetPassword = () => {
    if (user.email) {
      forgotPassword
        .mutateAsync(user.email)
        .catch((err: AxiosError<ErrorData<string>>) => {
          if (err.response?.data) {
            const resError =
              err.response.data.error ||
              Object.values(err.response.data.errors || {})[0];

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

    if (JSON.stringify(errors) === JSON.stringify(initialDataErrors)) {
      if (userData.currentPassword.length && userData.newPassword.length) {
        updatePassword
          .mutateAsync({
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
            if (err.response?.data.error) {
              const res = err.response.data.error;

              setErrors(c => ({
                ...c,
                currentPassword: res || '',
                newPassword: res || '',
              }));
            }

            if (err.response?.data.errors) {
              const resErrorCurrentPassword =
                err.response.data.errors.currentPassword;
              const resErrorNewPassword = err.response.data.errors.newPassword;

              setErrors(c => ({
                ...c,
                currentPassword: resErrorCurrentPassword || '',
                newPassword: resErrorNewPassword || '',
              }));
            }
          });
      }

      if (
        userData.email !== user.email ||
        userData.username !== user.username
      ) {
        updateUser
          .mutateAsync({
            email: userData.email,
            username: userData.username,
          })
          .then(res => {
            if (res.newEmail) {
              setModal('ResetEmail');
            }
          })
          .catch((err: AxiosError<ErrorData<string>>) => {
            if (err.response?.data.error) {
              const res = err.response.data.error;

              setErrors(c => ({
                ...c,
                email: res,
                username: res,
              }));
            }

            if (err.response?.data.errors) {
              const resErrorEmail = err.response.data.errors.email;
              const resErrorUsername = err.response.data.errors.username;

              setErrors(c => ({
                ...c,
                email: resErrorEmail,
                username: resErrorUsername,
              }));
            }
          });
      }
    } else {
      addNotification('error');
    }
  };

  useEffect(() => {
    if (userData.username !== user.username && userData.username) {
      checkUsername
        .mutateAsync(userData.username)
        .then(res =>
          setErrors(c => ({
            ...c,
            username: res ? 'This username already exists' : '',
          })),
        )
        .catch(
          (err: AxiosError<ErrorData<string>>) =>
            err.response?.data.error &&
            changeObjectStateKey(
              err.response?.data.error,
              'username',
              setErrors,
            ),
        );
    } else {
      setErrors(c => ({
        ...c,
        username: '',
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData.username]);

  useEffect(() => {
    if (userData.email !== user.email && userData.email) {
      checkUserEmail
        .mutateAsync(userData.email)
        .then(res =>
          setErrors(c => ({
            ...c,
            email: res ? 'This email already exists' : '',
          })),
        )
        .catch(
          (err: AxiosError<ErrorData<string>>) =>
            err.response?.data.error &&
            changeObjectStateKey(err.response?.data.error, 'email', setErrors),
        );
    } else {
      setErrors(c => ({
        ...c,
        email: '',
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData.email]);

  const handleInputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setErrors(c => ({ ...c, [name]: '' }));

    changeObjectStateKey(value, name as keyof InitialDataErrors, setUserData);
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
          <>
            <LoginInput
              errorText={errors.email}
              value={userData.email}
              onChange={handleInputOnChange}
              type="email"
              name="email"
              title="Email address"
              placeholder="Email address"
            />

            {modal && (
              <CreateModal>
                <ModalAlertMessage
                  title="Reset email"
                  description="
                    Enter your password you used
                    to register earlier to change an email
                  "
                  ref={modalRef}
                  onClose={cancelChangingEmail}
                  dangerPlaceholder="Reset email"
                  simplePlaceholder="Cancel"
                  onClickDanger={handleChangeEmail}
                  onClickSimple={cancelChangingEmail}
                >
                  <LoginInput
                    type="password"
                    placeholder="Password"
                    title="Password"
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    errorText={errorPassword}
                  />
                </ModalAlertMessage>
              </CreateModal>
            )}
          </>
        </div>
        <div className="personal-details-page__main-password">
          <div className="personal-details-page__main-password-header">
            <h3 className="personal-details-page__main-password-header-title">
              Reset password
            </h3>
            <p
              className="
              personal-details-page__main-password-header-paragraph
              "
            >
              Enter your password you used to register earlier to change a
              password
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
          {user.email && (
            <UnderlinedSmall
              className="personal-details-page__main-password-reset"
              onClick={handleResetPassword}
            >
              Forgotten password?
            </UnderlinedSmall>
          )}
        </div>
      </div>

      <div className="personal-details-page__footer">
        {!user.master && (
          <label className="personal-details-page__footer-become-master-label">
            <div className="personal-details-page__footer-become-master">
              <Checkbox
                checked={user.master}
                onChange={() => navigate('../edit-public-profile/area-of-work')}
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
