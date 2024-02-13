import { websiteName } from '../../helpers/variables';
import { Stars } from '../Stars/Stars';
import './WhatIsSection.scss';
import starFigure from '../../img/figures/star.svg';
import doubleSubtract from '../../img/figures/double-subtract.svg';
import subtract from '../../img/figures/subtract.svg';

export const WhatIsSection: React.FC = () => {
  return (
    <section className="what-is">
      <h1 className="what-is__title">
        What is&#160;
        <span className="what-is__title-website-name">
          {websiteName}
          <Stars
            className="what-is__title-website-name-stars"
            type="dark"
            size="small"
          />
        </span>
      </h1>

      <div className="what-is__content">
        <article className="what-is__content-round">
          <img
            className="what-is__content-round-star-first"
            src={starFigure}
            alt="Star figure"
          />
          <p className="what-is__content-round-text">
            Quick and
            <br className="what-is__content-round-br" />
            easy search
          </p>
        </article>
        <article className="what-is__content-round">
          <img
            className="what-is__content-round-star-second"
            src={starFigure}
            alt="Star figure"
          />
          <p className="what-is__content-round-text">
            Convenient
            <br className="what-is__content-round-br" />
            appointment for
            <br className="what-is__content-round-br" />
            the procedure
          </p>
        </article>
        <article className="what-is__content-round">
          <img
            className="what-is__content-round-double-subtract"
            src={doubleSubtract}
            alt="Double subtract figure"
          />
          <p className="what-is__content-round-text">
            Emphasizing
            <br className="what-is__content-round-br" />
            the advantages
            <br className="what-is__content-round-br" />
            of each person
            <br className="what-is__content-round-br" />
            in a unique way
          </p>
        </article>
        <article className="what-is__content-round">
          <p className="what-is__content-round-text">
            A large selection
            <br className="what-is__content-round-br" />
            of proven
            <br className="what-is__content-round-br" />
            beauty masters
          </p>
        </article>
        <article className="what-is__content-round">
          <img
            className="what-is__content-round-subtract"
            src={subtract}
            alt="Subtract figure"
          />
          <p className="what-is__content-round-text">
            Realizing and
            <br className="what-is__content-round-br" />
            exceeding your
            <br className="what-is__content-round-br" />
            expectations
          </p>
        </article>
      </div>
    </section>
  );
};
