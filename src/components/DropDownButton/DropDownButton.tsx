/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useRef, useState } from 'react';
import './DropDownButton.scss';
import classNames from 'classnames';
import { useOnClickOutside } from 'usehooks-ts';
import iconOpenWhite from '../../img/icons/icon-dropdown-up-white.svg';
import iconOpenBlack from '../../img/icons/icon-dropdown-down-black.svg';
import iconClose from '../../img/icons/icon-dropdown-close.svg';

/* eslint-disable react/button-has-type */
interface Props
  extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onClick' | 'onChange'
  > {
  className?: string
  children?: React.ReactNode
  icon?: boolean
  input?: boolean
  placeholder: string
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void
  size: 'large' | 'small'
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    active: boolean
  ) => void
  dropDownMenuRef?: React.RefObject<HTMLDivElement>
  state?: boolean
  active?: boolean
  setActive?: React.Dispatch<React.SetStateAction<boolean>>
}

export const DropDownButton: React.FC<Props> = ({
  className = '',
  icon = false,
  input = false,
  size,
  children,
  placeholder = '',
  onChange = () => {},
  onClick = () => {},
  dropDownMenuRef,
  state = true,
  active = false,
  setActive = () => {},
  ...rest
}) => {
  const [inputValue, setInputValue] = useState('');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const pathToIcon
    = (active && (input ? iconClose : iconOpenWhite)) || iconOpenBlack;

  const handleOnClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (!dropDownMenuRef?.current?.contains(event.target as Node)) {
      setActive(e => state && !e);
    }

    onClick(event, active);
  };

  useEffect(() => {
    if (input) {
      inputRef.current?.focus();
    }
  }, [input, active]);

  const handleInputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange(e);
  };

  const handleInputOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Escape':
        setActive(false);
        break;

      default:
        break;
    }
  };

  const handleIconOnClick = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
  ) => {
    if (pathToIcon === iconClose) {
      e.stopPropagation();
      setInputValue('');
      inputRef.current?.focus();
    }
  };

  useOnClickOutside(buttonRef, () => {
    if (icon) {
      setActive(false);
    }
  });

  return (
    <button
      ref={buttonRef}
      type="button"
      className={classNames(
        `drop-down-button drop-down-button--${size} ${className}`, {
          'drop-down-button--icon': icon,
          'drop-down-button--active': active,
        },
      )}
      onClick={handleOnClick}
      {...rest}
    >
      {
        (active && icon && input)
          ? (
            <input
              ref={inputRef}
              className="drop-down-button__input"
              type="text"
              placeholder={inputValue || placeholder}
              value={inputValue}
              onClick={(e) => e.stopPropagation()}
              onChange={handleInputOnChange}
              onKeyDown={handleInputOnKeyDown}
            />
          ) : (
            <p className="drop-down-button__text">
              {inputValue || placeholder}
            </p>
          )
      }
      {icon && active && children}
      {icon && (
        <img
          className="drop-down-button__icon"
          src={pathToIcon}
          onClick={handleIconOnClick}
          alt="icon"
        />
      )}
    </button>
  );
};
