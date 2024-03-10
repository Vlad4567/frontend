import React from 'react';
import './Checkbox.scss';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

export const Checkbox: React.FC<Props> = ({
  className = '',
  ...rest
}) => {
  return (
    <div className={`checkbox ${className}`}>
      <input
        type="checkbox"
        className="checkbox__checkbox"
        {...rest}
      />
      <span className="checkbox__checkbox-view">
        <svg
          className="checkbox__checkbox-icon"
          width="14"
          viewBox="0 0 511.985 511.985"
        >
          <path
            fill="#000"
            // eslint-disable-next-line max-len
            d="M500.088 83.681c-15.841-15.862-41.564-15.852-57.426 0L184.205 342.148 69.332 227.276c-15.862-15.862-41.574-15.862-57.436 0-15.862 15.862-15.862 41.574 0 57.436l143.585 143.585c7.926 7.926 18.319 11.899 28.713 11.899 10.394 0 20.797-3.963 28.723-11.899l287.171-287.181c15.862-15.851 15.862-41.574 0-57.435z"
          />
        </svg>
      </span>
    </div>
  );
};
