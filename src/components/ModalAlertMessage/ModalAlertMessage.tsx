/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { forwardRef } from 'react';
import './ModalAlertMessage.scss';
import closeIcon from '../../img/icons/icon-dropdown-close.svg';
import { DropDownButton } from '../DropDownButton/DropDownButton';
import { Button } from '../Button/Button';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  title?: string
  dangerPlaceholder?: string
  simplePlaceholder?: string
  onClose?: () => void
  onClickDanger?: () => void
  onClickSimple?: () => void
}

export const ModalAlertMessage = forwardRef<HTMLDivElement, Props>(({
  className = '',
  title = '',
  dangerPlaceholder = '',
  simplePlaceholder = '',
  onClose = () => { },
  onClickDanger = () => { },
  onClickSimple = () => { },
  ...rest
}, ref) => {
  return (
    <div className={`alert-message ${className}`} ref={ref} {...rest}>
      <div className="alert-message__header">
        <p className="alert-message__description">{title}</p>
        <img
          src={closeIcon}
          alt="Close Icon"
          className="alert-message__close-icon"
          onClick={() => onClose()}
        />
      </div>

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
});
