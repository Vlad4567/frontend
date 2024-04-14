/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { forwardRef } from 'react';
import './ModalAlertMessage.scss';
import closeIcon from '../../img/icons/icon-dropdown-close.svg';
import { DropDownButton } from '../DropDownButton/DropDownButton';
import { Button } from '../Button/Button';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  title?: string;
  description?: string;
  dangerPlaceholder?: string;
  simplePlaceholder?: string;
  onClose?: () => void;
  onClickDanger?: () => void;
  onClickSimple?: () => void;
  children?: React.ReactNode;
}

export const ModalAlertMessage = forwardRef<HTMLDivElement, Props>(
  (
    {
      className = '',
      title = '',
      description = '',
      dangerPlaceholder = '',
      simplePlaceholder = '',
      onClose = () => {},
      onClickDanger = () => {},
      onClickSimple = () => {},
      children = null,
      ...rest
    },
    ref,
  ) => {
    return (
      <div className={`alert-message ${className}`} ref={ref} {...rest}>
        <div className="alert-message__header">
          <h3 className="alert-message__title">{title}</h3>
          <img
            src={closeIcon}
            alt="Close Icon"
            className="alert-message__close-icon"
            onClick={() => onClose()}
          />
        </div>

        {description && (
          <p className="alert-message__description">{description}</p>
        )}

        {children}

        {(simplePlaceholder || dangerPlaceholder) && (
          <div className="alert-message__dropdown-buttons">
            {simplePlaceholder && (
              <DropDownButton
                size="small"
                placeholder={simplePlaceholder}
                className="alert-message__dropdown-button"
                onClick={onClickSimple}
              />
            )}

            {dangerPlaceholder && (
              <Button
                size="small"
                className="alert-message__dropdown-button"
                onClick={onClickDanger}
              >
                {dangerPlaceholder}
              </Button>
            )}
          </div>
        )}
      </div>
    );
  },
);
ModalAlertMessage.displayName = 'ModalAlertMessage';
