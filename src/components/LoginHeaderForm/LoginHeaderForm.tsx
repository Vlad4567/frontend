/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import './LoginHeaderForm.scss';

interface Props {
  className?: string;
  title?: string;
  description?: string;
  textLink?: string;
  onClick?: (value: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => void;
}

export const LoginHeaderForm: React.FC<Props> = ({
  className = '',
  title = '',
  description = '',
  textLink = '',
  onClick = () => {},
}) => {
  return (
    <div className={`login-header-form ${className}`}>
      {title && <h3 className="login-header-form__title">{title}</h3>}

      {description && textLink && (
        <p className="login-header-form__description">
          {description && <>{description} </>}

          {textLink && (
            <p
              className="login-header-form__description-link"
              onClick={onClick}
            >
              {textLink}
            </p>
          )}
        </p>
      )}
    </div>
  );
};
