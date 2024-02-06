import classNames from 'classnames';
import './RectangleButton.scss';

interface Props {
  children: React.ReactNode;
  className?: string;
  type: 'light' | 'dark';
  active?: boolean;
}

export const RectangleButton: React.FC<Props> = ({
  children,
  className = '',
  type,
  active = false,
}) => {
  return (
    <button
      type="button"
      className={classNames(
        `rectangle-button rectangle-button--${type} ${className}`,
        {
          [`rectangle-button--${type}-active`]: active,
        },
      )}
    >
      <div className="rectangle-button__first-rectangle" />
      <div className="rectangle-button__second-rectangle" />
      {children}
    </button>
  );
};
