/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginInput } from '../LoginInput/LoginInput';
import iconInstagram from '../../img/icons/icon-instagram.svg';
import iconFacebook from '../../img/icons/icon-facebook.svg';
import iconTelegram from '../../img/icons/icon-telegram.svg';
import iconPhone from '../../img/icons/icon-phone.svg';
import { DropDownButton } from '../DropDownButton/DropDownButton';
import { Button } from '../Button/Button';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import * as createMasterSlice from '../../features/createMasterSlice';
import './EditContacts.scss';

const getFormattedInputValue = (value: string) => {
  const digitsOnly = value.replace(/\D/g, '').slice(0, 12);

  let res = '';

  if (digitsOnly.length > 0) {
    res = `${digitsOnly.slice(0, 3)}`;
  }

  if (digitsOnly.length >= 4) {
    res = `+ (${res}) ${digitsOnly.slice(3, 5)}`;
  }

  if (digitsOnly.length >= 5) {
    res = `${res} ${digitsOnly.slice(5, 8)}`;
  }

  if (digitsOnly.length >= 8) {
    res = `${res} ${digitsOnly.slice(8, 10)}`;
  }

  if (digitsOnly.length >= 10) {
    res = `${res} ${digitsOnly.slice(10, 12)}`;
  }

  return res.trim();
};

export const EditContacts: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleCancel = () => {
    dispatch(createMasterSlice.editContacts({
      instagram: null,
      facebook: null,
      telegram: null,
      phone: null,
    }));
  };

  const {
    contacts: {
      instagram, facebook, telegram, phone,
    },
  } = useAppSelector(state => state.createMasterSlice);

  const handleSetPhoneValue = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    dispatch(createMasterSlice.editContacts({
      phone: e.target.value.replace(/\D/g, '') || null,
    }));
  };

  return (
    <>
      <form className="edit-contacts">
        <h3 className="edit-contacts__title">Contacts</h3>

        <div className="edit-contacts__main">
          <label className="edit-contacts__main-block">
            <img
              src={iconInstagram}
              alt="Instagram"
              className="edit-contacts__main-block-icon"
            />

            <LoginInput
              type="text"
              className="edit-contacts__main-field"
              title="Instagram link"
              placeholder="Instagram link"
              value={instagram || ''}
              onChange={e => dispatch(createMasterSlice.editContacts({
                instagram: e.target.value || null,
              }))}
            />
          </label>

          <label className="edit-contacts__main-block">
            <img
              src={iconFacebook}
              alt="Facebook"
              className="edit-contacts__main-block-icon"
            />

            <LoginInput
              type="text"
              className="edit-contacts__main-field"
              title="Facebook link"
              placeholder="Facebook link"
              value={facebook || ''}
              onChange={e => dispatch(createMasterSlice.editContacts({
                facebook: e.target.value || null,
              }))}
            />
          </label>

          <label className="edit-contacts__main-block">
            <img
              src={iconTelegram}
              alt="Telegram"
              className="edit-contacts__main-block-icon"
            />

            <LoginInput
              type="text"
              className="edit-contacts__main-field"
              title="Telegram username"
              placeholder="Telegram username"
              value={telegram || ''}
              onChange={(e) => dispatch(createMasterSlice.editContacts({
                telegram: e.target.value || null,
              }))}
            />
          </label>

          <label className="edit-contacts__main-block">
            <img
              src={iconPhone}
              alt="Phone"
              className="edit-contacts__main-block-icon"
            />

            <LoginInput
              type="tel"
              pattern="[0-9]{10}"
              className="edit-contacts__main-field"
              title="Phone number"
              placeholder="Phone number"
              value={getFormattedInputValue(phone || '')}
              onChange={handleSetPhoneValue}
            />
          </label>
        </div>
      </form>

      <div className="edit-contacts__profile">

        <DropDownButton
          size="large"
          className="edit-contacts__profile-button"
          placeholder="Cancel"
          onClick={handleCancel}
        />

        <Button
          size="large"
          className="edit-contacts__profile-button"
          onClick={() => navigate('../address')}
        >
          Continue
        </Button>

      </div>

    </>
  );
};
