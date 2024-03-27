/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, {
  MouseEventHandler, useEffect, useRef, useState,
} from 'react';
import { useOnClickOutside, useResizeObserver } from 'usehooks-ts';
import AvatarUser from '../../img/default-avatar.svg';
import { RatingStars } from '../RatingStars/RatingStars';
import closeIcon from '../../img/icons/icon-dropdown-close.svg';
import './ReviewsCard.scss';
import { CreateModal } from '../CreateModal/CreateModal';
import { MasterReviewsCard } from '../../types/reviews';

type Modal = 'ReviewsCard';

type TypeReviewsCard = 'modal' | 'card';

interface Props {
  type?: TypeReviewsCard,
  card: MasterReviewsCard,
  onClose?: MouseEventHandler<HTMLImageElement>,
}

export const ReviewsCard = React.forwardRef<HTMLFormElement, Props>(({
  type = 'card',
  onClose = () => { },
  card,
}, ref) => {
  const [modal, setModal] = useState<Modal | ''>('');
  const [isParagraphLarge, setIsParagraphLarge] = useState(false);
  const squareRef = React.useRef<HTMLParagraphElement>(null);
  const modalRef = useRef<HTMLFormElement>(null);
  const { height } = useResizeObserver({
    ref: squareRef,
  });

  const mainInfo = document.querySelector('.reviews-card__main-info');

  const {
    comment, grade, dateTime, user,
  } = card;

  const date = new Date(dateTime);
  const day = date.getDate();
  const year = date.getFullYear();
  const shortMonthName = new Intl
    .DateTimeFormat('en-US', { month: 'short' })
    .format;
  const monthName = shortMonthName(date);

  const handleReadMore = () => {
    setModal('ReviewsCard');
  };

  const handleClickOutside = () => {
    setModal('');
  };

  useOnClickOutside<HTMLFormElement>([
    modalRef,
  ], handleClickOutside);

  useEffect(() => {
    if (height
      && mainInfo?.clientHeight
      && height > mainInfo?.clientHeight
    ) {
      setIsParagraphLarge(true);
    }
  }, [height, mainInfo?.clientHeight]);

  return (
    <article
      className="reviews-card"
      style={type === 'modal' ? { maxWidth: '758px' } : {}}
      ref={ref}
    >
      <div className="reviews-card__header">
        <div className="reviews-card__header-block">
          <img
            className="reviews-card__header-avatar"
            src={user.profilePhoto || AvatarUser}
            alt="Avatar User"
          />
          <div className="reviews-card__header-title">
            <p className="reviews-card__header-title-name">{user.username}</p>
            <small className="reviews-card__header-title-date">
              {`${day} ${monthName} ${year}`}
            </small>
          </div>
        </div>

        {type === 'modal' && (
          <img
            className="reviews-card__header-close-icon"
            src={closeIcon}
            alt="Close Icon"
            onClick={onClose}
          />
        )}
      </div>

      <hr className="reviews-card__hr" />

      <div className="reviews-card__main">
        <div className="reviews-card__main-stars">
          <RatingStars
            state={+grade}
          />
        </div>

        <p
          className="reviews-card__main-info"
          ref={squareRef}
          style={type === 'card' && mainInfo
            ? { height: window.getComputedStyle(mainInfo).minHeight }
            : {}}
        >
          {comment}
        </p>

        <>
          {type === 'card'
            && isParagraphLarge
            && (
              <p
                className="reviews-card__main-read-more"
                onClick={handleReadMore}
              >
                Read more
              </p>
            )}

          {modal && (
            <CreateModal>
              <ReviewsCard
                type="modal"
                card={card}
                onClose={() => setModal('')}
                ref={modalRef}
              />
            </CreateModal>
          )}
        </>
      </div>
    </article>
  );
});
