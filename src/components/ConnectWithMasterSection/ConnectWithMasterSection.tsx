import { Link } from 'react-router-dom';
import { DropDownButton } from '../DropDownButton/DropDownButton';
import { Stars } from '../Stars/Stars';
import instagramIcon from '../../img/icons/icon-instagram.svg';
import facebookIcon from '../../img/icons/icon-facebook.svg';
import telegramIcon from '../../img/icons/icon-telegram.svg';
import phoneIcon from '../../img/icons/icon-phone.svg';
import './ConnectWithMasterSection.scss';
import { fixUrl } from '../../helpers/functions';

interface Props {
  className?: string
  name: string
  contacts: {
    instagram: string | null
    facebook: string | null
    telegram: string | null
    phone: string | null
  }
}

const showContactInfo = (contact: [string, string | null]) => {
  if (contact[1]) {
    switch (contact[0]) {
      case 'instagram':
        return (
          <>
            <img src={instagramIcon} alt="instagram" />
            Instagram
          </>
        );

      case 'facebook':
        return (
          <>
            <img src={facebookIcon} alt="facebook" />
            Facebook
          </>
        );

      case 'telegram':
        return (
          <>
            <img src={telegramIcon} alt="telegram" />
            Telegram
          </>
        );

      case 'phone':
        return (
          <>
            <img src={phoneIcon} alt="phone" />
            Phone
          </>
        );

      default:
        return null;
    }
  }

  return null;
};

export const ConnectWithMasterSection: React.FC<Props> = ({
  className = '',
  name,
  contacts = {
    instagram: null,
    facebook: null,
    telegram: null,
    phone: null,
  },
}) => {
  return (
    <section
      className={`connect-with-master-section ${className}`}
    >
      <h1
        className="connect-with-master-section__title"
      >
        Connect with&#160;
        <span
          className="connect-with-master-section__title-span"
        >
          {name}
          <Stars size="large" type="dark" />
        </span>
      </h1>
      <article
        className="connect-with-master-section__contacts"
      >
        {Object.entries(contacts).map(contact => contact[1] && (
          <Link
            target="_blank"
            className="connect-with-master-section__contacts-item-link"
            to={contact[0] === 'phone'
              ? `tel:+${contact[1].replace(/\D/g, '')}`
              : fixUrl(contact[1])}
          >
            <DropDownButton
              className="connect-with-master-section__contacts-item"
              size="large"
            >
              {showContactInfo(contact)}
            </DropDownButton>
          </Link>
        ))}
      </article>
    </section>
  );
};
