import React from 'react';
import './ButtonWithArrow.scss';
import arrow from '../../img/icons/arrow-button.svg';

/* eslint-disable react/button-has-type */
interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const ButtonWithArrow: React.FC<Props> = ({
  children,
  className = '',
  ...rest
}) => {
  return (
    <button className={`button-with-arrow ${className}`} {...rest}>
      <img className="button-with-arrow__arrow" src={arrow} alt="arrow" />
      {children}
    </button>
  );
};
