/* eslint-disable no-param-reassign */
import classNames from 'classnames';
import './Textarea.scss';

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
  placeholder?: string
  autoGrow?: boolean
}

export const Textarea: React.FC<Props> = ({
  className = '',
  placeholder = '',
  autoGrow = false,
  ...rest
}) => {
  return (
    <div className={`textarea ${className}`}>
      <small className={classNames('textarea__title', {
        'textarea__title--show': rest.value,
      })}
      >
        {placeholder}
      </small>
      <textarea
        className="textarea__text"
        placeholder={placeholder}
        onInput={autoGrow ? (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          e.target.style.height = 'auto';
          e.target.style.height = `${e.target.scrollHeight}px`;
        } : undefined}
        {...rest}
      />
    </div>
  );
};
