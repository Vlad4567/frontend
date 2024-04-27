import React from 'react';
import arrow from '../../img/icons/arrow-button.svg';
import { twMerge } from 'tailwind-merge';

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
    <button
      className={twMerge(
        `w-25 h-25 border-lineWidth rounded-25 relative
      cursor-pointer border-solid border-gray-10 bg-none transition-[background,color]
      active:bg-gray-10 active:text-gray-100 [&>*:first-child]:hover:left-[-65%]`,
        className,
      )}
      {...rest}
    >
      <img
        className="pointer-events-none absolute -left-[35%]
        -top-1/2 -translate-y-1/2 transition-[left]"
        src={arrow}
        alt="arrow"
      />
      {children}
    </button>
  );
};
