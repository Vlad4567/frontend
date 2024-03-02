import { FilterMasterCard, Page, Review } from '../types/master';
import { client } from '../utils/axiosClient';

export const getMasterCard = (pageNumber: number, pageSize: number) => {
  return client.get<FilterMasterCard>(`/masterSortByRating?pageNumber=${pageNumber}&pageSize=${pageSize}`);
};

export const getMaster = (id: number) => {
  return client.get(`/master/${id}`);
};

export const getReviews = (masterId: number, page: number, size: number) => {
  return client.get<Page<Review>>(`/mastercart/${masterId}/review?page=${page}&size=${size}`);
};
