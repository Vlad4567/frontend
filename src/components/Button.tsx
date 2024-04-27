import React from 'react';
import { twMerge } from 'tailwind-merge';

/* eslint-disable react/button-has-type */
interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
  size: 'large' | 'small';
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
      className={twMerge(
        `w-32.5 rounded-25 cursor-pointer border-0 enabled:active:scale-[0.95]
        enabled:active:shadow-[inset,1px,1px,10px,0,rgba(0,0,0,0.25)] disabled:cursor-default disabled:bg-gray-50`,
        size === 'large' &&
          `h-12.5 hover:bg-primary-100 bg-gray-10 text-gray-100`,
        size === 'small' &&
          `bg-primary-100 h-10 text-gray-100 hover:bg-gray-10 enabled:active:bg-gray-15`,
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
};
