import React from 'react';
import './ProgressBar.scss';

interface Props {
  completed: number
  className?: string,
}

export const ProgressBar: React.FC<Props> = ({
  completed,
  className,
}) => {
  return (
    <div className="progress-bar-container">
      <div
        className="progress-bar-container__filler-styles"
        style={{ width: `${completed}%` }}
      >
        <span
          className={
            `progress-bar-container__label-styles ${className}`
          }
        >
          {/* {`${completed}%`} */}
        </span>
      </div>
    </div>
  );
};
