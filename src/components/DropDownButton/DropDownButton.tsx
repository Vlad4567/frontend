/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { forwardRef } from 'react';
import classNames from 'classnames';
import iconOpenWhite from '../../img/icons/icon-dropdown-up-white.svg';
import iconOpenBlack from '../../img/icons/icon-dropdown-down-black.svg';
import iconClose from '../../img/icons/icon-dropdown-close.svg';
import iconGrey from '../../img/icons/icon-dropdown-down-grey.svg';
import './DropDownButton.scss';

interface Props
  extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onChange'
  | 'className'
  > {
  className?: string
  icon?: boolean
  input?: boolean
  size: 'large' | 'small'
  placeholder: string
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void
  handleIconOnClick?: (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => void
  active?: boolean
  value?: string
  inputRef?: React.Ref<HTMLInputElement>
}

export const DropDownButton = forwardRef<HTMLButtonElement, Props>(({
  className = '',
  icon = false,
  input = false,
  size,
  placeholder = '',
  onChange = () => { },
  handleIconOnClick = () => { },
  active = false,
  value = '',
  inputRef,
  ...rest
}, ref) => {
  const pathToIcon
    = (active && (input ? iconClose : iconOpenWhite))
    || (rest.disabled ? iconGrey : iconOpenBlack);

  const handleIcon = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    if (pathToIcon === iconClose) {
      handleIconOnClick(e);
    }
  };

  return (
    <button
      type="button"
      className={classNames(
        `drop-down-button drop-down-button--${size} ${className}`, {
          'drop-down-button--icon': icon,
          'drop-down-button--active': active,
          'drop-down-button--scale': !(icon && active && input),
        },
      )}
      ref={ref}
      {...rest}
    >
      {
        (active && icon && input)
          ? (
            <input
              ref={inputRef}
              className="drop-down-button__input"
              type="text"
              placeholder={placeholder}
              value={value}
              onClick={(e) => e.stopPropagation()}
              onChange={onChange}
            />
          ) : (
            <p className="drop-down-button__text">
              {placeholder}
            </p>
          )
      }
      {icon && (
        <img
          className="drop-down-button__icon"
          src={pathToIcon}
          onClick={handleIcon}
          alt="icon"
        />
      )}
    </button>
  );
});
