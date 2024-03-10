import { Page } from '../types/main';
import { MasterCard, ServiceCard } from '../types/master';
import { City } from '../types/searchPage';
import { client } from '../utils/axiosClient';

export const getCities = (page: number, size: number, text: string) => {
  return client.get<Page<City>>(`/city/search?page=${page}&size=${size}&text=${text}`);
};

export const getFilteredMasterCards = (
  page: number,
  size: number,
  params: string,
) => {
  return client
    .get<Page<MasterCard>>(`/master/search?page=${page}&size=${size}&${params}`);
};

export const getFilteredServiceCards = (
  page: number,
  size: number,
  params: string,
) => {
  return client
    .get<Page<ServiceCard>>(`/servicecard/search?page=${page}&size=${size}&${params}`);
};
