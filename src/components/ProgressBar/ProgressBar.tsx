import React from 'react';
import './ProgressBar.scss';

interface Props {
  completed: number;
  className?: string;
}

const MAX_RATING = 100;

export const ProgressBar: React.FC<Props> = ({ completed, className }) => {
  return (
    <div className="progress-bar-container">
      <div
        className="progress-bar-container__filler-styles"
        style={{
          width: `${completed <= MAX_RATING ? completed : MAX_RATING}%`,
        }}
      >
        <span className={`progress-bar-container__label-styles ${className}`} />
      </div>
    </div>
  );
};
