/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { useElementSize } from 'usehooks-ts';
import './ReviewsCard.scss';
import AvatarUser from '../../img/default-avatar.svg';
import { extractFirstNumber } from '../../helpers/functions';

interface Props {
  id: number
}

export const ReviewsCard: React.FC<Props> = ({ id }) => {
  const [squareRef, { height }] = useElementSize();

  const mainInfo = document.querySelector('.reviews-card__main-info');
  const stylesMainInfo = mainInfo && window.getComputedStyle(mainInfo);

  return (
    <article className="reviews-card" key={id}>
      <div className="reviews-card__header">
        <img
          className="reviews-card__header-avatar"
          src={AvatarUser}
          alt="Avatar User"
        />
        <div className="reviews-card__header-title">
          <p className="reviews-card__header-title-name">Alla</p>
          <small className="reviews-card__header-title-date">12.05.23</small>
        </div>
      </div>

      <hr className="reviews-card__hr" />

      <div className="reviews-card__main">
        <div className="reviews-card__main-stars">
          {/* <RatingStars
            stars={5}
            state={ratingStars}
            setState={setRatingStars}
          /> */}
        </div>

        <p
          className="reviews-card__main-info"
          ref={squareRef}
          style={{ height: stylesMainInfo?.minHeight }}
        >
          Lorem ipsum dolor, sit amet consectetur
          adipisicing elit. Ullam assumenda molestiae
          doloremque illo quae ab deleniti velit? Veniam
          quia earum autem sed odio facilis sapiente ab,
          natyhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhLore
          m ipsum dolor, sit amet consectetur
          adipisicing elit. Ullam assumenda molestiae

        </p>

        {stylesMainInfo?.minHeight
          && height >= extractFirstNumber(stylesMainInfo.minHeight) && (
            <p
              className="reviews-card__main-read-more"
            // onClick={handleReadMore}
            >
              Read more
            </p>
          )}

      </div>
    </article>
  );
};
