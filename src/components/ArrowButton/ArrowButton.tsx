import React from 'react';
import './ArrowButton.scss';
import leftArrow from '../../img/icons/left-arrow-button.svg';
import rightArrow from '../../img/icons/right-arrow-button.svg';

/* eslint-disable react/button-has-type */
interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  position: 'left' | 'right'
}

export const ArrowButton: React.FC<Props> = ({
  position,
  ...rest
}) => {
  const pathToArrow = position === 'left' ? leftArrow : rightArrow;

  return (
    <button
      className={
        `arrow-button ${rest.className}`
      }
      {...rest}
    >
      <img
        className="arrow-button__arrow"
        src={pathToArrow}
        alt="arrow"
      />
    </button>
  );
};
