/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { forwardRef, useEffect, useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import classNames from 'classnames';
import closeIcon from '../../img/icons/icon-dropdown-close.svg';
import { SubCategory } from '../../types/category';
import { Button } from '../Button/Button';
import { DropDownButton } from '../DropDownButton/DropDownButton';
import { SwitchButtons } from '../SwitchButtons/SwitchButtons';
import deleteBasket from '../../img/icons/delete-basket.svg';
import addImg from '../../img/icons/tabler-photo-plus.svg';
import { GalleryPhoto } from '../../types/gallery';
import { ModalAlertMessage } from '../ModalAlertMessage/ModalAlertMessage';
import { CreateModal } from '../CreateModal/CreateModal';
import { useCreateMaster } from '../../hooks/useCreateMaster';
import { useGalleryPhotos } from '../../hooks/useGalleryPhotos';
import './MasterGallery.scss';
import { useMaster } from '../../hooks/useMaster';
import { useParams } from 'react-router-dom';

type TypeComponent = 'service' | 'portfolio' | 'edit-profile';

interface Props {
  type?: TypeComponent;
  className?: string;
  subcategories?: SubCategory[];
  onClickCancel?: () => void;
  onClickSave?: (value: GalleryPhoto) => void;
}

export const MasterGallery = forwardRef<HTMLFormElement, Props>(
  (
    {
      type = 'edit-profile',
      className = '',
      subcategories = null,
      onClickCancel = () => {},
      onClickSave = () => {},
    },
    ref,
  ) => {
    const { id } = useParams();

    const subcategoriesList =
      subcategories ||
      (type === 'portfolio'
        ? // eslint-disable-next-line react-hooks/rules-of-hooks
          useMaster(+(id || '0')).master.data?.subcategories
        : // eslint-disable-next-line react-hooks/rules-of-hooks
          useCreateMaster().createMasterData.data.master.subcategories) ||
      [];

    const {
      galleryPhotos,
      selectedSubcategory,
      setSelectedSubcategory,
      updateMainPhoto,
      mainPhoto,
      setMainPhoto,
      isSelectPhoto,
      setIsSelectPhoto,
      deleteGalleryPhoto,
      addGalleryPhoto,
    } = useGalleryPhotos(
      subcategoriesList[0],
      typeof id === 'undefined' ? undefined : +id,
    );
    const [deleteModal, setDeleteModal] = useState<number | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<HTMLDivElement>(null);

    useOnClickOutside<HTMLDivElement | HTMLButtonElement>(modalRef, () =>
      setDeleteModal(null),
    );

    const handleAddPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { files } = e.target;

      if (files) {
        for (let i = 0; i < files.length; i += 1) {
          addGalleryPhoto.mutate(files[i]);
        }
      }
    };

    const handleDeletePhoto = (pictureId: GalleryPhoto['id']) => {
      deleteGalleryPhoto
        .mutateAsync(pictureId)
        .then(() => setDeleteModal(null));
    };

    const handleSaveChanges = () => {
      if (mainPhoto) {
        onClickSave(mainPhoto);
      }
    };

    const handleChoosePhoto = (photo: GalleryPhoto) => {
      if (isSelectPhoto && type === 'edit-profile') {
        updateMainPhoto.mutate(photo);
      }

      if (type === 'service') {
        setMainPhoto(photo);
        setIsSelectPhoto(true);
      }
    };

    useEffect(() => {
      let observer: IntersectionObserver;

      if (selectedSubcategory) {
        observer = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting) {
            galleryPhotos.fetchNextPage();
          }
        });

        observer.observe(observerRef.current as HTMLDivElement);
      }

      return () => observer && observer.disconnect();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSubcategory]);

    useEffect(() => {
      if (subcategoriesList.length) {
        setSelectedSubcategory(subcategoriesList[0]);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subcategoriesList]);

    return (
      <form className={`master-gallery ${className}`} ref={ref}>
        {(type === 'edit-profile' || type === 'service') && (
          <div
            className={classNames('master-gallery__header', {
              'master-gallery__header--edit-profile': type === 'edit-profile',
              'master-gallery__header--service': type === 'service',
            })}
          >
            <div className="master-gallery__header-wrapper">
              <div className="master-gallery__block">
                <h3 className="master-gallery__title">
                  {type === 'edit-profile'
                    ? 'Gallery'
                    : 'Add a photo to the service'}
                </h3>
                {type === 'service' && (
                  <img
                    alt="Close Icon"
                    className="master-gallery__close-icon"
                    src={closeIcon}
                    onClick={onClickCancel}
                  />
                )}
              </div>

              <small className="master-gallery__description">
                {type === 'edit-profile'
                  ? // eslint-disable-next-line max-len
                    'Add photos of your work and choose one main photo for your profile'
                  : // eslint-disable-next-line max-len
                    'You can select only 1 photo for this service from the gallery'}
              </small>
            </div>

            {type === 'edit-profile' && selectedSubcategory && (
              <div className="master-gallery__gallery">
                <DropDownButton
                  size="large"
                  className="master-gallery__gallery-button"
                >
                  <input
                    className="master-gallery__gallery-field"
                    type="file"
                    multiple
                    accept="image/*"
                    size={5000000}
                    onChange={e => handleAddPhotos(e)}
                  />
                  <img
                    src={addImg}
                    alt="Add Pictures"
                    className="master-gallery__gallery-button-img"
                  />
                  Add photos
                </DropDownButton>

                {!!galleryPhotos.data?.pages[0].content.length && (
                  <DropDownButton
                    size="large"
                    className={classNames('master-gallery__gallery-button', {
                      'master-gallery__gallery-button-active': isSelectPhoto,
                    })}
                    onClick={() => setIsSelectPhoto(c => !c)}
                  >
                    Select the main photo
                  </DropDownButton>
                )}
              </div>
            )}
          </div>
        )}

        <div className="master-gallery__main">
          <SwitchButtons
            buttons={subcategoriesList}
            className={classNames('master-gallery__switch-buttons', {
              'master-gallery__switch-buttons--disabled': type === 'service',
            })}
            activeButton={selectedSubcategory}
            onClickButton={(_, button) => setSelectedSubcategory(button)}
          />
          <div className="master-gallery__list">
            {galleryPhotos.data?.pages.flatMap(page =>
              page.content.map(photo => {
                return (
                  <div className="master-gallery__list-item" key={photo.id}>
                    <img
                      src={photo.photoUrl}
                      alt="Servises"
                      className={classNames('master-gallery__list-photo', {
                        'master-gallery__list-photo--active':
                          photo.id === mainPhoto?.id &&
                          (isSelectPhoto || type === 'service'),
                        'master-gallery__list-photo--hover':
                          isSelectPhoto || type === 'service',
                      })}
                      onClick={() => handleChoosePhoto(photo)}
                    />

                    {deleteModal === photo.id && (
                      <CreateModal>
                        <ModalAlertMessage
                          title="Do you want to delete this photo?"
                          dangerPlaceholder="Delete photo"
                          onClickDanger={() => handleDeletePhoto(photo.id)}
                          onClose={() => setDeleteModal(null)}
                          ref={modalRef}
                        />
                      </CreateModal>
                    )}

                    {type === 'edit-profile' && (
                      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                      <span
                        className="master-gallery__list-delete"
                        onClick={() => setDeleteModal(photo.id)}
                      >
                        <img
                          src={deleteBasket}
                          alt="Delete Basket"
                          className="master-gallery__icon-basket"
                        />
                      </span>
                    )}
                  </div>
                );
              }),
            )}
          </div>

          <div ref={observerRef} />
        </div>

        {type === 'service' && (
          <div className="master-gallery__footer">
            <DropDownButton
              size="large"
              placeholder="Cancel"
              className="master-gallery__footer-button"
              onClick={onClickCancel}
            />
            <Button
              size="large"
              className="master-gallery__footer-button"
              disabled={!mainPhoto}
              onClick={handleSaveChanges}
            >
              Save changes
            </Button>
          </div>
        )}
      </form>
    );
  },
);
MasterGallery.displayName = 'MasterGallery';
