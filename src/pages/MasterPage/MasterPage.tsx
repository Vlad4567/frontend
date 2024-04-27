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
import { DropDownButton } from '../../components/DropDownButton/DropDownButton';
import { ButtonWithArrow } from '../../components/ButtonWithArrow';
import { websiteName } from '../../helpers/variables';
import { SwitchButtons } from '../../components/SwitchButtons/SwitchButtons';
import { Stars } from '../../components/Stars/Stars';
import { ConnectWithMasterSection } from '../../components/ConnectWithMasterSection';
import { ArrowButton } from '../../components/ArrowButton';
import { Button } from '../../components/Button';
import { CreateModal } from '../../components/CreateModal';
import { ModalReview } from '../../components/ModalReview/ModalReview';
import { ProgressBar } from '../../components/ProgressBar/ProgressBar';
import { ReviewsCard } from '../../components/ReviewsCard/ReviewsCard';
import { RatingStars } from '../../components/RatingStars/RatingStars';
import { useReviewsMaster } from '../../hooks/useReviewsMaster';
import { useMaster } from '../../hooks/useMaster';
import { useServicesBySubcategory } from '../../hooks/useServicesBySubcategory';
import './MasterPage.scss';

type Modal = 'newReview';

export const MasterPage: React.FC = () => {
  const { id } = useParams();
  const {
    reviewsMaster: {
      data: reviewsMaster,
      fetchNextPage: fetchNextPageReviewsMaster,
      refetch: refetchReviewsMaster,
    },
  } = useReviewsMaster(+(id as string));
  const navigate = useNavigate();
  const {
    master: { data: master, isLoading: isMasterLoading },
    randomMasterPhotos: {
      data: mainPhotos = [],
      isLoading: isRandomMasterPhotosLoading,
    },
  } = useMaster(+(id as string));
  const {
    servicesBySubcategory: {
      data: services = [],
      isLoading: isServicesBySubcategoryLoading,
    },
    activeService,
    setActiveService,
    subcategory: activeSubcategory,
    setSubcategory: setActiveSubcategory,
  } = useServicesBySubcategory(+(id as string));
  const [searchParams, setSearchParams] = useSearchParams();
  const [modal, setModal] = useState<Modal | ''>('');
  const modalRef = useRef<HTMLFormElement>(null);

  const isLoading =
    isServicesBySubcategoryLoading ||
    isRandomMasterPhotosLoading ||
    isMasterLoading;

  useEffect(() => {
    if (searchParams.get('scroll') === 'chat' && !isLoading) {
      const chatButton = document.querySelector(
        '.master-page__connect-with-master',
      );

      if (chatButton) {
        chatButton.scrollIntoView({ behavior: 'smooth' });
      }

      searchParams.delete('scroll');
      setSearchParams(searchParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  useEffect(() => {
    if (master?.subcategories) {
      setActiveSubcategory(master.subcategories[0]);
    }
  }, [master?.subcategories, setActiveSubcategory]);

  useOnClickOutside<HTMLFormElement>([modalRef], () => setModal(''));

  useDocumentTitle(master?.firstName || 'Master');

  const { statistics, rating = 0 } = master || {};
  const sumStatisticsValues =
    statistics &&
    Object.values(statistics).reduce((acc, curr) => acc + curr, 0);

  return (
    master && (
      <main className="master-page">
        <ArrowButton
          className="master-page__back"
          position="left"
          onClick={() => navigate(-1)}
        />

        <div className="master-page__body">
          <section className="master-page__info">
            {!!mainPhotos.length && (
              <div className="master-page__info-gallery">
                {mainPhotos.map(photo => (
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
                    {master.subcategories &&
                      master.subcategories.map(subcategory => (
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
                  const element = document.querySelector(
                    '.master-page__connect-with-master',
                  );

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
                Services to{' '}
                <span className="master-page__services-title-span">
                  {websiteName}
                </span>
                <Stars type="dark" size="large" />
              </h1>
              <div className="master-page__services-main">
                <article className="master-page__services-main-wrapper">
                  <SwitchButtons
                    buttons={master.subcategories}
                    activeButton={activeSubcategory || { id: -1, name: '' }}
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
                    {services.map(service => (
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

          <section className="master-page__reviews">
            <h2 className="master-page__reviews-title">Reviews</h2>

            <div className="master-page__reviews-body">
              <article className="master-page__reviews-info">
                {!!reviewsMaster?.pages[0].content.length && (
                  <>
                    <div className="master-page__reviews-info-header">
                      <div className="master-page__reviews-info-header-wraper">
                        <h3 className="master-page__reviews-info-header-rating">
                          {rating}
                        </h3>

                        <div className="master-page__reviews-info-header-blok">
                          <p
                            className="
                          master-page__reviews-info-header-blok-text
                          "
                          >
                            {
                              reviewsMaster.pages[
                                reviewsMaster.pages.length - 1
                              ].totalElements
                            }{' '}
                            ratings
                          </p>

                          {rating && <RatingStars state={rating} />}
                        </div>
                      </div>
                      <>
                        <Button
                          size="large"
                          className="master-page__reviews-button-first"
                          onClick={() => setModal('newReview')}
                        >
                          Write review
                        </Button>
                        {modal === 'newReview' && (
                          <CreateModal>
                            <ModalReview
                              onClose={() => setModal('')}
                              ref={modalRef}
                              addCard={() => refetchReviewsMaster()}
                            />
                          </CreateModal>
                        )}
                      </>
                    </div>

                    <ul className="master-page__reviews-info-header-list">
                      {statistics &&
                        sumStatisticsValues &&
                        Object.entries(statistics)
                          .sort((a, b) => a[0].localeCompare(b[0]))
                          .map(item => {
                            const [key, value] = item;
                            const percent = 100;
                            const percentValue =
                              (value / sumStatisticsValues) * percent;

                            return (
                              <li
                                key={item[0]}
                                className="
                                master-page__reviews-info-header-item
                                "
                              >
                                <p
                                  className="
                                master-page__reviews-info-header-rate
                                "
                                >
                                  {key.replace('count', '')}
                                </p>

                                <ProgressBar completed={percentValue} />
                              </li>
                            );
                          })}
                    </ul>
                  </>
                )}
                <>
                  <Button
                    size="large"
                    className="master-page__reviews-button-second"
                    onClick={() => setModal('newReview')}
                  >
                    Write review
                  </Button>
                  {modal === 'newReview' && (
                    <CreateModal>
                      <ModalReview
                        onClose={() => setModal('')}
                        ref={modalRef}
                        addCard={() => refetchReviewsMaster()}
                      />
                    </CreateModal>
                  )}
                </>
              </article>

              {!!reviewsMaster?.pages[0].content.length && (
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
                    onReachEnd={() => fetchNextPageReviewsMaster()}
                  >
                    {reviewsMaster?.pages
                      .flatMap(page => page.content)
                      .map(card => (
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
              )}
            </div>
          </section>

          <ConnectWithMasterSection
            className="master-page__connect-with-master"
            name={`${master.firstName} ${master.lastName}`}
            contacts={master.contacts}
          />
        </div>
      </main>
    )
  );
};
