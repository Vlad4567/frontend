import { useEffect, useRef, useState } from 'react';
import { Navigation } from 'swiper/modules';
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { useDocumentTitle, useOnClickOutside } from 'usehooks-ts';
import { SwiperSlide, Swiper } from 'swiper/react';
import {
  getMaster, getRandomMasterPhotos, getReviewsMaster,
} from '../../api/master';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import * as notificationSlice from '../../features/notificationSlice';
import * as publicMasterSlice from '../../features/publicMasterSlice';
import { GalleryPhoto } from '../../types/gallery';
import { DropDownButton } from '../../components/DropDownButton/DropDownButton';
import { ButtonWithArrow }
  from '../../components/ButtonWithArrow/ButtonWithArrow';
import { websiteName } from '../../helpers/variables';
import { SwitchButtons } from '../../components/SwitchButtons/SwitchButtons';
import { SubCategory } from '../../types/category';
import { getServicesBySubcategory } from '../../api/services';
import { Service } from '../../types/services';
import { Stars } from '../../components/Stars/Stars';
import { ConnectWithMasterSection }
  from '../../components/ConnectWithMasterSection/ConnectWithMasterSection';
import { ArrowButton } from '../../components/ArrowButton/ArrowButton';
import { Button } from '../../components/Button/Button';
import { CreateModal } from '../../components/CreateModal/CreateModal';
import { ModalReview } from '../../components/ModalReview/ModalReview';
import { ProgressBar } from '../../components/ProgressBar/ProgressBar';
import { ReviewsCard } from '../../components/ReviewsCard/ReviewsCard';
import { Page } from '../../types/main';
import { MasterReviewsCard } from '../../types/reviews';
import { RatingStars } from '../../components/RatingStars/RatingStars';
import './MasterPage.scss';

type Modal = 'newReview';

export const MasterPage: React.FC = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { master } = useAppSelector(state => state.publicMasterSlice);
  const [activeSubcategory, setActiveSubcategory]
    = useState<SubCategory | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [activeService, setActiveService] = useState<Service | null>(null);
  const [mainPhotos, setMainPhotos] = useState<GalleryPhoto[]>([]);
  const [searchParams] = useSearchParams();
  const [reviewsCardPage, setReviewsCardPage]
    = useState<Page<MasterReviewsCard> | null>(null);
  const [masterReviewsPage, setMasterReviewsPage] = useState(0);
  const [modal, setModal] = useState<Modal | ''>('');
  const modalRef = useRef<HTMLFormElement>(null);

  useDocumentTitle(master.firstName || 'Master');

  const { statistics, rating } = master;
  const sumStatisticsValues = statistics && Object
    .values(statistics)
    .reduce((acc, curr) => acc + curr, 0);

  useOnClickOutside<HTMLFormElement>([
    modalRef,
  ], () => setModal(''));

  const loadReviewsMaster = () => {
    if (!reviewsCardPage || masterReviewsPage <= reviewsCardPage.totalPages) {
      getReviewsMaster(Number(id), masterReviewsPage, 20)
        .then(res => setReviewsCardPage(c => (c
          ? {
            ...res,
            content: c ? [...c.content, ...res.content] : res.content,
          }
          : res)))
        .catch(() => dispatch(notificationSlice.addNotification({
          id: +new Date(),
          type: 'error',
        })));
      setMasterReviewsPage(c => c + 1);
    }
  };

  const openModalReview = () => {
    setModal('newReview');
  };

  const handleAddCard = (newCard: MasterReviewsCard) => {
    if (reviewsCardPage?.totalElements) {
      const ratingCalculate = rating
      && rating * reviewsCardPage?.totalElements;

      const reultRatingCalculate = ratingCalculate
        && (ratingCalculate + newCard.grade)
        / (reviewsCardPage?.totalElements + 1);

      dispatch(publicMasterSlice.updateMaster({
        rating: reultRatingCalculate && +reultRatingCalculate?.toFixed(1),
      }));
    }

    dispatch(publicMasterSlice.updateStatistics({ [`count${newCard.grade}`]: newCard.grade }));

    loadReviewsMaster();
  };

  useEffect(() => {
    if (id) {
      getMaster(+id)
        .then((res) => {
          dispatch(publicMasterSlice.updateMaster(res));
          getRandomMasterPhotos(res.id)
            .then(setMainPhotos)
            .catch(() => dispatch(notificationSlice.addNotification({
              id: +new Date(),
              type: 'error',
            })));

          setActiveSubcategory(res.subcategories?.[0] || {
            id: 0,
            name: '',
          });
        })
        .catch(() => dispatch(notificationSlice.addNotification({
          id: +new Date(),
          type: 'error',
        })));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (activeSubcategory && id) {
      getServicesBySubcategory(+id, activeSubcategory.id)
        .then(setServices)
        .catch(() => dispatch(notificationSlice.addNotification({
          id: +new Date(),
          type: 'error',
        })));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSubcategory, id]);

  useEffect(() => {
    if (searchParams.get('scroll') === 'chat') {
      const chatButton
        = document.querySelector('.master-page__connect-with-master');

      if (chatButton) {
        chatButton.scrollIntoView({ behavior: 'smooth' });
      }
    }

    loadReviewsMaster();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="master-page">
      <ArrowButton
        className="master-page__back"
        position="left"
        onClick={() => navigate('/')}
      />

      <div className="master-page__body">
        <section className="master-page__info">
          {!!mainPhotos.length && (
            <div className="master-page__info-gallery">
              {mainPhotos.map((photo) => (
                <Link
                  to="./gallery"
                  key={photo.id}
                  className="master-page__info-gallery-item-link"
                >
                  <h3 className="master-page__info-gallery-item-link-title">
                    View Gallery
                  </h3>
                  <div
                    className="master-page__info-gallery-item"
                    style={{
                      backgroundImage: `url(${photo.photoUrl})`,
                    }}
                  />
                </Link>
              ))}
            </div>
          )}
          <div className="master-page__info-title">
            <div className="master-page__info-title-left">
              <h1 className="master-page__info-title-left-name">
                {`${master.firstName} ${master.lastName}`}
              </h1>

              {!!master.subcategories?.length && (
                <div className="master-page__info-title-left-subcategories">
                  {master.subcategories
                    && master.subcategories.map(subcategory => (
                      <DropDownButton
                        size="large"
                        className="master-page__info-title-left-subcategory"
                        key={subcategory.id}
                      >
                        {subcategory.name}
                      </DropDownButton>
                    ))}
                </div>
              )}
            </div>
            <ButtonWithArrow
              className="master-page__info-title-chat"
              onClick={() => {
                const element
                  = document.querySelector('.master-page__connect-with-master');

                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Chat
            </ButtonWithArrow>
          </div>

          {master.description && (
            <div className="master-page__info-description">
              <h3 className="master-page__info-description-title">
                About me
              </h3>
              <p className="master-page__info-description-text">
                {master.description}
              </p>
            </div>
          )}
        </section>

        {!!master.subcategories?.length && (
          <section className="master-page__services">
            <h1 className="master-page__services-title">
              Services to
              {' '}
              <span className="master-page__services-title-span">
                {websiteName}
              </span>
              <Stars type="dark" size="large" />
            </h1>
            <div className="master-page__services-main">
              <article className="master-page__services-main-wrapper">
                <SwitchButtons
                  buttons={master.subcategories}
                  activeButton={
                    activeSubcategory || { id: -1, name: '' }
                  }
                  onClickButton={(_, item) => setActiveSubcategory(item)}
                  className="master-page__services-main-subcategories"
                />

                <hr className="master-page__services-main-divider" />

                <div className="master-page__services-main-content">
                  <div className="master-page__services-main-item">
                    <small className="master-page__services-main-item-small">
                      Service
                    </small>
                    <small className="master-page__services-main-item-small">
                      Price, ₴
                    </small>
                    <small className="master-page__services-main-item-small">
                      Duration, min (approx.)
                    </small>
                  </div>
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="master-page__services-main-item"
                      role="button"
                      tabIndex={0}
                      onKeyDown={() => setActiveService(service)}
                      onClick={() => setActiveService(service)}
                    >
                      <p className="master-page__services-main-item-p">
                        {service.name}
                      </p>
                      <p className="master-page__services-main-item-p">
                        {`₴ ${service.price}`}
                      </p>
                      <p className="master-page__services-main-item-p">
                        {`${service.duration} min`}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
              {activeService && (
                <img
                  className="master-page__services-main-image"
                  src={activeService.photo?.photoUrl}
                  alt={activeService.name || 'Service'}
                />
              )}
            </div>
          </section>
        )}

        {!!reviewsCardPage?.content.length && (
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
                        {reviewsCardPage.totalElements}
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
                          addCard={card => handleAddCard(card)}
                        />
                      </CreateModal>
                    )}
                  </>
                </div>

                <ul className="master-page__reviews-info-header-list">
                  {statistics
                    && sumStatisticsValues
                    && Object.entries(statistics)
                      .sort((a, b) => a[0].localeCompare(b[0]))
                      .map(item => {
                        const [key, value] = item;
                        const percent = 100;
                        const percentValue = (
                          value / sumStatisticsValues) * percent;

                        return (
                          <li className="master-page__reviews-info-header-item">
                            <p
                              className="master-page__reviews-info-header-rate"
                            >
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
                        addCard={card => handleAddCard(card)}
                      />
                    </CreateModal>
                  )}
                </>
              </article>

              <figure className="master-page__reviews-swiper">
                <Swiper
                  navigation={{
                    nextEl: '.master-page__reviews-swiper-control-next',
                    prevEl: '.master-page__reviews-swiper-control-prev',
                  }}
                  modules={[Navigation]}
                  className="master-page__reviews-swiper-slides"
                  spaceBetween="20px"
                  slidesPerView="auto"
                  onReachEnd={loadReviewsMaster}
                >
                  {reviewsCardPage?.content.map((card) => (
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
                  <ArrowButton
                    className="master-page__reviews-swiper-control-prev"
                    position="left"
                  />
                  <ArrowButton
                    className="master-page__reviews-swiper-control-next"
                    position="right"
                  />
                </figcaption>
              </figure>

            </div>
          </section>
        )}

        <ConnectWithMasterSection
          className="master-page__connect-with-master"
          name={`${master.firstName} ${master.lastName}`}
          contacts={master.contacts}
        />
      </div>
    </main>
  );
};
