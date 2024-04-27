import React from 'react';
import leftArrow from '../../img/icons/left-arrow-button.svg';
import rightArrow from '../../img/icons/right-arrow-button.svg';
import { twMerge } from 'tailwind-merge';

/* eslint-disable react/button-has-type */
interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  position: 'left' | 'right';
  className?: string;
}

export const ArrowButton: React.FC<Props> = ({
  position,
  className = '',
  ...rest
}) => {
  const pathToArrow = position === 'left' ? leftArrow : rightArrow;

  return (
    <button
      className={twMerge(
        `hover:border-lineWidth h-[52px] w-[52px] cursor-pointer rounded-[50%]
        bg-none hover:border-solid hover:border-gray-10`,
        className,
      )}
      {...rest}
    >
      <img src={pathToArrow} alt="arrow" />
    </button>
  );
};
