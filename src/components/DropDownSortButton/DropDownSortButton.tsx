import classNames from 'classnames';
import { forwardRef } from 'react';
import './DropDownSortButton.scss';

interface Props
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  className?: string;
  size?: 'large' | 'small';
  active?: boolean;
}

export const DropDownSortButton = forwardRef<HTMLButtonElement, Props>(
  ({ className = '', size = 'large', active = false, ...rest }, ref) => {
    return (
      <button
        type="button"
        className={classNames(
          `drop-down-sort-button drop-down-sort-button--${size} ${className}`,
          {
            'drop-down-sort-button--active': active,
          },
        )}
        ref={ref}
        {...rest}
      />
    );
  },
);
DropDownSortButton.displayName = 'DropDownSortButton';
