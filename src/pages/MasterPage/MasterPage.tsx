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

export const MasterPage: React.FC = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { master } = useAppSelector(state => state.publicMasterSlice);
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
        })
        .catch(() => showNotification('error'));
    }
  }, [dispatch, id]);

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
      </div>
    </main>
  );
};
