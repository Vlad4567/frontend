import { useNavigate } from 'react-router-dom';
import SwiperCore from 'swiper';
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ButtonWithArrow } from '../ButtonWithArrow/ButtonWithArrow';
import 'swiper/scss';
import './FeelBeautySection.scss';
import { ArrowButton } from '../ArrowButton/ArrowButton';
import { getMasterCard } from '../../api/master';
import { MasterCard } from '../MasterCard/MasterCard';
import * as types from '../../types/master';

interface Props {
  className?: string
}

export const FeelBeautySection: React.FC<Props> = ({ className = '' }) => {
  const navigate = useNavigate();
  const [swiperRef, setSwiperRef] = useState<SwiperCore | null>(null);
  const [masterCards, setMasterCards] = useState<types.MasterCard[]>([]);

  const handleNext = () => {
    if (swiperRef) {
      swiperRef.slideNext();
    }
  };

  const handlePrev = () => {
    if (swiperRef) {
      swiperRef.slidePrev();
    }
  };

  useEffect(() => {
    getMasterCard(0, 20)
      .then((response) => setMasterCards(response.content));
  }, []);

  return (
    <section className={`feel-beauty ${className}`}>
      <div className="feel-beauty__header">
        <h1 className="feel-beauty__title">
          Feel your inner&#160;
          <span className="feel-beauty__title-span">
            beauty
          </span>
          <br className="feel-beauty__title-br" />
          with our best beauticians !
        </h1>

        <ButtonWithArrow onClick={() => navigate('search')}>
          View all
        </ButtonWithArrow>
      </div>

      <figure className="feel-beauty__swiper">
        <Swiper
          onSwiper={setSwiperRef}
          className="feel-beauty__swiper-slides"
          spaceBetween="30px"
          slidesPerView="auto"
        >
          {masterCards.map((card) => (
            <SwiperSlide
              key={card.id}
              className="feel-beauty__swiper-slide"
              style={{ width: 'auto' }}
            >
              <MasterCard master={card} />
            </SwiperSlide>
          ))}
        </Swiper>

        <figcaption className="feel-beauty__swiper-control">
          <ArrowButton position="left" onClick={handlePrev} />
          <ArrowButton position="right" onClick={handleNext} />
        </figcaption>
      </figure>
    </section>
  );
};
