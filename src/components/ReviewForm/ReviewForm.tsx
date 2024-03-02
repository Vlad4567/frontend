import React, { useState } from 'react';
import './ReviewForm.scss';
import closeIcon from '../../img/icons/icon-dropdown-close.svg';
import { Button } from '../Button/Button';
import { LoginInput } from '../LoginInput/LoginInput';
import { Textarea } from '../Textarea/Textarea';

export const ReviewForm: React.FC = () => {
  const [userNameInput, setUserNameInput] = useState('');
  // const [ratingStars, setRatingStars] = useState(0);
  const [textarea, setTextarea] = useState('');

  return (
    <article className="review-form">
      <div className="review-form__header">
        <h3 className="review-form__header-title">Review</h3>
        <img
          src={closeIcon}
          alt="Close Icon"
          className="review-form__header-close-icon"
        />
      </div>

      <p className="review-form__paragraph">
        First,
        <p className="review-form__paragraph-link">Login</p>
        or
        <p className="review-form__paragraph-link">Sign up</p>
        to write a review
      </p>

      <form className="review-form__form">
        <LoginInput
          title="Username"
          placeholder="Username"
          value={userNameInput}
          onChange={(e) => setUserNameInput(e.target.value)}
        />

        <div className="review-form__form-rating">
          <small className="review-form__form-rating-description">
            Rate the master&apos;s services on a 5-point scale
          </small>

          <div className="review-form__form-stars-rating">
            {/* <RatingStars
              stars={5}
              state={ratingStars}
              setState={setRatingStars}
            /> */}

          </div>
        </div>

        <Textarea
          title="Your feedback"
          placeholder="Username"
          rows={3}
          value={textarea}
          onChange={setTextarea}
        />

        <Button
          size="small"
          className="review-form__form-button"
        >
          Review
        </Button>
      </form>

    </article>
  );
};
