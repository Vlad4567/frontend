import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDocumentTitle } from 'usehooks-ts';
import { getMaster, getRandomMasterPhotos } from '../../api/master';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { showNotification } from '../../helpers/notifications';
import * as publicMasterSlice from '../../features/publicMasterSlice';
import { GalleryPhoto } from '../../types/gallery';
import { DropDownButton } from '../../components/DropDownButton/DropDownButton';
import { ButtonWithArrow }
  from '../../components/ButtonWithArrow/ButtonWithArrow';
import './MasterPage.scss';
import { websiteName } from '../../helpers/variables';
import { SwitchButtons } from '../../components/SwitchButtons/SwitchButtons';
import { SubCategory } from '../../types/category';
import { getServicesBySubcategory } from '../../api/services';
import { Service } from '../../types/services';
import { Stars } from '../../components/Stars/Stars';

export const MasterPage: React.FC = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { master } = useAppSelector(state => state.publicMasterSlice);
  const [activeSubcategory, setActiveSubcategory]
    = useState<SubCategory | null>(null);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [activeService, setActiveService] = useState<Service | null>(null);
  const [mainPhotos, setMainPhotos] = useState<GalleryPhoto[]>([]);

  useDocumentTitle(master.firstName || 'Master');

  useEffect(() => {
    if (id) {
      getMaster(+id)
        .then((res) => {
          dispatch(publicMasterSlice.updateMaster(res));
          getRandomMasterPhotos(res.id)
            .then(setMainPhotos)
            .catch(() => showNotification('error'));

          setSubcategories(res.subcategories || []);
          setActiveSubcategory(res.subcategories?.[0] || {
            id: 0,
            name: '',
          });
        })
        .catch(() => showNotification('error'));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (activeSubcategory && id) {
      getServicesBySubcategory(+id, activeSubcategory.id)
        .then(setServices)
        .catch(() => showNotification('error'));
    }
  }, [activeSubcategory, id]);

  return (
    <main className="master-page">
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
            </div>
            <ButtonWithArrow
              className="master-page__info-title-chat"
            >
              Chat
            </ButtonWithArrow>
          </div>
          <div className="master-page__info-description">
            <h3 className="master-page__info-description-title">
              About me
            </h3>
            <p className="master-page__info-description-text">
              {master.description}
            </p>
          </div>
        </section>
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
                buttons={subcategories}
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
      </div>
    </main>
  );
};
