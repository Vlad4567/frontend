import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import './SwitchButtons.scss';

interface Props {
  className?: string,
  size: 'large' | 'small',
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    button: string,
  ) => void,
  onChange: (activeButton: string) => void
  buttons: string[],
}

export const SwitchButtons: React.FC<Props> = ({
  buttons,
  className = '',
  size,
  onClick = () => { },
  onChange = () => { },
}) => {
  const [activeButton, setActiveButton] = useState(buttons[0]);

  useEffect(() => {
    onChange(activeButton);
  }, [activeButton, onChange]);

  const handleButtonOnClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    button: string,
  ) => {
    setActiveButton(button);
    onClick(event, button);
  };

  return (
    <div className={classNames('switch-buttons', {
      'switch-buttons--small': size === 'small',
      className,
    })}
    >
      {size === 'large' ? (
        buttons.map(button => (
          <button
            className={classNames('switch-buttons__button', {
              'switch-buttons__button--active': activeButton === button,
            })}
            type="button"
            key={button}
            onClick={(e) => handleButtonOnClick(e, button)}
          >
            {button}
          </button>
        ))
      ) : (
        <>
          <button
            className="switch-buttons__small"
            type="button"
            onClick={(e) => handleButtonOnClick(e, 'decrease')}
          >
            -
          </button>
          <button
            className="switch-buttons__small"
            type="button"
            onClick={(e) => handleButtonOnClick(e, 'increase')}
          >
            +
          </button>
        </>
      )}
    </div>
  );
};
