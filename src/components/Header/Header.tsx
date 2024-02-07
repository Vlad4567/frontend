import { Link } from 'react-router-dom';
import './Header.scss';
import { websiteName } from '../../helpers/variables';
import { Stars } from '../Stars/Stars';
import { RectangleButton } from '../RectangleButton/RectangleButton';
import accountIcon from '../../img/icons/account-icon.svg';

export const Header: React.FC = () => {
  return (
    <header className="header">
      <nav className="header__nav">
        <ul className="header__nav-list">
          <div className="header__nav-left-side">
            <li className="header__nav-item">
              <Link className="header__nav-item-link" to="/">
                <h3 className="header__website-title">
                  {websiteName}
                  <Stars type="black" size="small" />
                </h3>
              </Link>
            </li>
          </div>

          <div className="header__nav-right-side">
            <li className="header__nav-item">
              <Link className="header__nav-item-link" to="login">
                <RectangleButton className="header__login" type="dark">
                  Sign up
                </RectangleButton>

                <button type="button" className="header__account-icon">
                  <img src={accountIcon} alt="Account icon" />
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
