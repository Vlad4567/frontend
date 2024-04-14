import { useEffect, useRef, useState } from 'react';
import { NewServiceForm } from '../NewServiceForm/NewServiceForm';
import { SwitchButtons } from '../SwitchButtons/SwitchButtons';
import { SubCategory } from '../../types/category';
import {
  addNewService,
  deleteService,
  getServicesBySubcategory,
  putService,
} from '../../api/services';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Service } from '../../types/services';
import * as notificationSlice from '../../features/notificationSlice';
import { DropDownButton } from '../DropDownButton/DropDownButton';
import { CreateModal } from '../CreateModal/CreateModal';
import { ModalEditingService } from '../ModalEditingService/ModalEditingService';
import './EditServices.scss';

interface Props {
  className?: string;
}

type Modal = 'Service';

export const EditServices: React.FC<Props> = () => {
  const createMaster = useAppSelector(state => state.createMasterSlice);
  const dispatch = useAppDispatch();
  const { master } = createMaster;
  const [modal, setModal] = useState<Modal | ''>('');
  const [services, setServices] = useState<Service[]>([]);
  const [activeSubcategory, setActiveSubcategory] =
    useState<SubCategory | null>(
      master.subcategories ? master.subcategories[0] : null,
    );
  const modalRef = useRef<HTMLFormElement>(null);

  const handleModalClose = () => {
    setModal('');
  };

  useEffect(() => {
    if (createMaster.masterId && activeSubcategory?.id) {
      getServicesBySubcategory(createMaster.masterId, activeSubcategory.id)
        .then(res => {
          setServices(res);
        })
        .catch(() =>
          dispatch(
            notificationSlice.addNotification({
              id: +new Date(),
              type: 'error',
            }),
          ),
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSubcategory?.id, createMaster.masterId]);

  const handleAddService = async (item: Service) => {
    if (item.photo && activeSubcategory?.id && item.photo?.id) {
      try {
        const res = await addNewService({
          duration: item.duration,
          name: item.name,
          price: item.price,
          subcategoryId: activeSubcategory.id,
          photoId: item.photo.id,
        });

        setServices([
          ...services,
          {
            ...item,
            subcategoryId: activeSubcategory.id,
            id: res.id,
          },
        ]);

        setModal('');

        return res;
      } catch (err) {
        dispatch(
          notificationSlice.addNotification({
            id: +new Date(),
            type: 'error',
          }),
        );

        setModal('');

        return err;
      }
    }

    setModal('');

    return Promise.reject();
  };

  const handleDeleteService = (id: number) => {
    deleteService(id)
      .then(() => {
        setServices(services.filter(service => service.id !== id));
      })
      .catch(() =>
        dispatch(
          notificationSlice.addNotification({
            id: +new Date(),
            type: 'error',
          }),
        ),
      );
  };

  const handleChangeService = (item: Service) => {
    putService({
      ...item,
      photoId: item.photo?.id || null,
    })
      .then(() => {
        setServices(c =>
          c.map(currService =>
            currService.id === item.id ? item : currService,
          ),
        );
      })
      .catch(() =>
        dispatch(
          notificationSlice.addNotification({
            id: +new Date(),
            type: 'error',
          }),
        ),
      );
  };

  return (
    <div className="edit-services">
      <div className="edit-services__header">
        <h3 className="edit-services__title">Services</h3>
        <small className="edit-services__description">
          Add to each selected category (your specialisation) the name of your
          service, price, approximate duration and 1 photo (optional, these
          photos will then be saved in the gallery)
        </small>
      </div>

      {master.subcategories && (
        <SwitchButtons
          buttons={master.subcategories}
          activeButton={activeSubcategory || master.subcategories[0]}
          onClickButton={(_, button) => setActiveSubcategory(button)}
        />
      )}

      <div className="edit-services__options">
        <small className="edit-services__options-title">Service</small>
        <small className="edit-services__options-title">Price, ₴</small>
        <small className="edit-services__options-title">
          Duration, min (approx.)
        </small>
      </div>

      <ul className="edit-services__services-list">
        {!!services.length &&
          services.map(service => (
            <li className="edit-services__services-item" key={service.id}>
              <NewServiceForm
                value={service}
                onDelete={() => handleDeleteService(service.id)}
                activeSubcategory={activeSubcategory}
                onChange={handleChangeService}
              />
            </li>
          ))}
        <>
          <DropDownButton
            size="small"
            placeholder="+  Add new service"
            className="edit-services__services-new-service-btn"
            onClick={() => setModal('Service')}
          />
          {modal === 'Service' && (
            <CreateModal>
              <ModalEditingService
                ref={modalRef}
                onAddService={handleAddService}
                activeSubcategory={activeSubcategory}
                onClose={handleModalClose}
              />
            </CreateModal>
          )}
        </>

        <NewServiceForm
          className="edit-services__services-new-service-form"
          onAddService={handleAddService}
          activeSubcategory={activeSubcategory}
        />
      </ul>
    </div>
  );
};
