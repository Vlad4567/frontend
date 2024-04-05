/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import { AxiosError } from 'axios';
import { Textarea } from '../Textarea/Textarea';
import { Button } from '../Button/Button';
import closeIcon from '../../img/icons/icon-dropdown-close.svg';
import { RatingStars } from '../RatingStars/RatingStars';
import './ModalReview.scss';
import { addNewReview } from '../../api/master';
import * as notificationSlice from '../../features/notificationSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { MasterReviewsCard } from '../../types/reviews';
import { ErrorData } from '../../types/main';

interface Props {
  className?: string;
  onClose: () => void;
  addCard: (card: MasterReviewsCard) => void;
}

const initialForm = {
  grade: 0,
  comment: '',
};

export const ModalReview = React.forwardRef<HTMLFormElement, Props>(({
  className = '',
  onClose = () => { },
  addCard = () => { },
}, ref) => {
  const publicMaster = useAppSelector(state => state.publicMasterSlice);
  const { user } = useAppSelector(state => state.userSlice);
  const dispatch = useAppDispatch();
  const [form, setForm] = useState(initialForm);
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');
  const [formError, setFormError] = useState('');
  const { grade, comment } = form;
  const { master } = publicMaster;

  const handleChangeField = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setForm(prew => ({
      ...prew,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (master.id) {
      addNewReview(master.id, form)
        .then(() => {
          setForm(initialForm);
          addCard(
            {
              masterCardId: +Date.now(),
              dateTime: new Date().toString(),
              grade,
              comment,
              id: +Date.now(),
              user: {
                ...user,
                id: +Date.now(),
              },
            },
          );

          onClose();
        })
        .catch((err: AxiosError<ErrorData<string>>) => {
          if (err.response?.data.errors?.comment) {
            setFormError(err.response.data.errors.comment);
          }

          dispatch(notificationSlice.addNotification({
            id: +new Date(),
            type: 'error',
          }));
        });
    }
  };

  return (
    <form
      className={`modal-review ${className}`}
      ref={ref}
      onSubmit={handleSubmit}
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

      {(!token || !refreshToken) && (
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
        </div>
      )}

      <div className="modal-review__wrapper">
        <small className="modal-review__wrapper-description">
          Rate the master&#x27;s services on a 5-point scale
        </small>
        <RatingStars
          type={!token || !refreshToken ? 'ready' : 'select'}
          state={grade}
          setState={value => setForm(prew => ({
            ...prew,
            grade: +value,
          }))}
        />
      </div>

      <Textarea
        name="comment"
        title="Your feedback"
        placeholder="Your feedback"
        rows={3}
        value={comment}
        onChange={e => handleChangeField(e)}
        disabled={!token || !refreshToken}
        errorText={formError}
      />

      <Button
        type="submit"
        size="small"
        className="modal-review__form-button"
        disabled={!grade || !comment}
      >
        Send
      </Button>
    </form>
  );
});
