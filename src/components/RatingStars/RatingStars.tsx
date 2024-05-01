/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import classNames from 'classnames';
import fullStarIcon from '../../img/icons/full-star-rating.svg';
import './RatingStars.scss';

type TypeStars = 'ready' | 'select';

interface Props {
  className?: string;
  type?: TypeStars;
  state?: number;
  setState?: React.Dispatch<React.SetStateAction<number>>;
  stars?: number;
}

const getPrepareRare = (value: number, maxValue: number) => {
  return Math.abs(maxValue + 1 - value);
};

export const RatingStars: React.FC<Props> = ({
  className = '',
  type = 'ready',
  state = 0,
  setState = () => {},
  stars = 5,
}) => {
  return (
    <div className={`rating-stars ${className}`}>
      {[...Array(stars)].map((_, index) => {
        const currentRating = index + 1;

        return (
          <div
            key={currentRating}
            className={classNames('rating-stars__star', {
              'rating-stars__star--selected': type === 'select',
              'rating-stars__star--ready': type === 'ready',
            })}
            onClick={() => setState(getPrepareRare(currentRating, stars))}
            style={
              currentRating >= getPrepareRare(state, stars)
                ? { backgroundImage: `url(${fullStarIcon})` }
                : undefined
            }
          />
        );
      })}
    </div>
  );
};
