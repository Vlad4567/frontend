/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';

import { Link, useParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import { Textarea } from '../Textarea/Textarea';
import { Button } from '../Button/Button';
import closeIcon from '../../img/icons/icon-dropdown-close.svg';
import { RatingStars } from '../RatingStars/RatingStars';
import { ErrorData } from '../../types/main';
import { useReviewsMaster } from '../../hooks/useReviewsMaster';
import './ModalReview.scss';
import { useToken } from '../../hooks/useToken';

interface Review {
  grade: number;
  comment: string;
}

const initialReview = {
  grade: 0,
  comment: '',
};

interface Props {
  className?: string;
  onClose: () => void;
  addCard: (card: Review) => void;
}

export const ModalReview = React.forwardRef<HTMLFormElement, Props>(
  ({ className = '', onClose = () => {}, addCard = () => {} }, ref) => {
    const { id } = useParams();
    const { addNewReview } = useReviewsMaster(+(id as string));
    const [review, setReview] = useState(initialReview);
    const {
      tokenStorage: [token],
      refreshTokenStorage: [refreshToken],
    } = useToken();
    const [formError, setFormError] = useState('');
    const { grade, comment } = review;

    const handleChangeField = (
      e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    ) => {
      setReview(prew => ({
        ...prew,
        [e.target.name]: e.target.value,
      }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (id) {
        addNewReview
          .mutateAsync(review)
          .then(() => {
            setReview(initialReview);
            addCard(review);

            onClose();
          })
          .catch((err: AxiosError<ErrorData<string>>) => {
            if (err.response?.data.errors?.comment) {
              setFormError(err.response.data.errors.comment);
            }
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
              First,{' '}
              <Link className="modal-review__item-link" to="/login">
                Log in
              </Link>{' '}
              or{' '}
              <Link className="modal-review__item-link" to="/login/signup">
                Sign up
              </Link>{' '}
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
            setState={value =>
              setReview(prew => ({
                ...prew,
                grade: +value,
              }))
            }
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
  },
);
ModalReview.displayName = 'ModalReview';
