/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useRef, useState } from 'react';
import { useDebounce, useOnClickOutside } from 'usehooks-ts';
import { useNavigate } from 'react-router-dom';
import { Button } from '../Button/Button';
import { DropDownButton } from '../DropDownButton/DropDownButton';
import { LoginInput } from '../LoginInput/LoginInput';
import { Textarea } from '../Textarea/Textarea';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import * as createMasterSlice from '../../features/createMasterSlice';
import { City } from '../../types/searchPage';
import './EditAddress.scss';
import { getCities } from '../../api/searchPage';
import { showNotification } from '../../helpers/notifications';
import { createMaster, getEditMaster, putEditMaster } from '../../api/master';

type ActiveModal = '' | 'city' | 'cleanMaster';

export const EditAddress: React.FC = () => {
  const { user } = useAppSelector(state => state.userSlice);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const createMasterState = useAppSelector(state => state.createMasterSlice);

  const { address } = createMasterState.master;

  const cityListRef = useRef<HTMLUListElement>(null);
  const [cityValue, setCityValue] = useState(address.city?.name || '');
  const [cityList, setCityList] = useState<City[]>([]);
  const [activeModal, setActiveModal] = useState<ActiveModal>('');
  const debouncedCityValue = useDebounce(cityValue, 500);

  const handleSubmit = () => {
    if (createMasterState.editMode) {
      putEditMaster({
        ...createMasterState.master,
        address: {
          ...address,
          cityId: address.city?.id || null,
        },
        subcategories:
        createMasterState.master.subcategories?.map(item => item.id) || null,
      })
        .then(() => {
          dispatch(createMasterSlice.editOptions({
            editMode: false,
          }));
        })
        .catch(() => {
          showNotification('error');
        });
    } else {
      createMaster({
        ...createMasterState.master,
        address: {
          ...createMasterState.master.address,
          cityId: address.city?.id || null,
        },
        subcategories:
        createMasterState.master.subcategories?.map(item => item.id) || null,
      })
        .then(() => {
          if (createMasterState.master.subcategories?.length !== 0) {
            navigate('../gallery');
          }
        })
        .catch(() => showNotification('error'));
    }
  };

  const handleCancel = () => {
    if (createMasterState.editMode) {
      dispatch(createMasterSlice.deleteMaster());
      getEditMaster()
        .then(res => {
          dispatch(createMasterSlice.editMaster({
            firstName: res.firstName,
            lastName: res.lastName,
            contacts: {
              instagram: res.contacts.instagram,
              facebook: res.contacts.facebook,
              telegram: res.contacts.telegram,
              phone: res.contacts.phone,
            },
            address: {
              city: res.address.city,
              street: res.address.street,
              houseNumber: res.address.houseNumber,
              description: res.address.description,
            },
            description: res.description,
            subcategories: res.subcategories,
          }));
          dispatch(createMasterSlice.editOptions({
            hidden: res.hidden,
            masterId: res.id,
          }));
        })
        .catch(() => showNotification('error'));
    } else {
      navigate('..');
    }
  };

  const handleCityClick = (item: City) => {
    dispatch(createMasterSlice.editAddress({
      city: item,
    }));
    setCityValue(item.name);
    setActiveModal('');
  };

  const handleCityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCityValue(e.target.value);
    setActiveModal(e.target.value ? 'city' : '');

    if (!e.target.value) {
      dispatch(createMasterSlice.editAddress({
        city: null,
      }));
    }
  };

  useEffect(() => {
    if (debouncedCityValue) {
      getCities(0, 4, debouncedCityValue)
        .then(res => setCityList(res.content))
        .catch(() => showNotification('error'));
    } else {
      setCityList([]);
    }
  }, [debouncedCityValue]);

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
          <h3 className="edit-address__title">
            Address
          </h3>
          <small className="edit-address__subtitle">
            Add your work adress
          </small>
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
              <ul
                className="edit-address__inputs-city-list"
                ref={cityListRef}
              >
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
            onChange={e => dispatch(createMasterSlice.editAddress({
              street: e.target.value || null,
            }))}
          />
          <LoginInput
            title="Building"
            placeholder="Building"
            value={address.houseNumber || ''}
            onChange={e => dispatch(createMasterSlice.editAddress({
              houseNumber: e.target.value || null,
            }))}
          />
          <Textarea
            // eslint-disable-next-line max-len
            placeholder="Enter additional information about the address so that the client can find you more easily"
            title="Additional (optional)"
            autoGrow
            value={address.description || ''}
            onChange={e => dispatch(createMasterSlice.editAddress({
              description: e.target.value || null,
            }))}
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
            {
              createMasterState.master.subcategories?.length !== 0
                ? 'Continue'
                : 'Save changes'
            }
          </Button>
        </div>
      )}
    </>
  );
};
