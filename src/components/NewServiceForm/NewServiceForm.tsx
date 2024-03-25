/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useRef, useState } from 'react';
import { useDebounce, useOnClickOutside } from 'usehooks-ts';
import classNames from 'classnames';
import { Button } from '../Button/Button';
import { LoginInput } from '../LoginInput/LoginInput';
import { CreateModal } from '../CreateModal/CreateModal';
import { MasterGallery }
  from '../MasterGallery/MasterGallery';
import photoPlus from '../../img/icons/tabler-photo-plus.svg';
import deleteBasket from '../../img/icons/delete-basket.svg';
import { Service } from '../../types/services';
import { SubCategory } from '../../types/category';
import { debounceDelay } from '../../helpers/variables';
import { GalleryPhoto } from '../../types/gallery';
import { showNotification } from '../../helpers/notifications';
import { DropDownButton } from '../DropDownButton/DropDownButton';
import { ModalEditingService }
  from '../ModalEditingService/ModalEditingService';
import './NewServiceForm.scss';

interface Props {
  className?: string
  value?: Service
  activeSubcategory: SubCategory | null
  onDelete?: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => void
  onAddService?: (service: Service) => Promise<unknown>
  onChange?: (service: Service) => void
}

const newService: Service = {
  id: -1,
  name: '',
  price: null,
  duration: null,
  subcategoryId: null,
  photo: null,
};

type Modal = 'Gallery' | 'Service';

export const NewServiceForm: React.FC<Props> = ({
  className = '',
  value = null,
  activeSubcategory,
  onDelete = () => {},
  onAddService = () => Promise.reject(),
  onChange = () => {},
}) => {
  const [modal, setModal] = useState<Modal | ''>('');
  const modalRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState<Service>(value || newService);
  const debouncedForm = useDebounce(form, debounceDelay);

  useEffect(() => {
    if (value) {
      if (JSON.stringify(value)
      !== JSON.stringify(debouncedForm)) {
        onChange(debouncedForm);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedForm]);

  useOnClickOutside(modalRef, () => {
    setModal('');
  });

  const handleChangePhoto = () => {
    if (form.photo) {
      setForm({ ...form, photo: null });

      return;
    }

    setModal('Gallery');
  };

  const handleClickSaveGallery = (item: GalleryPhoto) => {
    setModal('');
    setForm({ ...form, photo: item });
  };

  const handleAddService = () => {
    onAddService(form)
      .then(() => setForm(newService))
      .catch(() => showNotification('error'));
  };

  return (
    <form className={`new-service-form ${className}`}>
      <LoginInput
        type="text"
        name="title"
        className="new-service-form__field"
        placeholder="Service"
        value={form.name || ''}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />

      <LoginInput
        type="text"
        name="price"
        className="new-service-form__field"
        placeholder="₴ Price"
        value={form.price || ''}
        onChange={e => setForm({
          ...form,
          price: +e.target.value.replace(/\D/g, ''),
        })}
      />

      <p className="new-service-form__field-paragraph">
        {form.name}
      </p>

      <div className="new-service-form__field-group">
        <LoginInput
          type="text"
          name="duration"
          className="new-service-form__field"
          placeholder="Duration"
          value={form.duration || ''}
          onChange={e => setForm({
            ...form,
            duration: +e.target.value.replace(/\D/g, ''),
          })}
        />

        <div className="new-service-form__buttons">
          <>
            <DropDownButton
              size="small"
              placeholder="Edit"
              className="new-service-form__buttons-edit"
              onClick={() => setModal('Service')}
            />
            {modal === 'Service' && (
              <CreateModal>
                <ModalEditingService
                  value={form}
                  activeSubcategory={activeSubcategory}
                  onClose={() => setModal('')}
                  onChange={setForm}
                  onApply={() => setModal('')}
                />
              </CreateModal>
            )}
          </>

          <div
            className={classNames({
              'new-service-form__picture-container': form.photo,
            })}
            onClick={handleChangePhoto}
          >
            <img
              src={form.photo?.photoUrl || photoPlus}
              alt="Plus"
              className={form.photo?.id
                ? 'new-service-form__picture'
                : 'new-service-form__icon'}
            />
          </div>

          {modal === 'Gallery' && (
            <CreateModal>
              <MasterGallery
                type="service"
                ref={modalRef}
                onClickCancel={() => setModal('')}
                subcategories={activeSubcategory ? [activeSubcategory] : []}
                onClickSave={handleClickSaveGallery}
              />
            </CreateModal>
          )}

          {form.id >= 0 ? (
            <div className="new-service-form__delete">
              <img
                src={deleteBasket}
                alt="Basket"
                className="new-service-form__delete-icon"
                onClick={onDelete}
              />
            </div>
          ) : (
            <Button
              type="button"
              className="new-service-form__add"
              size="small"
              disabled={form.name === ''
                || form.price === null
                || form.duration === null
                || form.photo === null}
              onClick={handleAddService}
            >
              +
            </Button>
          )}

        </div>
      </div>
    </form>
  );
};
