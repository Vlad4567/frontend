/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import './LoginInput.scss';
import classNames from 'classnames';
import eyePasswordHide from '../../img/icons/eye-password-hide.svg';
import eyePasswordShow from '../../img/icons/eye-password-show.svg';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
  title?: string
  errorText?: string
  showPassword?: boolean
  setShowPassword?: React.Dispatch<React.SetStateAction<boolean>>
}

export const LoginInput: React.FC<Props> = ({
  className = '',
  type,
  title = '',
  errorText = '',
  showPassword = false,
  setShowPassword = () => { },
  ...rest
}) => {
  const typePassword = type === 'password';
  const pathToPasswordIcon = showPassword ? eyePasswordShow : eyePasswordHide;

  return (
    <label className="login-input">
      <div className="login-input__block">
        <small className={classNames('login-input__title', {
          'login-input__title--show': rest.value,
        })}
        >
          {title}
        </small>
        <input
          type={showPassword ? 'text' : type}
          className={classNames('login-input__input', { className })}
          {...rest}
        />
        {typePassword && (
          <img
            src={pathToPasswordIcon}
            alt="Eye password"
            className="login-input__image"
            onClick={() => setShowPassword(c => !c)}
          />
        )}
      </div>

      {errorText && (
        <small className="login-input__error">
          <span className="login-input__error-icon">!</span>
          {errorText}
        </small>
      )}
    </label>
  );
};
