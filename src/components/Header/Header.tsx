/* eslint-disable jsx-a11y/control-has-associated-label */
import { Link } from 'react-router-dom';
import { websiteName } from '../../helpers/variables';
import { Stars } from '../Stars/Stars';
import { RectangleButton } from '../RectangleButton/RectangleButton';
import { AccountIcon } from '../AccountIcon/AccountIcon';
import { DropDownButton } from '../DropDownButton/DropDownButton';
import './Header.scss';

interface Props {
  type: 'light' | 'dark';
  className?: string;
}

export const Header: React.FC<Props> = ({ type, className = '' }) => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');

  return (
    <header className={`header header--${type} ${className}`}>
      <nav className="header__nav">
        <ul className="header__nav-list">
          <div className="header__nav-left-side">
            <li className="header__nav-item">
              <Link className="header__nav-item-link" to="/">
                <h3 className="header__website-title">
                  {websiteName}
                  <Stars type={type} size="small" />
                </h3>
              </Link>
            </li>
          </div>

          <div className="header__nav-right-side">
            <li className="header__nav-item">
              <Link
                className="header__nav-item-link"
                to={token ? '/account' : '/login'}
              >
                {token || refreshToken ? (
                  <DropDownButton
                    className="header__account"
                    size="small"
                    placeholder="Account"
                  />
                ) : (
                  <RectangleButton className="header__login" type={type}>
                    Sign up
                  </RectangleButton>
                )}
                <button type="button" className="header__account-icon">
                  <AccountIcon type={type} />
                </button>
              </Link>
            </li>
          </div>
        </ul>
      </nav>

      <hr className="header__hr" />
    </header>
  );
};
