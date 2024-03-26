import React, { useEffect, useState } from 'react';
import { SwiperSlide, Swiper } from 'swiper/react';
import SwiperCore from 'swiper';
import { useParams } from 'react-router-dom';
import 'swiper/scss';
import * as publicMasterSlice from '../../features/publicMasterSlice';
import { Button } from '../Button/Button';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import { ArrowButton } from '../ArrowButton/ArrowButton';
import { ReviewsCard } from '../ReviewsCard/ReviewsCard';
import { RatingStars } from '../RatingStars/RatingStars';
import { getMaster, getReviewsMaster } from '../../api/master';
import './ReviewsSection.scss';
import { getRatings } from '../../helpers/functions';
import { ContentReviews } from '../../types/reviews';
import { PublicMaster } from '../../types/master';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { showNotification } from '../../helpers/notifications';

interface Props {
  className?: string
}

export const ReviewsSection: React.FC<Props> = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { master } = useAppSelector(state => state.publicMasterSlice);

  const [ratingStars, setRatingStars] = useState<number | null>(null);
  const [statistics, setStatistics]
    = useState<PublicMaster['statistics'] | null>(null);
  const [reviewsCards, setReviewsCards] = useState<ContentReviews[]>([]);
  const [swiperRef, setSwiperRef] = useState<SwiperCore | null>(null);

  const statisticsStars = statistics && getRatings(Object.values(statistics));
  const sumStatisticsValues = statistics && Object
    .values(statistics)
    .reduce((acc, curr) => acc + curr, 0);

  useEffect(() => {
    if (id) {
      getMaster(+id)
        .then((res) => dispatch(publicMasterSlice.updateMaster(res)))
        .catch(() => showNotification('error'));
    }
  }, [dispatch, id]);

  useEffect(() => {
    getMaster(Number(id))
      .then((res) => {
        setRatingStars(res.rating);
        setStatistics(res.statistics);
      });
  }, [id]);

  useEffect(() => {
    getReviewsMaster(Number(id))
      .then((res) => {
        setReviewsCards(res.content);
      });
  }, [id]);

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
              <h3 className="reviews-section__info-header-rating">
                {ratingStars}
              </h3>

              <div className="reviews-section__info-header-blok">

                <p className="reviews-section__info-header-blok-text">
                  {statisticsStars}
                  {' '}
                  ratings
                </p>

                {ratingStars && (
                  <RatingStars
                    type="ready"
                    state={ratingStars}
                  />
                )}

              </div>
            </div>

            <Button size="large" className="reviews-section__button-first">
              Write review
            </Button>
          </div>

          <ul className="reviews-page__info-header-list">
            {statistics
              && sumStatisticsValues
              && Object.entries(statistics).map(item => {
                const [key, value] = item;
                const percent = 100;
                const percentValue = (value / sumStatisticsValues) * percent;

                return (
                  <li className="reviews-page__info-header-item">
                    <p className="reviews-page__info-header-rate">
                      {key.replace('count', '')}
                    </p>

                    <ProgressBar completed={percentValue} />

                  </li>
                );
              })}
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
                key={card.id}
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
