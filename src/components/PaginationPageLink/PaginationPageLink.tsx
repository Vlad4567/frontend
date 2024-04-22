import cn from 'classnames';
import './PaginationPageLink.scss';

export type Props = React.HTMLProps<HTMLAnchorElement> & { active?: boolean };

export const PaginationPageLink: React.FC<Props> = ({
  className,
  active,
  disabled,
  children,
  ...otherProps
}) => {
  const customClassName = cn('pagination-page-link', className, {
    active,
    disabled,
  });

  if (disabled) {
    return <span className={customClassName}>{children}</span>;
  }

  return (
    <a
      className={customClassName}
      aria-current={active ? 'page' : undefined}
      {...otherProps}
    >
      {children}
    </a>
  );
};
