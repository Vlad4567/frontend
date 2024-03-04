/* eslint-disable jsx-a11y/label-has-associated-control */
import './RadioInput.scss';

interface Props
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  className?: string;
}

export const RadioInput: React.FC<Props> = ({
  className = '',
  ...rest
}) => {
  return (
    <input
      className={`radio-input ${className}`}
      type="radio"
      {...rest}
    />
  );
};
