import { Link } from 'react-router-dom';
import { DropDownButton } from './DropDownButton/DropDownButton';
import { Stars } from './Stars/Stars';
import instagramIcon from '../../img/icons/icon-instagram.svg';
import facebookIcon from '../../img/icons/icon-facebook.svg';
import telegramIcon from '../../img/icons/icon-telegram.svg';
import phoneIcon from '../../img/icons/icon-phone.svg';
import { fixUrl } from '../helpers/functions';
import { twMerge } from 'tailwind-merge';

interface Props {
  className?: string;
  name: string;
  contacts: {
    instagram: string | null;
    facebook: string | null;
    telegram: string | null;
    phone: string | null;
  };
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
  const renderContactLink = ([type, value]: string[]) => {
    if (type === 'phone') {
      return `tel:+${value.replace(/\D/g, '')}`;
    }

    if (type === 'telegram' && value.startsWith('@')) {
      return `https://t.me/${value.slice(1)}`;
    }

    return fixUrl(value);
  };

  return (
    <section
      className={twMerge(
        `lg:gap-7.5 flex flex-col items-center justify-center gap-10 xl:gap-10`,
        className,
      )}
    >
      <h1
        className="flex w-fit flex-wrap items-center
      justify-center text-center"
      >
        Connect with&#160;
        <span className="text-primary-100 relative">
          {name}
          <Stars size="large" type="dark" />
        </span>
      </h1>
      <article className="flex w-full flex-wrap justify-center gap-2.5">
        {Object.entries(contacts).map(
          contact =>
            contact[1] && (
              <Link
                key={contact[0]}
                target="_blank"
                className="text-gray-100 no-underline"
                to={renderContactLink([contact[0], contact[1]])}
              >
                <DropDownButton className="w-fit" size="large">
                  {showContactInfo(contact)}
                </DropDownButton>
              </Link>
            ),
        )}
      </article>
    </section>
  );
};
