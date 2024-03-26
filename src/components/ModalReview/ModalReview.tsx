import React, { useState } from 'react';
import classNames from 'classnames';

import { Textarea } from '../Textarea/Textarea';
import { Button } from '../Button/Button';
import closeIcon from '../../img/icons/icon-dropdown-close.svg';
import './ModalReview.scss';
import { RatingStars } from '../RatingStars/RatingStars';
import { Link } from 'react-router-dom';
import { LoginInput } from '../LoginInput/LoginInput';

interface Props {
  className?: string;
  onClose: () => void;
}

const initialForm = {
  name: '',
  message: '',
}

export const ModalReview = React.forwardRef<HTMLFormElement, Props>(({
  className = '',
  onClose = () => { },
}, ref) => {
  // const [form, setForm] = useState(initialForm);
  // const [formErrors, setFormErrors] = useState(initialForm);

  // const { name, message } = form;

  // const { name, email, message } = form;
  // const { email: emailError, message: messageError } = formErrors;

  return (
    <form
      className={`modal-review ${className}`}
      ref={ref}
    >

      <div className="modal-review__header">
        <h3 className="modal-review__header-title">Review</h3>
        <img
          src={closeIcon}
          alt="Close Icon"
          className="modal-review__header-close-icon"
          onClick={onClose}
        />
      </div>

      <div className="modal-review__description">
        <p>
          First,
          {' '}
          <Link className="modal-review__item-link" to="/login">
            Log in
          </Link>
          {' '}
          or
          {' '}
          <Link className="modal-review__item-link" to="/login/signup">
            Sign up
          </Link>
          {' '}
          to write a review
        </p>

        <LoginInput
          name="name"
          title="Full name"
          placeholder="Full name"
        // value={name}
        // onChange={e => handleChangeField(e)}
        />
      </div>

      <div className="modal-review__wrapper">
        <small className="modal-review__wrapper-description">
          Rate the master&#x27;s services on a 5-point scale
        </small>
        <RatingStars
          type="select"
        />
      </div>

      <Textarea
        name="message"
        title="Your feedback"
        placeholder="Your feedback"
        rows={3}
      // value={message}
      // onChange={e => handleChangeField(e)}
      // errorText={messageError}
      />

      <Button
        size="small"
        className={classNames('modal-review__form-button', {
          'modal-review__form-button--disabled': true,
        })}
      >
        Send
      </Button>
    </form>
  );
});
