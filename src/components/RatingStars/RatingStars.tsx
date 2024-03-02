/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import './RatingStars.scss';
import fullStarIcon from '../../img/icons/full-star-rating.svg';

interface Props {
  className?: string
  state?: number
  setState?: React.Dispatch<React.SetStateAction<number>>
  stars?: number
}

const getPrepareRare = (value: number, maxValue: number) => {
  return Math.abs(maxValue + 1 - value);
};

export const RatingStars: React.FC<Props> = ({
  className = '',
  state = 0,
  setState = () => { },
  stars = 5,
}) => {
  return (
    <div className={`rating-stars ${className}`}>
      {[...Array(stars)].map((star, index) => {
        const currentRating = index + 1;

        return (
          <div
            key={star}
            className="rating-stars__star"
            onClick={() => setState(
              getPrepareRare(currentRating, stars),
            )}
            style={currentRating >= getPrepareRare(state, stars)
              ? { backgroundImage: `url(${fullStarIcon})` }
              : undefined}
          />
        );
      })}
    </div>
  );
};
