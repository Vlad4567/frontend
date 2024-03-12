import './UnderlinedSmall.scss';

interface Props extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  tag?: keyof JSX.IntrinsicElements | keyof SVGElementTagNameMap;
}

export const UnderlinedSmall: React.FC<Props> = ({
  className,
  children,
  tag = 'small',
  ...rest
}) => {
  const Component = tag as React.ElementType;

  return (
    <Component className={`underlined-small ${className}`} {...rest}>
      {children}
    </Component>
  );
};
