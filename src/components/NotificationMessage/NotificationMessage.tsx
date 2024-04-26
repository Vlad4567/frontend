/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import iconClose from '../../img/icons/icon-dropdown-close.svg';
import './NotificationMessage.scss';

interface Props {
  className?: string;
  icon?: string;
  title?: string;
  description?: string;
  onClose?: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => void;
}

export const NotificationMessage: React.FC<Props> = ({
  className = '',
  icon,
  title = '',
  description = '',
  onClose = () => {},
}) => {
  return (
    <article className={`notification-message ${className}`}>
      {icon && <img src={icon} alt="stars" />}
      <div className="notification-message__wrapper">
        {title && <p className="notification-message__title">{title}</p>}
        {description && (
          <small className="notification-message__description">
            {description}
          </small>
        )}
      </div>
      <img
        src={iconClose}
        alt="close"
        className="notification-message__close"
        onClick={onClose}
      />
    </article>
  );
};
