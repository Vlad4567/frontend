/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { AxiosError } from 'axios';
import { SetStateAction, forwardRef, useState } from 'react';
import { Button } from '../Button';
import { LoginInput } from '../LoginInput/LoginInput';
import { UnderlinedSmall } from '../UnderlinedSmall/UnderlinedSmall';
import { TypeModal } from '../../types/account';
import { ErrorData } from '../../types/main';
import closeIcon from '../../img/icons/icon-dropdown-close.svg';
import { useAuth } from '../../hooks/useAuth';
import './LoginFormTelegram.scss';

type TypeButton = 'GetTheCode' | 'Confirm';
type TypeForm = 'form' | 'modal';

interface Props {
  className?: string;
  title?: string;
  description?: string;
  type?: TypeForm;
  setModal?: React.Dispatch<SetStateAction<TypeModal>>;
  onSubmit?: (value: string) => void;
  onClose?: () => void;
}

export const LoginFormTelegram = forwardRef<HTMLFormElement, Props>(
  (
    {
      type = 'form',
      className = '',
      title = 'Log in with Telegram',
      description = 'Enter the code that was sent in Telegram',
      setModal = () => {},
      onSubmit = null,
      onClose = null,
    },
    ref,
  ) => {
    const navigate = useNavigate();
    const { authLoginTelegram } = useAuth();
    const [button, setButton] = useState<TypeButton>('GetTheCode');
    const [fieldErrors, setFieldErrors] = useState('');
    const [field, setField] = useState('');

    const handleChangeField = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^0-9]/g, '');

      setField(value);
    };

    const handleClickBack = () => {
      if (type === 'modal') {
        setModal('');
      } else {
        navigate(-1);
      }
    };

    const handleConfirm = () => {
      if (!onSubmit) {
        authLoginTelegram
          .mutateAsync(+field)
          .then(() => {
            navigate('/account');
          })
          .catch((err: AxiosError<ErrorData<string>>) => {
            setFieldErrors(err.response?.data.error || '');
          });
      } else {
        onSubmit(field);
      }
    };

    return (
      <form
        className={classNames(`login-form-telegram ${className}`, {
          'login-form-telegram__header--confirm': button === 'Confirm',
        })}
        ref={ref}
      >
        <div className="login-form-telegram__header">
          <div className="login-form-telegram__header-block">
            <div className="login-form-telegram__header-content">
              <h3 className="login-form-telegram__title">{title}</h3>

              <p className="login-form-telegram__description">{description}</p>
            </div>

            {onClose ? (
              <img
                src={closeIcon}
                alt="Close Icon"
                className="login-form-telegram__close-icon"
                onClick={() => onClose()}
              />
            ) : (
              <p
                className="
                  login-form-telegram__link
                  login-form-telegram__link--top
                "
                onClick={handleClickBack}
              >
                Go back ?
              </p>
            )}
          </div>
        </div>

        {button === 'GetTheCode' && (
          <p className="login-form-telegram__description">
            Click on the button and you will go to our bot @SparkleServiceBot in
            Telegram where you will receive a code to log in to your account
          </p>
        )}

        {button === 'Confirm' && (
          <div className="login-form-telegram__field">
            <LoginInput
              type="text"
              title="Enter 6 numbers"
              placeholder="Enter 6 numbers"
              maxLength={6}
              value={field}
              onChange={handleChangeField}
              errorText={fieldErrors}
            />

            <Link
              to="https://t.me/SparkleServiceBot"
              target="_blank"
              className="login-form-telegram__reset-link"
            >
              <UnderlinedSmall>Didn&#x27;t get the code?</UnderlinedSmall>
            </Link>
          </div>
        )}

        {button === 'GetTheCode' ? (
          <Link to="https://t.me/SparkleServiceBot" target="_blank">
            <Button
              type="button"
              size="large"
              className="login-form-telegram__login"
              onClick={() => setButton('Confirm')}
            >
              Get the code
            </Button>
          </Link>
        ) : (
          <Button
            type="button"
            size="large"
            className="login-form-telegram__login"
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        )}
      </form>
    );
  },
);
LoginFormTelegram.displayName = 'LoginFormTelegram';
