import { modifyPhotoName } from '../helpers/functions';
import { Page } from '../types/main';
import { MasterCard } from '../types/master';
import { client } from '../utils/axiosClient';
import { downloadPhoto } from './account';

export const addFavoriteMasterCard = (masterCardId: number) => {
  return client.post(`/master/${masterCardId}/favorite`);
};

export const removeFavoriteMasterCard = (masterCardId: number) => {
  return client.delete(`/master/${masterCardId}/favorite`);
};

export const getFavoriteMasterCards = async (page: number, size: number) => {
  const favoriteMasterCards = await client.get<Page<MasterCard>>(
    `/master/favorite?page=${page}&size=${size}`,
  );

  const favoriteMasterCardsWithPhotos = await Promise.all(
    favoriteMasterCards.content.map(async favoriteMasterCard => {
      if (favoriteMasterCard.mainPhoto) {
        const photo = await downloadPhoto(
          modifyPhotoName(favoriteMasterCard.mainPhoto, 'MainMini'),
        );

        // eslint-disable-next-line no-param-reassign
        favoriteMasterCard.mainPhoto = URL.createObjectURL(new Blob([photo]));
      }

      return favoriteMasterCard;
    }),
  );

  return {
    ...favoriteMasterCards,
    content: favoriteMasterCardsWithPhotos,
  };
};
