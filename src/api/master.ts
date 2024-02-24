import { FilterMasterCard } from '../types/master';
import { client } from '../utils/axiosClient';

export const getMasterCard = (pageNumber: number, pageSize: number) => {
  return client.get<FilterMasterCard>(`/masterSortByRating?pageNumber=${pageNumber}&pageSize=${pageSize}`);
};
