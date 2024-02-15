import React from 'react';
import './Button.scss';

/* eslint-disable react/button-has-type */
interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  size: 'large' | 'small'
}

export const Button: React.FC<Props> = ({
  children,
  size,
  ...rest
}) => {
  return (
    <button
      className={`button button--${size} ${rest.className}`}
      {...rest}
    >
      {children}
    </button>
  );
};
