import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as types from '../../types/master';
import starRate from '../../img/icons/icon-star-rate.svg';
import './MasterCard.scss';
import { Button } from '../Button/Button';
import { DropDownButton } from '../DropDownButton/DropDownButton';
import defaultAvatar from '../../img/default-avatar.svg';

interface Props {
  className?: string
  master: types.MasterCard
}

export const MasterCard: React.FC<Props> = ({
  className = '',
  master,
}) => {
  const navigate = useNavigate();

  const {
    firstName,
    lastName,
    subcategories,
    mainPhoto,
    address,
    rating,
    id,
  } = master;

  return (
    <article className={`master-card ${className}`}>
      <img
        src={mainPhoto === null ? defaultAvatar : mainPhoto}
        alt="Master"
        className="master-card__img"
      />

      <div className="master-card__rating">
        <img
          src={starRate}
          alt="Star rate"
          className="master-card__img-star"
        />
        {rating.toFixed(1)}
      </div>

      {(firstName || lastName) && (
        <div className="master-card__info">
          {firstName && lastName && (
            <h3 className="master-card__info-name">
              {firstName && firstName}
              {' '}
              {lastName && lastName}
            </h3>
          )}

          {subcategories && (
            <small className="master-card__info-subcategories">
              {subcategories.map((subcategory, index) => (
                <div
                  className="master-card__info-subcategory"
                  key={subcategory.categoryId}
                >
                  {
                    subcategories.length === index + 1
                      ? `${subcategory.name}`
                      : `${subcategory.name},`
                  }
                </div>
              ))}
            </small>
          )}
        </div>
      )}

      {(address.houseNumber || address.street || address.city) && (
        <p className="master-card__address">
          {address.houseNumber && address.houseNumber}
          {' '}
          {address.street && address.street}
          {' '}
          {address.city && address.city}
        </p>
      )}

      <div className="master-card__buttons">
        <Button
          size="large"
          className="master-card__buttons-chat"
          onClick={() => navigate(`master/${id}`)}
        >
          Chat
        </Button>

        <DropDownButton
          size="large"
          placeholder="Details"
          onClick={() => navigate(`master/${id}`)}
        />
      </div>
    </article>
  );
};
