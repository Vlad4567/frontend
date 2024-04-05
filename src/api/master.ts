import { modifyPhotoName } from '../helpers/functions';
import { SubCategory } from '../types/category';
import { GalleryPhoto } from '../types/gallery';
import { Page } from '../types/main';
import {
  EditMaster, FormReview, MasterCard, PublicMaster,
} from '../types/master';
import { MasterReviewsCard } from '../types/reviews';
import { City } from '../types/searchPage';
import { client } from '../utils/axiosClient';
import { downloadPhoto } from './account';

export const getRatingMasterCard
  = async (pageNumber: number, pageSize: number) => {
    const masterCards = await client.get<Page<MasterCard>>(
      `/masterSortByRating?pageNumber=${pageNumber}&pageSize=${pageSize}`,
    );

    const masterCardsWithRating = await Promise.all(
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
      content: masterCardsWithRating,
    };
  };

interface CreateMaster extends Omit<EditMaster, 'address' | 'subcategories'> {
  address: {
    cityId: City['id'] | null;
    street: string | null;
    houseNumber: string | null;
    description: string | null;
  };
  subcategories: number[] | null;
}

export const createMaster = (master: CreateMaster) => {
  return client.post('/new-master', master);
};

export const getMaster = (id: number) => {
  return client.get<PublicMaster>(`/master/${id}`);
};

export const getRandomMasterPhotos = async (id: number) => {
  const photos = await client.get<GalleryPhoto[]>(`/photo?masterCardId=${id}`);

  const photosWithPhotos = await Promise.all(
    photos.map(async (item) => {
      const photo = await downloadPhoto(
        modifyPhotoName(item.photoUrl, 'Gallery'),
      );

      // eslint-disable-next-line no-param-reassign
      item.photoUrl = URL.createObjectURL(new Blob([photo]));

      return item;
    }),
  );

  return photosWithPhotos;
};

export const putEditMaster = (master: CreateMaster) => {
  return client.put('/master', master);
};

export const deleteMaster = () => {
  return client.delete('/master');
};

export const hideMaster = () => {
  return client.put('/master/hide');
};

export const unhideMaster = () => {
  return client.put('/master/unhide');
};

export const addMasterSubcategory = (id: SubCategory['id']) => {
  return client.post(`/master/subcategory?id=${id}`);
};

export const deleteMasterSubcategory = (id: SubCategory['id']) => {
  return client.delete(`/master/subcategory?id=${id}`);
};

export const getReviewsMaster = async (
  idMaster: number,
  pageNumber: number,
  pageSize: number,
) => {
  const masterReviews = await client.get<Page<MasterReviewsCard>>(
    `/mastercart/${idMaster}/review?page=${pageNumber}&size=${pageSize}`,
  );

  const masterReviewsWithPhoto = await Promise.all(
    masterReviews.content.map(async (masterReview) => {
      if (masterReview.user.profilePhoto) {
        const photo = await downloadPhoto(
          modifyPhotoName(masterReview.user.profilePhoto, 'ReviewCard'),
        );

        // eslint-disable-next-line no-param-reassign
        masterReview.user.profilePhoto = URL.createObjectURL(new Blob([photo]));
      }

      return masterReview;
    }),
  );

  return {
    ...masterReviews,
    content: masterReviewsWithPhoto,
  };
};

export const addNewReview = (idMaster: number, form: FormReview) => {
  return client.post(`mastercart/${idMaster}/review`, form);
};
