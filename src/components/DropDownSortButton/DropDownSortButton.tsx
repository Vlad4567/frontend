import classNames from 'classnames';
import './DropDownSortButton.scss';

interface Props
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  className?: string
  size?: 'large' | 'small'
  active?: boolean
}

export const DropDownSortButton: React.FC<Props> = ({
  className = '',
  size = 'large',
  active = false,
  ...rest
}) => {
  return (
    <button
      type="button"
      className={classNames(`drop-down-sort-button drop-down-sort-button--${size} ${className}`, {
        'drop-down-sort-button--active': active,
      })}
      {...rest}
    />
  );
};
