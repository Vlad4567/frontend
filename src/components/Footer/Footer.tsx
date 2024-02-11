import { Link } from 'react-router-dom';
import './Footer.scss';
import { RectangleButton } from '../RectangleButton/RectangleButton';
import { websiteName } from '../../helpers/variables';
import { ScrollUpButton } from '../ScrollUpButton/ScrollUpButton';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer__block">
        <div className="footer__contact-us">
          <p className="footer__contact-us-paragraph">
            Feel free to reach our if you want to collaborate with us or
            simply have a chat
          </p>
          <Link
            className="footer__contact-us-button-link"
            to="contacts"
          >
            <RectangleButton
              className="footer__contact-us-button"
              type="dark"
            >
              Contact us
            </RectangleButton>
          </Link>
        </div>

        <article className="footer__contacts">
          <div className="footer__contacts-block">
            <h3 className="footer__contacts-block-title">Follow us</h3>
            <ul className="footer__contacts-block-list">
              <li className="footer__contacts-block-list-item">
                <Link
                  className="footer__contacts-link"
                  to="https://www.instagram.com/"
                  target="_blank"
                >
                  Instagram
                </Link>
              </li>
              <li className="footer__contacts-block-list-item">
                <Link
                  className="footer__contacts-link"
                  to="https://www.facebook.com/"
                  target="_blank"
                >
                  Facebook
                </Link>
              </li>
              <li className="footer__contacts-block-list-item">
                <Link
                  className="footer__contacts-link"
                  to="https://web.telegram.org/"
                  target="_blank"
                >
                  Telegram
                </Link>
              </li>
            </ul>
          </div>
          <div className="footer__contacts-block">
            <h3 className="footer__contacts-block-title">Contact</h3>
            <ul className="footer__contacts-block-list">
              <li className="footer__contacts-block-list-item">
                <Link
                  className="footer__contacts-link"
                  to="mailto:sparkle@gmail.com"
                >
                  sparkle@gmail.com
                </Link>
              </li>
              <li className="footer__contacts-block-list-item">
                <Link className="footer__contacts-link" to="tel:+380664535044">
                  +380 66 453 50 44
                </Link>
              </li>
            </ul>
          </div>
          <div className="footer__contacts-block">
            <h3 className="footer__contacts-block-title">Central office</h3>
            <ul className="footer__contacts-block-list">
              <li className="footer__contacts-block-list-item">
                <Link
                  to="https://maps.app.goo.gl/nD4ceJ7MeoQLURzJ7"
                  target="_blank"
                  className="footer__contacts-link"
                >
                  Ivana Franka St, 3
                  <br />
                  Ukraine, Kyiv
                </Link>
              </li>
            </ul>
          </div>
        </article>

        <ScrollUpButton
          className="footer__scroll-up-button-large"
          size="large"
        />
      </div>

      <div className="footer__info">
        <div className="footer__info-left-block">
          <small className="footer__info-text">
            A web service where you can find your beauty
            master and sign up for the desired procedure
          </small>

          <Link className="footer__info-text" to="privacy">
            <small className="footer__info-privacy">
              Privacy and Cookie Policy
            </small>
          </Link>

          <small className="footer__info-text">
            {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
            © 2024 <span className="footer__info-text-span">{websiteName}</span>
          </small>
        </div>

        <ScrollUpButton className="footer__scroll-up-button" size="small" />
      </div>
    </footer>
  );
};
