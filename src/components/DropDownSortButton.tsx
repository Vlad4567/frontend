import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

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
        className={twMerge(
          `border-lineWidth flex cursor-pointer items-center justify-center
          rounded-[50%] border-solid border-gray-10 bg-[#ffffff00]
          bg-[url(../img/icons/icon-sort-dark.svg)] bg-center bg-no-repeat
          transition-all hover:border-[#ffffff00] hover:bg-pink`,
          size === 'large' && 'h-[50px] w-[50px]',
          size === 'small' && 'h-[40px] w-[40px]',
          active && 'bg-gray-10 bg-[url(../img/icons/icon-sort-white.svg)]',
          className,
        )}
        ref={ref}
        {...rest}
      />
    );
  },
);
DropDownSortButton.displayName = 'DropDownSortButton';
