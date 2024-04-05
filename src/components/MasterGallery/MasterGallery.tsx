/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
  forwardRef,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import classNames from 'classnames';
import closeIcon from '../../img/icons/icon-dropdown-close.svg';
import { SubCategory } from '../../types/category';
import { Button } from '../Button/Button';
import { DropDownButton } from '../DropDownButton/DropDownButton';
import { SwitchButtons } from '../SwitchButtons/SwitchButtons';
import deleteBasket from '../../img/icons/delete-basket.svg';
import addImg from '../../img/icons/tabler-photo-plus.svg';
import {
  addGalleryPhoto,
  deleteGalleryPhoto,
  getGalleryPhotos,
  updateMainPhoto,
}
  from '../../api/gallery';
import { GalleryPhoto } from '../../types/gallery';
import { downloadPhoto } from '../../api/account';
import * as notificationSlice from '../../features/notificationSlice';
import { ModalAlertMessage } from '../ModalAlertMessage/ModalAlertMessage';
import { CreateModal } from '../CreateModal/CreateModal';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import './MasterGallery.scss';
import { modifyPhotoName } from '../../helpers/functions';

type TypeComponent = 'service' | 'portfolio' | 'edit-profile';

type TypeModal = 'deletePhoto';

interface Props {
  type?: TypeComponent
  className?: string
  subcategories?: SubCategory[]
  onClickCancel?: () => void,
  onClickSave?: (value: GalleryPhoto) => void,
}

export const MasterGallery = forwardRef<HTMLFormElement, Props>(({
  type = 'edit-profile',
  className = '',
  subcategories = null,
  onClickCancel = () => { },
  onClickSave = () => { },
}, ref) => {
  const createMaster = useAppSelector(state => state.createMasterSlice);
  const dispatch = useAppDispatch();
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [activeButton, setActiveButton] = useState<SubCategory>(
    subcategories?.[0] || createMaster.master.subcategories?.[0] || {
      id: -1,
      name: '',
    },
  );
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);
  const [isSelectPhoto, setIsSelectPhoto] = useState(false);
  const [modal, setModal] = useState<TypeModal | ''>('');
  const [galleryPage, setGalleryPage] = useState(0);
  const [totalGalleryPage, setTotalGalleryPage] = useState(1);
  const modalRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);

  const subcategoriesList = subcategories
  || createMaster.master.subcategories
  || [];

  useOnClickOutside<HTMLDivElement | HTMLButtonElement>(
    modalRef,
    () => setModal(''),
  );

  const handleAddPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (files) {
      for (let i = 0; i < files.length; i += 1) {
        const file = files[i];
        const formData = new FormData();

        formData.append('file', file);

        addGalleryPhoto(activeButton.id, formData)
          .then(res => {
            downloadPhoto(modifyPhotoName(res.photoUrl, 'Gallery'))
              .then((photo) => {
                setPhotos(c => [...c, {
                  ...res,
                  photoUrl: URL.createObjectURL(
                    new Blob([photo],
                      { type: 'image/jpeg' }),
                  ),
                }]);
              });
          });
      }
    }
  };

  const handleDeletePhoto = (picture: GalleryPhoto) => {
    deleteGalleryPhoto(picture.id)
      .then(() => {
        setModal('');
        setPhotos((prevPhotos) => prevPhotos
          .filter(photo => photo.id !== picture.id));
      })
      .catch(() => dispatch(notificationSlice.addNotification({
        id: +new Date(),
        type: 'error',
      })));
  };

  const handleSaveChanges = () => {
    if (activePhoto) {
      onClickSave(activePhoto);
    }
  };

  const handleChoosePhoto = (photo: GalleryPhoto) => {
    if (isSelectPhoto && type === 'edit-profile') {
      updateMainPhoto(photo.id)
        .then(() => {
          setActivePhoto(photo);
          setIsSelectPhoto(false);
        })
        .catch(() => dispatch(notificationSlice.addNotification({
          id: +new Date(),
          type: 'error',
        })));
    }

    if (type === 'service') {
      setActivePhoto(photo);
      setIsSelectPhoto(true);
    }
  };

  const handleChooseSubcategory = (value: SubCategory) => {
    setActiveButton(value);
    setPhotos([]);
    setGalleryPage(0);
  };

  useEffect(() => {
    let observer: IntersectionObserver;

    if (activeButton.id >= 0) {
      observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (galleryPage < totalGalleryPage) {
            setGalleryPage(prev => prev + 1);
          } else {
            observer.disconnect();
          }
        }
      });

      observer.observe(observerRef.current as HTMLDivElement);
    }

    return () => observer && observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [galleryPage]);

  useEffect(() => {
    if (activeButton.id >= 0) {
      getGalleryPhotos(galleryPage, 5, activeButton.id)
        .then(res => {
          setTotalGalleryPage(res.totalPages);
          setPhotos((c) => [...c, ...res.content]);
          res.content.forEach(item => {
            if (item.isMain) {
              setActivePhoto(item);
            }
          });
        })
        .catch(() => dispatch(notificationSlice.addNotification({
          id: +new Date(),
          type: 'error',
        })));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [galleryPage, activeButton.id]);

  useEffect(() => {
    if (subcategories?.length) {
      setActiveButton(subcategories[0]);
    }
  }, [subcategories]);

  return (
    <form className={`master-gallery ${className}`} ref={ref}>
      {(type === 'edit-profile' || type === 'service') && (
        <div
          className={classNames('master-gallery__header',
            {
              'master-gallery__header--edit-profile':
                type === 'edit-profile',
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
                // eslint-disable-next-line max-len
                ? 'Add photos of your work and choose one main photo for your profile'
                // eslint-disable-next-line max-len
                : 'You can select only 1 photo for this service from the gallery'}
            </small>

          </div>

          {type === 'edit-profile' && (
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

              <DropDownButton
                size="large"
                className={
                  classNames('master-gallery__gallery-button', {
                    'master-gallery__gallery-button-active':
                      isSelectPhoto,
                  })
                }
                onClick={() => setIsSelectPhoto(c => !c)}
              >
                Select the main photo
              </DropDownButton>
            </div>
          )}
        </div>
      )}

      <div className="master-gallery__main">
        <SwitchButtons
          buttons={subcategoriesList}
          className="master-gallery__switch-buttons"
          activeButton={activeButton}
          onClickButton={(_, button) => handleChooseSubcategory(button)}
        />
        <div className="master-gallery__list">
          {photos.map(photo => {
            return (
              <div
                className="master-gallery__list-item"
                key={photo.id}
              >
                <img
                  src={photo.photoUrl}
                  alt="Servises"
                  className={classNames(
                    'master-gallery__list-photo', {
                      'master-gallery__list-photo--active':
                      photo.id === activePhoto?.id
                      && (isSelectPhoto || type === 'service'),
                      'master-gallery__list-photo--hover':
                      isSelectPhoto || type === 'service',
                    },
                  )}
                  onClick={() => handleChoosePhoto(photo)}
                />

                {modal === 'deletePhoto' && (
                  <CreateModal>
                    <ModalAlertMessage
                      title="Do you want to delete this photo?"
                      dangerPlaceholder="Delete photo"
                      onClickDanger={() => handleDeletePhoto(photo)}
                      onClose={() => setModal('')}
                      ref={modalRef}
                    />
                  </CreateModal>
                )}

                {type === 'edit-profile' && (
                  // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                  <span
                    className="master-gallery__list-delete"
                    onClick={() => setModal('deletePhoto')}
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
          })}
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
            disabled={!activePhoto}
            onClick={handleSaveChanges}
          >
            Save changes
          </Button>
        </div>
      )}
    </form>
  );
});
