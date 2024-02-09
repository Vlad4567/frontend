import './ScrollUpButton.scss';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size: 'large' | 'small'
}

const scrollUp = () => {
  window.scrollTo({ top: 0 });
};

export const ScrollUpButton: React.FC<Props> = ({
  size,
  className,
  ...rest
}) => {
  return (
    <button
      type="button"
      onClick={scrollUp}
      className={`scroll-up-button scroll-up-button--${size} ${className}`}
      {...rest}
    />
  );
};
