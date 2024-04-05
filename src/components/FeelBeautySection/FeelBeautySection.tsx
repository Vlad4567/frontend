import { useNavigate } from 'react-router-dom';
import SwiperCore from 'swiper';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ButtonWithArrow } from '../ButtonWithArrow/ButtonWithArrow';
import 'swiper/scss';
import { ArrowButton } from '../ArrowButton/ArrowButton';
import { getRatingMasterCard } from '../../api/master';
import { MasterCard } from '../MasterCard/MasterCard';
import * as types from '../../types/master';
import * as notificationSlice from '../../features/notificationSlice';
import './FeelBeautySection.scss';
import { useAppDispatch } from '../../app/hooks';

interface Props {
  className?: string
}

export const FeelBeautySection: React.FC<Props> = ({ className = '' }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [swiperRef, setSwiperRef] = useState<SwiperCore | null>(null);
  const [masterCards, setMasterCards] = useState<types.MasterCard[]>([]);
  const [masterCardsPage, setMasterCardsPage] = useState(0);

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

  const loadMasterCards = () => {
    getRatingMasterCard(masterCardsPage, 20)
      .then((response) => setMasterCards(c => (c.length
        ? [...c, ...response.content]
        : response.content)))
      .catch(() => dispatch(notificationSlice.addNotification({
        id: +new Date(),
        type: 'error',
      })));
    setMasterCardsPage(c => c + 1);
  };

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
          onReachEnd={loadMasterCards}
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
