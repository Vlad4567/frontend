import React, { useState } from 'react';

import closeIcon from '../../img/icons/icon-dropdown-close.svg';
import { LoginInput } from '../LoginInput/LoginInput';
import { Textarea } from '../Textarea/Textarea';
import { Button } from '../Button/Button';
import './ContactsUs.scss';

export const ContactUs: React.FC = () => {
  const [userNameInput, setUserNameInput] = useState('');
  const [userContactsInput, setUserContactsInput] = useState('');
  const [textarea, setTextarea] = useState('');

  return (
    <form className="contact-us">
      <div className="contact-us__wraper">

        <div className="contact-us__header">
          <h3 className="contact-us__header-title">Contacts us</h3>
          <img
            src={closeIcon}
            alt="Close Icon"
            className="contact-us__header-close-icon"
          />
        </div>

        <LoginInput
          title="Full name"
          placeholder="Full name"
          value={userNameInput}
          onChange={(e) => setUserNameInput(e.target.value)}
        />

        <LoginInput
          title="E-mail or Phone number"
          placeholder="E-mail or Phone number"
          value={userContactsInput}
          onChange={(e) => setUserContactsInput(e.target.value)}
        />

      </div>

      <Textarea
        title="Message"
        placeholder="Message"
        rows={3}
        value={textarea}
        onChange={setTextarea}
      />

      <Button
        size="small"
        className="contact-us__form-button"
      >
        Send
      </Button>
    </form>
  );
};
