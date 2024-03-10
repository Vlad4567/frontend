import './UnderlinedSmall.scss';

interface Props extends React.HTMLAttributes<HTMLElement> {
  className?: string
}

export const UnderlinedSmall: React.FC<Props> = ({
  className,
  children,
  ...rest
}) => {
  return (
    <small className={`underlined-small ${className}`} {...rest}>
      {children}
    </small>
  );
};
