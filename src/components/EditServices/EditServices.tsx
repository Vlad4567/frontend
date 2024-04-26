import { useRef, useState } from 'react';
import { NewServiceForm } from '../NewServiceForm/NewServiceForm';
import { SwitchButtons } from '../SwitchButtons/SwitchButtons';
import { Service } from '../../types/services';
import { DropDownButton } from '../DropDownButton/DropDownButton';
import { CreateModal } from '../CreateModal/CreateModal';
import { ModalEditingService } from '../ModalEditingService/ModalEditingService';
import { useCreateMaster } from '../../hooks/useCreateMaster';
import { useServicesBySubcategory } from '../../hooks/useServicesBySubcategory';
import './EditServices.scss';

interface Props {
  className?: string;
}

type Modal = 'Service';

export const EditServices: React.FC<Props> = () => {
  const {
    createMasterData: { data: createMaster },
  } = useCreateMaster();
  const { master } = createMaster;
  const [modal, setModal] = useState<Modal | ''>('');
  const {
    servicesBySubcategory: { data: services },
    subcategory,
    setSubcategory,
    addService,
    deleteService,
    changeService,
  } = useServicesBySubcategory(
    createMaster.masterId as number,
    master.subcategories?.[0],
  );
  const modalRef = useRef<HTMLFormElement>(null);

  const handleModalClose = () => {
    setModal('');
  };

  const handleAddService = (item: Service) => {
    if (subcategory?.id) {
      return addService
        .mutateAsync({
          duration: item.duration,
          name: item.name,
          price: item.price,
          subcategoryId: subcategory.id,
          photoId: item.photo?.id || null,
        })
        .then(() => setModal(''));
    }

    setModal('');

    return Promise.reject();
  };

  const handleDeleteService = (id: number) => {
    deleteService.mutate(id);
  };

  const handleChangeService = (item: Service) => {
    changeService.mutate({
      ...item,
      photoId: item.photo?.id || null,
    });
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
          activeButton={subcategory}
          onClickButton={(_, button) => setSubcategory(button)}
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
        {!!services?.length &&
          services.map(service => (
            <li className="edit-services__services-item" key={service.id}>
              <NewServiceForm
                value={service}
                onDelete={() => handleDeleteService(service.id)}
                activeSubcategory={subcategory}
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
                activeSubcategory={subcategory}
                onClose={handleModalClose}
              />
            </CreateModal>
          )}
        </>

        <NewServiceForm
          className="edit-services__services-new-service-form"
          onAddService={handleAddService}
          activeSubcategory={subcategory}
        />
      </ul>
    </div>
  );
};
