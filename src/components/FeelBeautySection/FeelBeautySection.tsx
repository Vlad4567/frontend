import { useNavigate } from 'react-router-dom';
import SwiperCore from 'swiper';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ButtonWithArrow } from '../ButtonWithArrow/ButtonWithArrow';
import 'swiper/scss';
import { ArrowButton } from '../ArrowButton/ArrowButton';
import { MasterCard } from '../MasterCard/MasterCard';
import { useRatingMasterCard } from '../../hooks/useRatingMasterCard';
import './FeelBeautySection.scss';

interface Props {
  className?: string;
}

export const FeelBeautySection: React.FC<Props> = ({ className = '' }) => {
  const navigate = useNavigate();
  const { ratingMasterCards } = useRatingMasterCard();
  const [swiperRef, setSwiperRef] = useState<SwiperCore | null>(null);

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

  return (
    ratingMasterCards.data && (
      <section className={`feel-beauty ${className}`}>
        <div className="feel-beauty__header">
          <h1 className="feel-beauty__title">
            Feel your inner&#160;
            <span className="feel-beauty__title-span">beauty</span>
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
            onReachEnd={() => ratingMasterCards.fetchNextPage()}
          >
            {ratingMasterCards.data?.pages.flatMap(page =>
              page.content.map(card => {
                return (
                  <SwiperSlide
                    key={card.id}
                    className="feel-beauty__swiper-slide"
                    style={{ width: 'auto' }}
                  >
                    <MasterCard master={card} />
                  </SwiperSlide>
                );
              }),
            )}
          </Swiper>

          <figcaption className="feel-beauty__swiper-control">
            <ArrowButton position="left" onClick={handlePrev} />
            <ArrowButton position="right" onClick={handleNext} />
          </figcaption>
        </figure>
      </section>
    )
  );
};
