/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import { useNavigate } from 'react-router-dom';
import { Button } from '../Button';
import { DropDownButton } from '../DropDownButton/DropDownButton';
import { LoginInput } from '../LoginInput/LoginInput';
import { Textarea } from '../Textarea/Textarea';
import { City } from '../../types/searchPage';
import { useUser } from '../../hooks/useUser';
import { useCreateMaster } from '../../hooks/useCreateMaster';
import { useCities } from '../../hooks/useCities';
import './EditAddress.scss';

type ActiveModal = '' | 'city' | 'cleanMaster';

export const EditAddress: React.FC = () => {
  const {
    queryUser: { data: user },
  } = useUser();
  const navigate = useNavigate();
  const {
    createMasterData: {
      data: createMasterState,
      refetch: createMasterStateRefetch,
    },
    saveChanges,
    createMaster,
    editAddress,
  } = useCreateMaster();

  const { address } = createMasterState.master;

  const {
    cities: { data: cityList },
    cityValue,
    setCityValue,
  } = useCities(address.city?.name);
  const cityListRef = useRef<HTMLUListElement>(null);
  const [activeModal, setActiveModal] = useState<ActiveModal>('');

  const handleSubmit = () => {
    if (createMasterState.editMode) {
      saveChanges.mutate();
    } else {
      createMaster.mutateAsync().then(() => {
        if (createMasterState.master.subcategories?.length !== 0) {
          navigate('../gallery');
        }
      });
    }
  };

  const handleCancel = () => {
    if (createMasterState.editMode) {
      createMasterStateRefetch();
    } else {
      navigate('/account');
    }
  };

  const handleCityClick = (item: City) => {
    editAddress({
      city: item,
    });
    setCityValue(item.name);
    setActiveModal('');
  };

  const handleCityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCityValue(e.target.value);
    setActiveModal(e.target.value ? 'city' : '');

    if (!e.target.value) {
      editAddress({
        city: null,
      });
    }
  };

  useOnClickOutside(cityListRef, () => {
    setCityValue(createMasterState.master.address.city?.name || '');
    setActiveModal('');
  });

  return (
    <>
      <form
        className="edit-address__form"
        style={
          user.master && !createMasterState.editMode
            ? {
                pointerEvents: 'none',
              }
            : {}
        }
      >
        <div className="edit-address__header">
          <h3 className="edit-address__title">Address</h3>
          <small className="edit-address__subtitle">Add your work adress</small>
        </div>

        <div className="edit-address__inputs">
          <div className="edit-address__inputs-city-wrapper">
            <LoginInput
              title="City"
              placeholder="City"
              value={cityValue}
              onChange={handleCityInput}
            />

            {activeModal === 'city' && (
              <ul className="edit-address__inputs-city-list" ref={cityListRef}>
                {cityList.map(item => (
                  <li
                    className="edit-address__inputs-city-item"
                    key={item.id}
                    onClick={() => handleCityClick(item)}
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <LoginInput
            title="Street"
            placeholder="Street"
            value={address.street || ''}
            onChange={e =>
              editAddress({
                street: e.target.value || null,
              })
            }
          />
          <LoginInput
            title="Building"
            placeholder="Building"
            value={address.houseNumber || ''}
            onChange={e =>
              editAddress({
                houseNumber: e.target.value || null,
              })
            }
          />
          <Textarea
            // eslint-disable-next-line max-len
            placeholder="Enter additional information about the address so that the client can find you more easily"
            title="Additional (optional)"
            autoGrow
            value={address.description || ''}
            onChange={e =>
              editAddress({
                description: e.target.value || null,
              })
            }
          />
        </div>
      </form>

      {(!user.master || (user.master && createMasterState.editMode)) && (
        <div className="edit-address__controls">
          <DropDownButton
            placeholder="Cancel"
            size="large"
            className="edit-address__controls-button"
            onClick={handleCancel}
          />

          <Button
            size="small"
            className="edit-address__controls-button"
            onClick={handleSubmit}
          >
            {createMasterState.master.subcategories?.length !== 0 ||
            createMasterState.editMode
              ? 'Continue'
              : 'Save changes'}
          </Button>
        </div>
      )}
    </>
  );
};
