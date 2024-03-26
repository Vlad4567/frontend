import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDocumentTitle, useOnClickOutside } from 'usehooks-ts';
import SwiperCore from 'swiper';
import { SwiperSlide, Swiper } from 'swiper/react';
import { getMaster, getReviewsMaster } from '../../api/master';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { showNotification } from '../../helpers/notifications';
import * as publicMasterSlice from '../../features/publicMasterSlice';
import { getRatings } from '../../helpers/functions';
import { RatingStars } from '../../components/RatingStars/RatingStars';
import { Button } from '../../components/Button/Button';
import { ProgressBar } from '../../components/ProgressBar/ProgressBar';
import { ArrowButton } from '../../components/ArrowButton/ArrowButton';
import { ReviewsCard } from '../../components/ReviewsCard/ReviewsCard';
import { MasterReviewsCard } from '../../types/reviews';
import { ModalReview } from '../../components/ModalReview/ModalReview';
import { CreateModal } from '../../components/CreateModal/CreateModal';
import './MasterPage.scss';


type Modal = 'newReview';

export const MasterPage: React.FC = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { master } = useAppSelector(state => state.publicMasterSlice);
  const [swiperRef, setSwiperRef] = useState<SwiperCore | null>(null);
  const modalRef = useRef<HTMLFormElement>(null);
  const [reviewsCards, setReviewsCards] = useState<MasterReviewsCard[]>([]);
  const [masterReviewsPage, setMasterReviewsPage] = useState(0);
  const [modal, setModal] = useState<Modal | ''>('');

  useDocumentTitle(master.firstName || 'Master');

  const { statistics, rating } = master;
  const statisticsStars = statistics && getRatings(Object.values(statistics));
  const sumStatisticsValues = statistics && Object
    .values(statistics)
    .reduce((acc, curr) => acc + curr, 0);

  useEffect(() => {
    if (id) {
      getMaster(+id)
        .then((res) => {
          dispatch(publicMasterSlice.updateMaster(res));
        })
        .catch(() => showNotification('error'));
    }
  }, [dispatch, id]);


  const handleClickOutside = () => {
    setModal('');
  };

  useOnClickOutside<HTMLFormElement>([
    modalRef,
  ], handleClickOutside);

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

  const loadReviewsMaster = () => {
    getReviewsMaster(Number(id), masterReviewsPage, 20)
      .then((response) => setReviewsCards(c => (c.length
        ? [...c, ...response.content]
        : response.content)))
      .catch(() => showNotification('error'));
    setMasterReviewsPage(c => c + 1);
  };

  const openModalReview = () => {
    setModal('newReview');
  };

  return (
    <main className="master-page">
      <div className="master-page__body">
        <section className="master-page__reviews">
          <h2 className="master-page__reviews-title">Reviews</h2>

          <div className="master-page__reviews-body">
            <article className="master-page__reviews-info">
              <div className="master-page__reviews-info-header">
                <div className="master-page__reviews-info-header-wraper">
                  <h3 className="master-page__reviews-info-header-rating">
                    {rating}
                  </h3>

                  <div className="master-page__reviews-info-header-blok">

                    <p className="master-page__reviews-info-header-blok-text">
                      {statisticsStars}
                      {' '}
                      ratings
                    </p>

                    {rating && (
                      <RatingStars
                        state={rating}
                      />
                    )}

                  </div>
                </div>
                <>
                  <Button
                    size="large"
                    className="master-page__reviews-button-first"
                    onClick={openModalReview}
                  >
                    Write review
                  </Button>
                  {modal === 'newReview' && (
                    <CreateModal>
                      <ModalReview
                        onClose={() => setModal('')}
                        ref={modalRef}
                      />
                    </CreateModal>
                  )}
                </>
              </div>

              <ul className="master-page__reviews-info-header-list">
                {statistics
                  && sumStatisticsValues
                  && Object.entries(statistics).map(item => {
                    const [key, value] = item;
                    const percent = 100;
                    const percentValue = (
                      value / sumStatisticsValues) * percent;

                    return (
                      <li className="master-page__reviews-info-header-item">
                        <p className="master-page__reviews-info-header-rate">
                          {key.replace('count', '')}
                        </p>

                        <ProgressBar completed={percentValue} />

                      </li>
                    );
                  })}
              </ul>
              <>
                <Button
                  size="large"
                  className="master-page__reviews-button-second"
                  onClick={openModalReview}
                >
                  Write review
                </Button>
                {modal === 'newReview' && (
                  <CreateModal>
                    <ModalReview
                      onClose={() => setModal('')}
                      ref={modalRef}
                    />
                  </CreateModal>
                )}
              </>
            </article>

            <figure className="master-page__reviews-swiper">
              <Swiper
                onSwiper={setSwiperRef}
                className="master-page__reviews-swiper-slides"
                spaceBetween="20px"
                slidesPerView="auto"
                onReachEnd={loadReviewsMaster}
              >
                {reviewsCards.map((card) => (
                  <SwiperSlide
                    key={card.id}
                    className="master-page__reviews-swiper-slide"
                    style={{ width: 'auto' }}
                  >
                    <ReviewsCard card={card} />
                  </SwiperSlide>
                ))}
              </Swiper>

              <figcaption className="master-page__reviews-swiper-control">
                <ArrowButton position="left" onClick={handlePrev} />
                <ArrowButton position="right" onClick={handleNext} />
              </figcaption>
            </figure>

          </div>
        </section>
      </div>
    </main>
  );
};
