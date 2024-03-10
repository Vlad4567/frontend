import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as types from '../../types/master';
import starRate from '../../img/icons/icon-star-rate.svg';
import { Button } from '../Button/Button';
import { DropDownButton } from '../DropDownButton/DropDownButton';
import defaultAvatar from '../../img/default-avatar.svg';
import './ServiceCard.scss';

interface Props {
  className?: string
  service: types.ServiceCard
}

export const ServiceCard: React.FC<Props> = ({
  className = '',
  service,
}) => {
  const navigate = useNavigate();

  const {
    name,
    photo,
    price,
    id,
  } = service;

  const {
    firstName,
    lastName,
    address,
    rating,
  } = service.masterCard;

  return (
    <article className={`service-card ${className}`}>
      <img
        src={photo || defaultAvatar}
        alt="Service"
        className="service-card__img"
      />

      <div className="service-card__rating">
        <img
          src={starRate}
          alt="Star rate"
          className="service-card__img-star"
        />
        {rating.toFixed(1)}
      </div>

      {(firstName || lastName) && (
        <div className="service-card__info">
          {firstName && lastName && (
            <h3 className="service-card__info-name">
              {firstName && firstName}
              {' '}
              {lastName && lastName}
            </h3>
          )}

          {name && (
            <small className="service-card__info-subcategory">
              {name}
              <span className="service-card__info-subcategory-split">|</span>
              {price}
            </small>
          )}

        </div>
      )}

      {(address.houseNumber || address.street || address.city) && (
        <p className="service-card__address">
          {address.houseNumber && address.houseNumber}
          {' '}
          {address.street && address.street}
          {' '}
          {address.city && address.city}
        </p>
      )}

      <div className="service-card__buttons">
        <Button
          size="large"
          className="service-card__buttons-chat"
          onClick={() => navigate(`/master/${id}`)}
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
