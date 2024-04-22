import { Service } from '../types/services';
import { client } from '../utils/axiosClient';
import { downloadPhoto } from './account';
import { modifyPhotoName } from '../helpers/functions';

export const getServicesBySubcategory = async (
  masterId: number,
  subcategoryId: number,
) => {
  const services = await client.get<Service[]>(
    `/master/${masterId}/servicecard?subcategoryId=${subcategoryId}`,
  );

  const servicesWithPhotos = await Promise.all(
    services.map(async service => {
      if (service.photo) {
        const photo = await downloadPhoto(
          modifyPhotoName(service.photo.photoUrl, 'Category'),
        );

        // eslint-disable-next-line no-param-reassign
        service.photo.photoUrl = URL.createObjectURL(new Blob([photo]));
      }

      return service;
    }),
  );

  return servicesWithPhotos;
};

interface AddNewService extends Required<Omit<Service, 'id' | 'photo'>> {
  photoId: number;
}

export const addNewService = (service: AddNewService) => {
  return client.post<Service>('/servicecard', service);
};

export const deleteService = (serviceId: number) => {
  return client.delete(`/serviceCard/${serviceId}`);
};

interface PutService extends Omit<Service, 'photo'> {
  photoId: number | null;
}

export const putService = (service: PutService) => {
  return client.put<Service>(`/serviceCard/${service.id}`, service);
};
