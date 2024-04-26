import { Stars } from '../Stars/Stars';
import firstImg from '../../img/space-to-enjoy/one.png';
import secondImg from '../../img/space-to-enjoy/two.png';
import thirdImg from '../../img/space-to-enjoy/three.png';
import { websiteName } from '../../helpers/variables';
import './SpaceToEnjoySection.scss';

export const SpaceToEnjoySection: React.FC = () => {
  return (
    <section className="space-to-enjoy">
      <h1 className="space-to-enjoy__title">
        Space to Enjoy ,
        <br className="space-to-enjoy__title-br" />
        Services to&#160;
        <span className="space-to-enjoy__title-website-name">
          {websiteName}
          <Stars
            className="space-to-enjoy__title-website-name-stars"
            type="dark"
            size="small"
          />
        </span>
      </h1>

      <div className="space-to-enjoy__images">
        <img className="space-to-enjoy__images-one" src={firstImg} alt="" />
        <img className="space-to-enjoy__images-two" src={secondImg} alt="" />
        <img className="space-to-enjoy__images-three" src={thirdImg} alt="" />
      </div>
    </section>
  );
};
