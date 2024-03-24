/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';

import { AxiosError } from 'axios';
import classNames from 'classnames';
import { LoginInput } from '../LoginInput/LoginInput';
import { Textarea } from '../Textarea/Textarea';
import { Button } from '../Button/Button';
import { sendContactUs } from '../../api/main';
import closeIcon from '../../img/icons/icon-dropdown-close.svg';
import { showNotification } from '../../helpers/notifications';
import { ErrorData } from '../../types/main';
import { objectKeys } from '../../helpers/functions';
import './ModalContactUs.scss';

interface Props {
  className?: string;
  onClose: () => void;
}

const initialForm = {
  name: '',
  email: '',
  message: '',
};

export const ModalContactUs = React.forwardRef<HTMLFormElement, Props>(({
  className = '',
  onClose = () => { },
}, ref) => {
  const [form, setForm] = useState(initialForm);
  const [formErrors, setFormErrors] = useState(initialForm);

  const { name, email, message } = form;
  const { email: emailError, message: messageError } = formErrors;

  const handleChangeField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setFormErrors(initialForm);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    sendContactUs(form)
      .then(() => {
        setForm(initialForm);
      })
      .catch((error: AxiosError<ErrorData<Partial<typeof initialForm>>>) => {
        if (error.response?.data.errors) {
          objectKeys(error.response?.data.errors).forEach(key => {
            setFormErrors(c => ({
              ...c,
              [key]: error.response?.data.errors?.[key] || '',
            }));
          });
          showNotification('error');
        }
      });
  };

  return (
    <form
      className={`contact-us ${className}`}
      onSubmit={handleSubmit}
      ref={ref}
    >
      <div className="contact-us__wrapper">

        <div className="contact-us__header">
          <h3 className="contact-us__header-title">Contact us</h3>
          <img
            src={closeIcon}
            alt="Close Icon"
            className="contact-us__header-close-icon"
            onClick={onClose}
          />
        </div>

        <LoginInput
          name="name"
          title="Full name"
          placeholder="Full name"
          value={name}
          onChange={e => handleChangeField(e)}
        />

        <LoginInput
          name="email"
          title="E-mail"
          placeholder="E-mail"
          value={email}
          onChange={e => handleChangeField(e)}
          errorText={emailError}
        />

      </div>

      <Textarea
        name="message"
        title="Message"
        placeholder="Message"
        rows={3}
        value={message}
        onChange={e => handleChangeField(e)}
        errorText={messageError}
      />

      <Button
        size="small"
        className={classNames('contact-us__form-button', {
          'contact-us__form-button--disabled': !!emailError || !!messageError,
        })}
      >
        Send
      </Button>
    </form>
  );
});
