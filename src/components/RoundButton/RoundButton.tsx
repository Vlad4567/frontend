import './RoundButton.scss';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export const RoundButton: React.FC<Props> = ({
  children,
  className = '',
  ...rest
}) => {
  return (
    <button
      type="button"
      className={`round-button ${className}`}
      {...rest}
    >
      <div className="round-button__border" />
      {children}
    </button>
  );
};
