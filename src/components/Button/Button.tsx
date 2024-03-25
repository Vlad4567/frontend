import React from 'react';
import './Button.scss';

/* eslint-disable react/button-has-type */
interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  children: React.ReactNode
  size: 'large' | 'small'
}

export const Button: React.FC<Props> = ({
  className = '',
  children,
  size,
  ...rest
}) => {
  return (
    <button
      type="button"
      className={`button button--${size} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};
