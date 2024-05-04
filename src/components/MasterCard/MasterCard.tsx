import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as types from '../../types/master';
import starRate from '../../img/icons/icon-star-rate.svg';
import { Button } from '../Button/Button';
import { DropDownButton } from '../DropDownButton/DropDownButton';
import defaultAvatar from '../../img/default-avatar.svg';
import { useFavorite } from '../../hooks/useFavorite';
import heart from '../../img/icons/heart.svg';
import redHeart from '../../img/icons/red-heart.svg';
import './MasterCard.scss';
import { useToken } from '../../hooks/useToken';

interface Props {
  className?: string;
  master: types.MasterCard;
}

export const MasterCard: React.FC<Props> = ({ className = '', master }) => {
  const navigate = useNavigate();
  const [favorite, setFavorite] = useState(master.favorite);
  const { addFavorite, removeFavorite } = useFavorite();
  const {
    tokenStorage: { token },
    refreshTokenStorage: { refreshToken },
  } = useToken();

  const { firstName, lastName, subcategories, mainPhoto, address, rating, id } =
    master;

  const toggleFavorite = () => {
    (favorite ? removeFavorite : addFavorite)
      .mutateAsync(master.id)
      .then(() => {
        setFavorite(c => !c);
      });
  };

  return (
    <article className={`master-card ${className}`}>
      <img
        src={mainPhoto === null ? defaultAvatar : mainPhoto}
        alt="Master"
        className="master-card__img"
      />

      <div className="master-card__rating">
        <img src={starRate} alt="Star rate" className="master-card__img-star" />
        {rating.toFixed(1)}
      </div>
      {(token || refreshToken) && (
        <button className="master-card__favorite" onClick={toggleFavorite}>
          <img
            src={favorite ? redHeart : heart}
            alt="Favorite heart"
            className="master-card__img-heart"
          />
        </button>
      )}

      {(firstName || lastName) && (
        <div className="master-card__info">
          {firstName && lastName && (
            <h3 className="master-card__info-name">
              {firstName && firstName} {lastName && lastName}
            </h3>
          )}

          {subcategories && (
            <small className="master-card__info-subcategories">
              {subcategories.map((subcategory, index) => (
                <div
                  className="master-card__info-subcategory"
                  key={subcategory.name}
                >
                  {subcategories.length === index + 1
                    ? `${subcategory.name}`
                    : `${subcategory.name},`}
                </div>
              ))}
            </small>
          )}
        </div>
      )}

      {(address.houseNumber || address.street || address.city) && (
        <p className="master-card__address">
          {address.houseNumber && address.houseNumber}{' '}
          {address.street && address.street} {address.city && address.city}
        </p>
      )}

      <div className="master-card__buttons">
        <Button
          size="large"
          className="master-card__buttons-chat"
          onClick={() => navigate(`/master/${id}?scroll=chat`)}
        >
          Chat
        </Button>

        <DropDownButton
          size="large"
          placeholder="Details"
          onClick={() => navigate(`/master/${id}`)}
        />
      </div>
    </article>
  );
};
