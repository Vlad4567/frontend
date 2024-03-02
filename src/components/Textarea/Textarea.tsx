import classNames from 'classnames';
import './Textarea.scss';

interface Props {
  className?: string
  placeholder?: string
  title?: string
  rows?: number
  value: string
  onChange: React.Dispatch<React.SetStateAction<string>>
}

export const Textarea: React.FC<Props> = ({
  className = '',
  title = '',
  placeholder = '',
  rows = 1,
  value = '',
  onChange = () => { },
}) => {
  return (
    <div className="textarea">
      <small className={classNames('textarea__title', {
        'textarea__title--show': value,
      })}
      >
        {title}
      </small>
      <textarea
        minLength={10}
        maxLength={1000}
        className="textarea__text"
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
};
