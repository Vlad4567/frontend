import React from 'react';
import { createPortal } from 'react-dom';
import { useMediaQuery } from 'usehooks-ts';
import { tailwindConfig } from '../helpers/variables';
import { twMerge } from 'tailwind-merge';

interface Props {
  children: React.ReactNode;
  className?: string;
  media?: {
    onPhone?: boolean;
    onTablet?: boolean;
    onDesktop?: boolean;
  };
}

export const CreateModal: React.FC<Props> = ({
  children,
  className = '',
  media = {
    onPhone: true,
    onTablet: true,
    onDesktop: true,
  },
}) => {
  const onTablet = useMediaQuery(
    `(min-width: ${tailwindConfig.theme.screens.lg})`,
  );
  const onDesktop = useMediaQuery(
    `(min-width: ${tailwindConfig.theme.screens.xl})`,
  );
  const onPhone = !(onTablet || onDesktop);

  const checkMedia =
    (media.onPhone && onPhone) ||
    (media.onTablet && onTablet) ||
    (media.onDesktop && onDesktop);

  return checkMedia ? (
    createPortal(
      <div
        className={twMerge(
          `fixed inset-0 z-[9999] translate-x-[max(-50%,-50vw)] translate-y-[max(-50%,-50vh)]
          overflow-auto shadow-[-1px,4px,15px,0,rgba(0,0,0,0.25)] backdrop-blur-md [&>*]:absolute [&>*]:left-1/2 [&>*]:top-1/2
          [&>*]:h-fit`,
          className,
        )}
      >
        {children}
      </div>,
      document.body,
    )
  ) : (
    <>{children}</>
  );
};
