/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { forwardRef, useState } from 'react';

import { LoginInput } from '../LoginInput/LoginInput';
import { Button } from '../Button/Button';
import { DropDownButton } from '../DropDownButton/DropDownButton';
import { MasterGallery }
  from '../MasterGallery/MasterGallery';
import { CreateModal } from '../CreateModal/CreateModal';
import { SubCategory } from '../../types/category';
import deleteBasket from '../../img/icons/delete-basket.svg';
import closeIcon from '../../img/icons/icon-dropdown-close.svg';
import photoPlus from '../../img/icons/tabler-photo-plus.svg';
import { Service } from '../../types/services';
import './ModalEditingService.scss';
import { GalleryPhoto } from '../../types/gallery';
import * as notificationSlice from '../../features/notificationSlice';
import { useAppDispatch } from '../../app/hooks';

type Modal = 'Gallery';

interface Props {
  className?: string,
  value?: Service
  activeSubcategory: SubCategory | null
  onAddService?: (service: Service) => Promise<unknown>
  onApply?: () => void
  onChange?: (service: Service) => void
  onClose?: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => void
}

const newService: Service = {
  id: -1,
  name: '',
  price: null,
  duration: null,
  subcategoryId: null,
  photo: null,
};

export const ModalEditingService = forwardRef<HTMLFormElement, Props>(({
  className = '',
  value = null,
  activeSubcategory,
  onAddService = () => Promise.resolve(),
  onApply = () => {},
  onChange = () => {},
  onClose = () => {},
}, ref) => {
  const dispatch = useAppDispatch();
  const [modal, setModal] = useState<Modal | ''>('');
  const [form, setForm] = useState<Service>(value || newService);

  const handleClickSaveGallery = (item: GalleryPhoto) => {
    setModal('');
    setForm({ ...form, photo: item });
  };

  const handleApply = () => {
    onApply();
    if (form.id >= 0) {
      onChange(form);
    } else {
      onAddService(form)
        .then(() => setForm(newService))
        .catch(() => dispatch(notificationSlice.addNotification({
          id: +new Date(),
          type: 'error',
        })));
    }
  };

  return (
    <form className={`modal-editing-service ${className}`} ref={ref}>
      <div className="modal-editing-service__block">
        <div className="modal-editing-service__header">
          <h3 className="modal-editing-service__title">Editing a Service</h3>

          <img
            alt="Close Icon"
            className="modal-editing-service__close-icon"
            src={closeIcon}
            onClick={onClose}
          />

        </div>

        <LoginInput
          type="text"
          placeholder="Service"
          title="Service"
          value={form.name || ''}
          onChange={(e) => setForm(c => ({
            ...c,
            name: e.target.value,
          }))}
        />

        <LoginInput
          type="text"
          placeholder="₴ Price"
          title="₴ Price"
          value={form.price || ''}
          onChange={(e) => setForm(c => ({
            ...c,
            price: +e.target.value.replace(/\D/g, ''),
          }))}
        />

        <LoginInput
          type="text"
          placeholder="Duration, min (approx.)"
          title="Duration, min (approx.)"
          value={form.duration || ''}
          onChange={(e) => setForm(c => ({
            ...c,
            duration: +e.target.value.replace(/\D/g, ''),
          }))}
        />
      </div>
      <>
        {form.photo ? (
          <div className="modal-editing-service__wrapper-selected-photo">
            <img
              src={form.photo?.photoUrl || photoPlus}
              className="modal-editing-service__selected-photo"
              alt="Selected Service"
            />

            <div className="modal-editing-service__wrapper-buttons">
              <DropDownButton
                size="small"
                placeholder=""
                className="modal-editing-service__replace-photo"
                onClick={() => setModal('Gallery')}
              >
                <img
                  src={photoPlus}
                  alt="Plus"
                  className="modal-editing-service__dropdown-plus-icon"
                />

                Replace photo
              </DropDownButton>

              <DropDownButton
                size="small"
                placeholder=""
                className="modal-editing-service__delete-photo"
                onClick={() => setForm(c => ({
                  ...c,
                  photo: null,
                }))}
              >
                <img
                  src={deleteBasket}
                  alt="Plus"
                  className="modal-editing-service__delete-basket-icon"
                />

                Delete photo
              </DropDownButton>
            </div>
          </div>
        ) : (
          <div className="modal-editing-service__wrapper">
            <DropDownButton
              size="large"
              placeholder=""
              className="modal-editing-service__add-photo"
              onClick={() => setModal('Gallery')}
            >
              <img
                src={photoPlus}
                alt="Plus"
                className="modal-editing-service__dropdown-plus-icon"
              />
            </DropDownButton>
          </div>
        )}

        {modal === 'Gallery' && (
          <CreateModal>
            <MasterGallery
              type="service"
              onClickCancel={() => setModal('')}
              subcategories={activeSubcategory ? [activeSubcategory] : []}
              onClickSave={handleClickSaveGallery}
            />
          </CreateModal>
        )}
      </>

      <hr className="modal-editing-service__dropdown-hr" />

      <Button
        size="large"
        className="modal-editing-service__apply"
        onClick={handleApply}
      >
        Apply
      </Button>
    </form>
  );
});
