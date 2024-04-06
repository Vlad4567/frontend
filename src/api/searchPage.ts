import { modifyPhotoName } from '../helpers/functions';
import { Page } from '../types/main';
import { MasterCard, ServiceCard } from '../types/master';
import { City } from '../types/searchPage';
import { client } from '../utils/axiosClient';
import { downloadPhoto } from './account';

export const getCities = (page: number, size: number, text: string) => {
  return client.get<Page<City>>(`/city/search?page=${page}&size=${size}&text=${text}`);
};

export const getFilteredMasterCards = async (
  page: number,
  size: number,
  params: string,
) => {
  const masterCards = await client.get<Page<MasterCard>>(
    `/master/search?page=${page}&size=${size}&${params}`,
  );

  const masterCardsWithPhotos = await Promise.all(
    masterCards.content.map(async (masterCard) => {
      if (masterCard.mainPhoto) {
        const photo = await downloadPhoto(
          modifyPhotoName(masterCard.mainPhoto, 'MainMini'),
        );

        // eslint-disable-next-line no-param-reassign
        masterCard.mainPhoto = URL.createObjectURL(new Blob([photo]));
      }

      return masterCard;
    }),
  );

  return {
    ...masterCards,
    content: masterCardsWithPhotos,
  };
};

export const getFilteredServiceCards = async (
  page: number,
  size: number,
  params: string,
) => {
  const serviceCards = await client.get<Page<ServiceCard>>(
    `/servicecard/search?page=${page}&size=${size}&${params}`,
  );

  const serviceCardsWithPhotos = await Promise.all(
    serviceCards.content.map(async (serviceCard) => {
      if (serviceCard.photo) {
        const photo = await downloadPhoto(
          modifyPhotoName(serviceCard.photo, 'ServiceCard'),
        );

        // eslint-disable-next-line no-param-reassign
        serviceCard.photo = URL.createObjectURL(new Blob([photo]));
      }

      return serviceCard;
    }),
  );

  return {
    ...serviceCards,
    content: serviceCardsWithPhotos,
  };
};
