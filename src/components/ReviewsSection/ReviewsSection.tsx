import React, { useState } from 'react';
import SwiperCore from 'swiper';
import { SwiperSlide, Swiper } from 'swiper/react';
import { Button } from '../Button/Button';
import 'swiper/scss';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import { ArrowButton } from '../ArrowButton/ArrowButton';
import { ReviewsCard } from '../ReviewsCard/ReviewsCard';
import './ReviewsSection.scss';
import { RatingStars } from '../RatingStars/RatingStars';

interface Props {
  className?: string
}

// const initTest = [{ id: 1, title: 'asadf' }, { id: 2, title: 'asadf' }, { id: 3, title: 'asadf' }, { id: 4, title: 'asadf' }, { id: 5, title: 'asadf' }];

export const ReviewsSection: React.FC<Props> = () => {
  const [reviewsCards, setReviewsCards] = useState([]);
  const [swiperRef, setSwiperRef] = useState<SwiperCore | null>(null);

  // useEffect(() => {
  //   getComments(221, 0, 5)
  //     .then(setReviewsCards);
  // }, []);

  // console.log(console.dir(reviewsCards));

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
    <section className="reviews-section">
      <h2 className="reviews-section__title">Reviews</h2>

      <div className="reviews-section__body">
        <article className="reviews-section__info">
          <div className="reviews-section__info-header">
            <div className="reviews-section__info-header-wraper">
              <h3 className="reviews-section__info-header-rating">4.4</h3>

              <div className="reviews-section__info-header-blok">

                <p className="reviews-section__info-header-blok-text">
                  11 ratings
                </p>

                <RatingStars state={5} />
              </div>
            </div>

            <Button size="large" className="reviews-section__button-first">
              Write review
            </Button>
          </div>

          <ul className="reviews-page__info-header-list">
            <li className="reviews-page__info-header-item">
              <p className="reviews-page__info-header-rate">5</p>

              <ProgressBar completed={100} />

            </li>
            <li className="reviews-page__info-header-item">
              <p className="reviews-page__info-header-rate">4</p>

              <ProgressBar completed={80} />
            </li>
            <li className="reviews-page__info-header-item">
              <p className="reviews-page__info-header-rate">3</p>

              <ProgressBar completed={50} />
            </li>
            <li className="reviews-page__info-header-item">
              <p className="reviews-page__info-header-rate">2</p>

              <ProgressBar completed={0} />
            </li>
            <li className="reviews-page__info-header-item">
              <p className="reviews-page__info-header-rate">1</p>

              <ProgressBar completed={10} />
            </li>
          </ul>
          <Button size="large" className="reviews-section__button-second">
            Write review
          </Button>
        </article>

        <figure className="reviews-section__swiper">
          <Swiper
            onSwiper={setSwiperRef}
            className="reviews-section__swiper-slides"
            spaceBetween="20px"
            slidesPerView="auto"
          >
            {reviewsCards.map((card) => (
              <SwiperSlide
                // key={card.id}
                className="reviews-section__swiper-slide"
                style={{ width: 'auto' }}
              >
                <ReviewsCard card={card} />
              </SwiperSlide>
            ))}
          </Swiper>

          <figcaption className="reviews-section__swiper-control">
            <ArrowButton position="left" onClick={handlePrev} />
            <ArrowButton position="right" onClick={handleNext} />
          </figcaption>
        </figure>
      </div>
    </section>
  );
};
