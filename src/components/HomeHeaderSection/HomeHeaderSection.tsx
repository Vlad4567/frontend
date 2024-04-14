import { HomeFilter } from '../HomeFilter/HomeFilter';
import './HomeHeaderSection.scss';

export const HomeHeaderSection = () => {
  return (
    <section className="home-header">
      <p className="home-header__description">
        Whether you are looking for facial, hair or body{' '}
        <span className="home-header__description-care-services">
          care services
        </span>
        . We offer you a wide range of experienced{' '}
        <span className="home-header__description-beauticians">
          beauticians
        </span>{' '}
        and reliable{' '}
        <span className="home-header__description-studios">studios</span> for
        your sparkle in the eyes
      </p>
      <HomeFilter className="home-header__home-filter" />
    </section>
  );
};
