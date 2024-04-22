import React from 'react';
import classNames from 'classnames';
import './SwitchButtons.scss';
import { SubCategory } from '../../types/category';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  onClickButton: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    button: SubCategory,
  ) => void;
  buttons: SubCategory[];
  activeButton: SubCategory;
}

export const SwitchButtons: React.FC<Props> = ({
  className = '',
  buttons,
  activeButton,
  onClickButton = () => {},
  ...rest
}) => {
  return (
    <div className={`switch-buttons ${className}`} {...rest}>
      {buttons.map(button => (
        <button
          className={classNames('switch-buttons__button', {
            'switch-buttons__button--active': activeButton.id === button.id,
          })}
          type="button"
          key={button.id}
          onClick={e => onClickButton(e, button)}
        >
          {button.name}
        </button>
      ))}
    </div>
  );
};
