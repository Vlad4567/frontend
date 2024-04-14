import React from 'react';
import { createPortal } from 'react-dom';
import { useMediaQuery } from 'usehooks-ts';
import variables from '../../styles/variables.module.scss';
import './CreateModal.scss';

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
    `(min-width: ${variables['tablet-min-width']})`,
  );
  const onDesktop = useMediaQuery(
    `(min-width: ${variables['desktop-min-width']})`,
  );
  const onPhone = !(onTablet || onDesktop);

  const checkMedia =
    (media.onPhone && onPhone) ||
    (media.onTablet && onTablet) ||
    (media.onDesktop && onDesktop);

  return checkMedia ? (
    createPortal(
      <div className={`modal ${className}`}>{children}</div>,
      document.body,
    )
  ) : (
    <>{children}</>
  );
};
