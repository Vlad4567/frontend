import { SubCategory } from '../types/category';
import { GalleryPhoto } from '../types/gallery';
import { City } from '../types/searchPage';
import { client } from '../utils/axiosClient';
import { Page } from '../types/main';
import { downloadPhoto } from './account';
import { modifyPhotoName } from '../helpers/functions';

export interface EditMaster {
  firstName: string | null,
  lastName: string | null,
  contacts: {
    instagram: string | null,
    facebook: string | null,
    telegram: string | null,
    phone: string | null
  },
  address: {
    city: City | null,
    street: string | null,
    houseNumber: string | null,
    description: string | null
  },
  description: string | null,
  subcategories: SubCategory[] | null
}

export const getEditMaster = () => {
  return client.get<EditMaster>('/master');
};

export const getGalleryPhotos = async (
  page: number,
  size: number,
  subcategoryId: number,
) => {
  const photos = await client.get<Page<GalleryPhoto>>(
    `/photo/subcategory/${subcategoryId}?page=${page}&size=${size}`,
  );

  const photosWithPhotos = await Promise.all(
    photos.content.map(async (photo) => {
      if (photo.photoUrl) {
        const downloadedPhoto = await downloadPhoto(
          modifyPhotoName(photo.photoUrl, 'Gallery'),
        );

        // eslint-disable-next-line no-param-reassign
        photo.photoUrl = URL.createObjectURL(new Blob([downloadedPhoto]));
      }

      return photo;
    }),
  );

  return {
    ...photos,
    content: photosWithPhotos,
  };
};

export const postGalleryPhoto = (id: number, file: FormData) => {
  return client.post(`/mastercard/upload?subcategoryId=${id}`, file, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const addGalleryPhoto = (id: number, file: FormData) => {
  return client.post<GalleryPhoto>(`/mastercard/upload?subcategoryId=${id}`, file, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateMainPhoto = (id: number) => {
  return client.put(`/photo/update/main?id=${id}`);
};

export const deleteGalleryPhoto = (id: number) => {
  return client.delete(`/photo/delete?id=${id}`);
};
